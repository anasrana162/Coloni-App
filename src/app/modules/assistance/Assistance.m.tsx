import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import Badge from '../../components/app/Badge.app';

import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/Assistance/Assistance.slice';
import {AssistanceStates, userStates} from '../../state/allSelector.state';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useCustomNavigation} from '../../packages/navigation.package';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DownArrow from '../..//assets/images/svg/downArrow.svg';
import ShowDate from '../../components/app/ShowDate.app';
import {useTranslation} from 'react-i18next';
import {screens} from '../../routes/routeName.route';
import {userRoles} from '../../assets/ts/core.data';
import {formatDate} from '../../utilities/helper';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';
import moment from 'moment';
import {colors} from '../../assets/global-styles/color.assets';
import SelectMonth from '../../components/app/SelectMonth.app';

const Assistance = () => {
  const {colors} = useTheme() as any;
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const [selectedBadge, setSelectedBadge] = useState('Rondines'); //added for filter
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    totalPages,
    status,
    results,
    total,
  } = customUseSelector(AssistanceStates);
  console.log('checking list', list);
  const [itemCount, setItemCount] = useState(0);
  const {t: trans} = useTranslation();

  const onRefresh = useCallback(() => {
    dispatch(refreshingAction({search}));
  }, [dispatch, search]);
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );
  useEffect(() => {
    setItemCount(results);
  }, [list]);
  const [pagination, setPagination] = useState({
    Rondines: {page: 1, perPage: 10, totalPages: 1},
    Attendance: {page: 1, perPage: 10, totalPages: 1},
  });
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const filteredList = useMemo(() => {
    return list.filter(item => {
      const isBadgeMatch = item?.toursType === selectedBadge;
      if (!selectedDate) return isBadgeMatch;
      const itemDate = new Date(item.createdAt);
      const isDateMatch =
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getFullYear() === selectedDate.getFullYear();
      return isBadgeMatch && isDateMatch;
    });
  }, [list, selectedBadge, selectedDate]);

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    dispatch(searchingAction({date: newDate, search}));
  };
  // const loadMore = () => {
  //   hasMore && dispatch(gettingMoreAction({ page, perPage, search }));
  // };
  const loadMore = () => {
    const currentTabPagination = pagination[selectedBadge];
    if (
      hasMore &&
      currentTabPagination.page < currentTabPagination.totalPages
    ) {
      dispatch(
        gettingMoreAction({
          page: currentTabPagination.page + 1,
          perPage: currentTabPagination.perPage,
          toursType: selectedBadge,
        }),
      );
    }
  };
  const handleSearch = (status: string) => {
    dispatch(searchingAction({status}));
  };
  const onNext = () => {
    const currentTabPagination = pagination[selectedBadge];
    if (currentTabPagination.page < currentTabPagination.totalPages) {
      const newPage = currentTabPagination.page + 1;
      setPagination({
        ...pagination,
        [selectedBadge]: {...currentTabPagination, page: newPage},
      });
      dispatch(
        isGettingAction({...params, page: newPage, toursType: selectedBadge}),
      );
    }
  };

  const onBack = () => {
    const currentTabPagination = pagination[selectedBadge];
    if (currentTabPagination.page > 1) {
      const newPage = currentTabPagination.page - 1;
      setPagination({
        ...pagination,
        [selectedBadge]: {...currentTabPagination, page: newPage},
      });
      dispatch(
        isGettingAction({...params, page: newPage, toursType: selectedBadge}),
      );
    }
  };
  const handleTabChange = tab => {
    setSelectedBadge(tab);
    const currentTabPagination = pagination[tab];
    setParams({
      page: currentTabPagination.page,
      perPage: currentTabPagination.perPage,
    });
    onRefresh(); // Refresh the data based on the new tab
  };

  function calculateDistance(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ) {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const R = 6371e3;

    const φ1 = toRadians(startLat);
    const φ2 = toRadians(endLat);
    const Δφ = toRadians(endLat - startLat);
    const Δλ = toRadians(endLng - startLng);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }
  const averageSpeed = 5;
  function calculateTravelTime(distance: any, speed: any) {
    return distance / speed;
  }
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const startLat = item?.startingPoint?.latitude;
    const startLng = item?.startingPoint?.longitude;
    const endLat = item?.endingPoint?.latitude;
    const endLng = item?.endingPoint?.longitude;

    const distance = calculateDistance(startLat, startLng, endLat, endLng);
    const formattedDistance = distance.toFixed(2);

    const travelTimeInSeconds = calculateTravelTime(distance, averageSpeed);

    const minutes = Math.floor(travelTimeInSeconds / 60);

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedTime = `${hours}h ${remainingMinutes}mins`;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          globalStyles.rowBetween,
          {borderBottomWidth: 1, borderBottomColor: colors.gray5},
        ]}
        onPress={() =>
          navigation.navigate(screens.Rondines, {
            edit: true,
            index,
            id: item?._id,
          })
        }>
        <View style={styles.listContentContainer}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  ...styles.blueText,
                  ...typographies(colors).ralewayMedium12,
                  color: colors.primary,
                }}>
                {item?.visitorName}
              </Text>
              <Text
                style={{
                  ...typographies(colors).ralewayNormal09,
                  color: colors.gray1,
                }}>
                {item?.note}
              </Text>
              <Text
                style={{
                  ...typographies(colors).ralewayNormal09,
                  color: colors.gray1,
                  marginBottom: 5,
                }}>
                {moment(item?.createdAt).format('LT')}
              </Text>
            </View>
            <View
              style={{
                ...styles.textInRowContainer,
                backgroundColor: colors.white,
              }}>
              <Text
                style={{...styles.textInRow, backgroundColor: colors.tertiary}}>
                {formattedTime}
              </Text>
              <Text
                style={{...styles.textInRow, backgroundColor: colors.tertiary}}>
                {`${formattedDistance} m`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={
          userInfo?.role === userRoles.VIGILANT
            ? trans('Rondies')
            : trans('Tours / Assistance')
        }
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          (userInfo?.role === userRoles.VIGILANT ||
            userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) &&
          navigation.navigate(screens.Rondines as never)
        }
      />

      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={userInfo?.role === userRoles.VIGILANT ? list : filteredList}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            {userInfo?.role !== userRoles.VIGILANT && (
              <View
                style={{
                  ...customPadding(10, 6, 20, 6),
                  backgroundColor: colors.white,
                }}>
                <View
                  style={[
                    globalStyles.flexRow,
                    {
                      ...customMargin(0, 10, 0, 10),
                      backgroundColor: colors.white,
                    },
                  ]}>
                  <Badge
                    text={trans('Rondines')}
                    style={{flexGrow: 1 / 2, width: '48.5%'}}
                    onPress={() => handleTabChange('Rondines')}
                    bgColor={
                      selectedBadge === 'Rondines'
                        ? colors.tertiary
                        : colors.gray5
                    }
                    textColor={
                      selectedBadge === 'Rondines' ? colors.white : colors.gray7
                    }
                  />
                  <Badge
                    text={trans('Attendance')}
                    style={{flexGrow: 1 / 2, width: '48.5%'}}
                    onPress={() => handleTabChange('Attendance')}
                    bgColor={
                      selectedBadge === 'Attendance'
                        ? colors.tertiary
                        : colors.gray5
                    }
                    textColor={
                      selectedBadge === 'Attendance'
                        ? colors.white
                        : colors.gray7
                    }
                  />
                </View>
              </View>
            )}
            <View style={{...styles.container, backgroundColor: colors.white}}>
              <View style={{backgroundColor: colors.white}}>
                {/* <ShowDate
                  onPress={handleMonthChange}
                  defaultValue={new Date() || selectedDate}
                /> */}
                <SelectMonth
                  style={{...customMargin(10)}}
                  defaultValue={selectedDate || new Date()}
                  // name="period"
                  onPress={handleMonthChange}
                />
              </View>
              <View>
                {userInfo?.role !== userRoles.VIGILANT && (
                  <Text
                    style={{
                      ...typographies(colors).ralewayBold15,
                      color: colors.primaryText,
                    }}>
                    {trans('Total')}: {filteredList && filteredList?.length}
                  </Text>
                )}
                {userInfo?.role === userRoles.VIGILANT && (
                  <Text
                    style={{
                      ...typographies(colors).ralewayBold15,
                      color: colors.primaryText,
                    }}>
                    {trans('Total')}: {itemCount}
                  </Text>
                )}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{...customPadding(20, 0, 10, 0), gap: rs(5)}}
        ListFooterComponent={
          <>
            {hasMore ? (
              <View style={[{height: rs(40)}, globalStyles.activityCenter]}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              !isLoading &&
              totalPages > 1 && (
                <Pagination
                  PageNo={params.page}
                  onNext={() => onNext()}
                  onBack={() => onBack()}
                />
              )
            )}
          </>
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
    ...customMargin(2, 10, 10, 10),
    // backgroundColor:colors.white
  },
  listContentContainer: {
    ...globalStyles.flexRow,
    flex: 1,
    ...customPadding(6, 20, 6, 20),
  },
  blueText: {
    ...customPadding(2, 2, 2, 2),
  },
  grayText: {
    //...customPadding(2,2,2,2)
  },
  textInRow: {
    ...customPadding(6, 8, 6, 8),
    ...customMargin(2, 2, 2, 2),
    ...typographies(colors).ralewayBold10,
    fontSize: 10,
    color: 'white',
    // fontWeight: '600',
    borderRadius: 5,
  },
  textInRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...customPadding(4, 0, 4, 0),
  },
});
export default Assistance;
