import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {DismissStates, QrReaderStates} from '../../state/allSelector.state';
import {Trans, useTranslation} from 'react-i18next';
import {
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/DismissVisit/DismissVisitSlice';
import {TouchableOpacity} from 'react-native';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import Pagination from '../../components/core/Pagination.core.component';
import DismissVisitServices from '../../services/features/DismissVisits/DismissVisitServices';
import SelectMonth from '../../components/app/SelectMonth.app';
import moment from 'moment';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {formatDate} from '../../utilities/helper';

const DismissVisitsVig = () => {
  const {colors} = useTheme() as any;
  const navigation = useCustomNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [ItemCount, setItemCount] = useState();
  const [List, setList] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const {hasMore} = customUseSelector(DismissStates);

  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    // period: moment(new Date()).format('YYYY-MM-DD'),
  });
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const getDataHandler = async () => {
    setLoading(true);
    try {
      const result = await DismissVisitServices.list(params);
      console.log('result====>>', result?.body?.list);
      setItemCount(result?.body?.totalCount);
      setList(result?.body?.list || []);
      setTotalPages(result?.body?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataHandler();
  }, [params]);

  // useEffect(() => {
  //   setItemCount();
  // }, [List]);

  const onNext = () => {
    if (params.page < totalPages) {
      const nextPage = params.page + 1;
      setParams({...params, page: nextPage});
    }
  };

  const onBack = () => {
    if (params.page > 1) {
      const prevPage = params.page - 1;
      setParams({...params, page: prevPage});
    }
  };
  const loadMore = () => {
    if (hasMore) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(gettingMoreAction({...params, page: newPage}));
    }
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setParams(prevParams => ({...prevParams, page: 1}));
    await getDataHandler();
    setRefreshing(false);
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );
  const handleMonthChange = (newDate: any) => {
    setSelectedDate(newDate);
    setParams(prevParams => ({
      ...prevParams,
      page: 1,
      period: moment(newDate).format('YYYY-MM-DD'),
    }));
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {_id} = item || {};
    const mediaUrl = item?.images?.[0];
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.DismissVisitFire, {
            id: _id,
            index,
            edit: true,
            item: item,
          })
        }
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {
            alignItems: `${'flex-start'}`,
            ...customPadding(10, 10, 10, 10),
            backgroundColor: colors.recieveBg,
            borderRadius: rs(10),
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
        <View style={[globalStyles.flexShrink1, {flexGrow: 1, marginLeft: 10}]}>
          <Text
            style={[
              typographies(colors).ralewayBold15,
              {color: colors.primary},
            ]}>
            🏠{' '}
            {(item?.visit?.resident?.street?.name || '') +
              ' ' +
              (item?.visit?.resident?.home || item?.resident?.streetHome || '')}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium12,
                {
                  color: colors.gray1,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              🙋🏻‍♂️{item?.visit?.visitorName || item?.visitorName}
            </Text>
          </View>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium12,
                {
                  color: colors.gray1,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {trans('Mark Work: ')}
              {item?.marWork ? item.marWork : 'N/A'}
            </Text>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium12,
                {
                  color: colors.gray1,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {trans('Enter Note: ')}
              {item?.enterNote}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.tertiary,
            justifyContent: 'center',
            alignItems: 'center',
            ...customPadding(2, 2, 2, 2),
            borderRadius: 10,
          }}>
          <Text
            style={[
              globalStyles.flexShrink1,
              typographies(colors).ralewayMedium12,
              {
                color: colors.white,
              },
            ]}
            numberOfLines={2}>
            {formatDate(item?.createdAt, 'h:mm A')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container bottomTab={false}>
      <Header text={trans('Dismiss Visits')} />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={List}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View
            style={{
              ...globalStyles.flexRow,
              justifyContent: 'space-between',
              backgroundColor: colors.white,
            }}>
            <View style={{backgroundColor: colors.white}}>
              <SelectMonth
                defaultValue={new Date() || selectedDate}
                //showYearOnly={true}
                onPress={handleMonthChange}
              />
            </View>
            <View style={{...customMargin(0, 10, 10, 10)}}>
              <Text
                style={{
                  ...typographies(colors).ralewayBold15,
                  color: colors.primaryText,
                }}>
                {trans('Total')}: {ItemCount}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            // forLoading={isLoading}
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
              !loading &&
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

export default DismissVisitsVig;
