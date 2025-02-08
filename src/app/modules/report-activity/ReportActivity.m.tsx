import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {reportActivityStates, themeStates} from '../../state/allSelector.state';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/reportActivity/reportActivity.slice';
import {formatDate, showAlertWithTwoActions} from '../../utilities/helper';
import reportActivityService from '../../services/features/reportActivity/reportActivity.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {userRoles} from '../../assets/ts/core.data';
import {config} from '../../../Config';
import Pagination from '../../components/core/Pagination.core.component';
import moment from 'moment';
import SelectMonth from '../../components/app/SelectMonth.app';
const ReportActivity = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {theme} = customUseSelector(themeStates);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
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
    results,
  } = customUseSelector(reportActivityStates);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
    period: new Date(),
  });
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(results);
  }, [list]);

  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  // const onRefresh = () => {
  //   dispatch(refreshingAction({search}));
  // };
  const onRefresh = useCallback(() => {
    setParams(prev => ({...prev, page: 1}));
    dispatch(refreshingAction({search}));
  }, [dispatch, search]);
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );
  const handleSearch = (text: string) => {
    setParams({...params, search: text});
    dispatch(searchingAction({...params, search: text}));
  };
  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction(params));
    }
  }, []);
  const loadMore = () => {
    if (hasMore) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(gettingMoreAction({...params, page: newPage}));
    }
  };
  //pagination code
  const onNext = () => {
    if (params.page < totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };
  //pagination code
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await reportActivityService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this report?'),
      onPressAction: confirm,
    });
  };
  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const formattedDate = moment(newDate).format('YYYY-MM-DD');
    setParams({...params, period: formattedDate});
    dispatch(searchingAction({...params, period: formattedDate, search}));
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {guy, name, type, description, status, date, _id} = item || {};
    const mediaUrl = item?.images?.[0];
    const originalDate = moment.utc(date);
    const formattedTime = originalDate.format('h:mm A');
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addReportActivity as never, {
            edit: true,
            index,
            id: item?._id,
          })
        }
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {
            alignItems: `${'flex-start'}`,
            ...customPadding(5, 10, 5, 10),
            backgroundColor: theme === 'dark' ? 'white' : colors.gray,
            borderRadius: rs(15),
            marginTop: rs(10),
          },
        ]}>
        <ImagePreview
          source={mediaUrl ? {uri: mediaUrl} : imageLink.placeholder}
          styles={{
            marginTop: rs(10),
            width: rs(50),
            height: rs(50),
            borderRadius: rs(50),
            borderWidth: rs(2),
            borderColor: colors.white,
          }}
        />
        <View
          style={[globalStyles.flexShrink1, {marginTop: rs(10), flexGrow: 1}]}>
          <Text
            style={[
              typographies(colors).ralewayBold15,
              {color: colors.primary},
            ]}>
            {type}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              {color: theme === 'dark' ? 'black' : colors.black},
            ]}>
            👮🏻{name}
          </Text>

          <Text
            style={[
              globalStyles.flexShrink1,
              typographies(colors).ralewayMedium10,
              {
                color: theme === 'dark' ? 'black' : colors.black,
                // lineHeight: rs(20),
                marginTop: rs(3),
              },
            ]}
            //numberOfLines={2}
          >
            🕒 {formattedTime}
          </Text>
          <View></View>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium12,
                {
                  color: theme === 'dark' ? 'black' : colors.black,
                  //lineHeight: rs(20),
                  //marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>
        {config?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleDelete(index, _id)}>
            <DeleteIcon height={rs(15)} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Report Activity')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addReportActivity as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
            <View
              style={{
                ...globalStyles.flexRow,
                justifyContent: 'space-between',
              }}>
              <SelectMonth
                style={{...customMargin(10, 5, 0, 10)}}
                defaultValue={new Date() || selectedDate}
                //showYearOnly={true}
                onPress={handleMonthChange}
              />
              <View>
                <Text
                  style={{
                    ...typographies(colors).ralewayBold15,
                    color: theme === 'dark' ? 'white' : colors.primary,
                  }}>
                  {`${trans('Total')}: ${itemCount}`}
                </Text>
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
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
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

export default ReportActivity;
