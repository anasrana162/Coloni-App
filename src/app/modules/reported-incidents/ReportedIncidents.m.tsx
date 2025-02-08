/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import Container from '../../layouts/Container.layout';
import {useCustomNavigation} from '../../packages/navigation.package';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {screens} from '../../routes/routeName.route';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customMargin,
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import Badge from '../../components/app/Badge.app';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useIsFocused, useTheme} from '@react-navigation/native';
import useIncidents from './hooks/useIncidents.hook';
import {
  debounceHandler,
  formatDate,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {userRoles} from '../../assets/ts/core.data';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {
  deleteAction,
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/incidents/incidents.slice';
import incidentsService from '../../services/features/incidents/incidents.service';
import {billItemStyles} from '../income/components/PaymentItem.income.m';
import ShowDate from '../../components/app/ShowDate.app';
import {
  incidentsState,
  themeStates,
  userStates,
} from '../../state/allSelector.state';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import Pagination from '../../components/core/Pagination.core.component';
import moment from 'moment';
import SelectMonth from '../../components/app/SelectMonth.app';
const ReportedIncidents = () => {
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;

  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    status,
    totalPages,
    results,
    total,
  } = customUseSelector(incidentsState);
  const {userInfo} = customUseSelector(userStates);
  const [itemCount, setItemCount] = useState(0);
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  const {theme} = customUseSelector(themeStates);
  const [params, setParams] = useState({
    resident: userInfo?.role == userRoles?.RESIDENT ? userInfo?._id : '',
    page: 1,
    perPage: 5,
    search: '',
    status:
      userInfo?.role === userRoles.VIGILANT ||
      userInfo?.role === userRoles.RESIDENT
        ? ''
        : 'Pending',
    period: moment(new Date()).format('YYYY'),
  });

  const onNext = () => {
    if (params.page < totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({
        ...prevParams,
        page: newPage,
        period: moment(selectedDate).format('YYYY'),
      }));
      dispatch(
        isGettingAction({
          ...params,
          page: newPage,
          period: moment(selectedDate).format('YYYY'),
        }),
      );
    }
  };
  //for pagination
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({
        ...prevParams,
        page: newPage,
        period: moment(selectedDate).format('YYYY'),
      }));
      dispatch(
        isGettingAction({
          ...params,
          page: newPage,
          period: moment(selectedDate).format('YYYY'),
        }),
      );
    }
  };

  useEffect(() => {
    // if (!isGetting) {
    if (isFocused) dispatch(isGettingAction(params));
    // }
  }, [isFocused]);

  useEffect(() => {
    setItemCount(results);
  }, [list]);
  const onRefresh = () => {
    setParams(prev => ({
      ...prev,
      page: 1,
      period: moment(selectedDate).format('YYYY'),
    }));
    dispatch(
      refreshingAction({
        ...params,
        period: moment(selectedDate).format('YYYY'),
      }),
    );
  };

  // const handleSearch = debounceHandler(
  //   (status: string) => dispatch(searchingAction({ search:status })),

  // );
  const handleChangeStatus = (value: string) => {
    setParams({
      ...params,
      status: value,
      period: moment(selectedDate).format('YYYY'),
    });
    dispatch(
      searchingAction({
        ...params,
        status: value,
        period: moment(selectedDate).format('YYYY'),
      }),
    );
    console.log('cheackin searched values...', value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    dispatch(
      searchingAction({period: moment(newDate).format('YYYY'), search, status}),
    );
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const handleDelete = () => {
      const confirm = async (value: string) => {
        if (value === 'confirm') {
          dispatch(deleteAction({index, id: item._id}));
          incidentsService.delete(item._id);
        }
      };
      showAlertWithTwoActions({
        title: trans('Delete'),
        body: trans('Are you want to delete this incident?'),
        onPressAction: confirm,
      });
    };
    console.log('item', item);
    const imageUrl = item?.images[0]
      ? {uri: item?.images[0]}
      : imageLink.placeholder;
    return (
      <Pressable
        onPress={() => {
          if (
            userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN
          ) {
            navigation.navigate(screens.DetailsReportedIncidents as never, {
              edit: true,
              item,
              index,
              status: params?.status,
            });
          } else if (
            userInfo?.role === userRoles.VIGILANT ||
            userInfo?.role === userRoles.RESIDENT
          ) {
            navigation.navigate(screens.addUpdateReportIncident as never, {
              edit: true,
              item,
              index,
              status: params?.status,
            });
          }
        }}
        style={{
          backgroundColor: theme === 'dark' ? 'white' : colors.gray,
          padding: rs(15),
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderRadius: rs(20),
          marginBottom: rs(10),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              ...stylesIncident.imageContainer,
              backgroundColor: colors.primary,
              ...shadow(colors).shadow,
            }}>
            <ImagePreview
              source={imageUrl}
              borderRadius={40}
              styles={{...stylesIncident.image, borderColor: colors.white}}
            />
          </View>
          <View style={{marginLeft: rs(10)}}>
            {userInfo?.role !== userRoles.VIGILANT && (
              <Text style={{...typographies(colors).ralewayBold12}}>
                {item?.createdBy?.street?.name} {item?.createdBy?.home}
              </Text>
            )}
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {
                  color:
                    userInfo?.role === userRoles.VIGILANT
                      ? theme === 'dark'
                        ? colors.primary
                        : colors.black
                      : colors.primary,
                },
              ]}>
              {item?.affair}
            </Text>

            <Text
              style={[
                typographies(colors).montserratNormal10,
                {
                  color: theme === 'dark' ? 'black' : colors.black,
                  maxWidth: rs(150),
                },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item?.note}
            </Text>
            {(userInfo?.role === userRoles.VIGILANT ||
              userInfo?.role === userRoles.RESIDENT) && (
              <View
                style={{
                  ...stylesIncident.ActiveContainer,
                  backgroundColor:
                    item?.status === 'Closed'
                      ? colors.eliminateBtn
                      : colors.brightGreen,
                }}>
                <Text
                  style={{
                    ...typographies(colors).ralewayBold10,
                    color: colors.white,
                  }}>
                  {item?.status}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Text
            style={[
              typographies(colors).montserratNormal10,
              {color: colors.gray11},
            ]}>
            {formatDate(item?.createdAt, 'DD/MM/YYYY')}
          </Text>
        </View>
      </Pressable>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Incidents')}
        rightIcon={
          // (userInfo?.role === userRoles.ADMIN ||
          //   userInfo?.role === userRoles.SUPER_ADMIN) && (
          <ImagePreview source={imageLink.addIcon} />
          // )
        }
        rightControl={() => {
          if (
            userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN
          ) {
            navigation.navigate(screens.ResidentIncident as never, {
              status: params?.status,
            });
          } else if (
            userInfo?.role === userRoles.VIGILANT ||
            userInfo?.role === userRoles.RESIDENT
          ) {
            navigation.navigate(screens.addUpdateReportIncident as never, {
              status: params?.status,
            });
          }
        }}
      />

      <FlatList
        keyboardShouldPersistTaps="always"
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={list}
        // // refreshing={refreshing}
        // onRefresh={onRefresh}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: colors.white,
              paddingTop: rs(20),
              paddingBottom: rs(10),
            }}>
            {userInfo?.role !== userRoles.VIGILANT &&
              userInfo?.role !== userRoles.RESIDENT && (
                <View style={[globalStyles.flexRow, {gap: rs(6)}]}>
                  <Badge
                    text={trans('Earning')}
                    bgColor={
                      status === 'Pending' ? colors.tertiary : colors.gray5
                    }
                    textColor={
                      status === 'Pending' ? colors.white : colors.gray7
                    }
                    classes="small"
                    onPress={() => handleChangeStatus('Pending')}
                    style={{
                      flexGrow: 1 / 3,
                      width: `${'32%'}`,
                      borderRadius: rs(10),
                      ...customPadding(10, 12, 10, 12),
                    }}
                  />
                  <Badge
                    text={trans('Reviewed')}
                    bgColor={
                      status === 'Reviewed' ? colors.tertiary : colors.gray5
                    }
                    textColor={
                      status === 'Reviewed' ? colors.white : colors.gray7
                    }
                    classes="small"
                    onPress={() => handleChangeStatus('Reviewed')}
                    style={{
                      flexGrow: 1 / 3,
                      width: `${'32%'}`,
                      borderRadius: rs(10),
                      ...customPadding(10, 12, 10, 12),
                    }}
                  />
                  <Badge
                    text={trans('Closed')}
                    bgColor={
                      status === 'Closed' ? colors.tertiary : colors.gray5
                    }
                    textColor={
                      status === 'Closed' ? colors.white : colors.gray7
                    }
                    onPress={() => handleChangeStatus('Closed')}
                    style={{
                      flexGrow: 1 / 3,
                      width: `${'32%'}`,
                      borderRadius: rs(10),
                      ...customPadding(10, 12, 10, 12),
                    }}
                    classes="small"
                  />
                </View>
              )}
            <View
              style={{
                ...globalStyles.flexRow,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <SelectMonth
                  showYearOnly={true}
                  defaultValue={selectedDate || new Date()}
                  onPress={handleMonthChange}
                />
                <Text
                  style={[
                    {color: colors.primaryText, fontSize: 13},
                    typographies(colors).ralewayBold15,
                  ]}>{`${trans('Total')}: ${total}`}</Text>
              </View>
              {userInfo?.role === userRoles.VIGILANT && (
                <View>
                  <Text
                    style={{
                      ...typographies(colors).ralewayBold15,
                      color: colors.primary,
                    }}>
                    {itemCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        }
        contentContainerStyle={
          list?.length > 0 ? {gap: rs(10)} : globalStyles.emptyFlexBox
        }
        style={{...customPadding(0, 20, 0, 20)}}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There is no data to display')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
        ListFooterComponent={
          <>
            {!isLoading && totalPages > 1 && (
              <Pagination
                PageNo={params.page}
                onNext={() => onNext()}
                onBack={() => onBack()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};

export default ReportedIncidents;
const stylesIncident = StyleSheet.create({
  imageContainer: {
    width: rs(40),
    height: rs(40),
    borderRadius: 40,
    //backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    //...shadow(colors).shadow,
  },
  image: {
    width: rs(31),
    height: rs(31),
    borderWidth: 1,
    borderRadius: 40,
    //borderColor: colors.white,
  },
  ActiveContainer: {
    width: 90,
    height: 20,
    //...customPadding(2, 2, 2, 2),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
});
