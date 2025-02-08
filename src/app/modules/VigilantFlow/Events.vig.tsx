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
import {EventualStates} from '../../state/allSelector.state';
import {Trans, useTranslation} from 'react-i18next';
import {gettingMoreAction} from '../../state/features/EventualVisit/EventualVisit.slice';
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
import eventualVisitsVisitlogsService from '../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import {formatDate} from '../../utilities/helper';
import ShowCalender from '../../components/app/ShowCalender.app';
import moment from 'moment';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import SelectMonth from '../../components/app/SelectMonth.app';

const EventsVig = () => {
  const navigation = useCustomNavigation<any>();
  const {hasMore} = customUseSelector(EventualStates);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [List, setList] = useState([]);
  const {colors} = useTheme() as any;
  const [itemCount, setItemCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
    period: new Date(),
    dateType: 'month',
  });

  const getDataHandler = async () => {
    setLoading(true);
    try {
      const result = await eventualVisitsVisitlogsService.list(params);
      setList(result?.data?.list || []);
      setTotalPages(result?.data?.totalPages || 1);
      setItemCount(result?.data?.totalCount || 0);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataHandler();
    console.log('itemCount', itemCount);
  }, [params, itemCount]);

  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const onNext = () => {
    if (params.page < totalPages) {
      const nextPage = params.page + 1;
      setParams({...params, page: nextPage, search: ''});
    }
  };
  const onBack = () => {
    if (params.page > 1) {
      const prevPage = params.page - 1;
      setParams({...params, page: prevPage, search: ''});
    }
  };
  // useEffect(() => {
  //   setItemCount(Result);
  // }, [List, itemCount]);

  const handleSearch = text => {
    setParams(prevParams => ({
      ...prevParams,
      search: text,
      page: 1,
    }));
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
  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const formattedDate = moment(newDate).format('YYYY-MM-DD');
    setParams({...params, period: formattedDate});
    // dispatch(searchingAction({ ...params, period: formattedDate, search }));
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {_id} = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.AddVisitsHomeScreenVig, {
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
        <View style={[globalStyles.flexShrink1, {flexGrow: 1, marginLeft: 10}]}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {color: colors.primary},
            ]}>
            🏠{item?.resident?.street?.name} {item?.resident?.home}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayNormal12,
                {
                  marginLeft: rs(3),
                },
              ]}
              numberOfLines={2}>
              {item?.visitorName}
            </Text>
          </View>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayNormal12,
                {
                  color: colors.gray1,
                  marginLeft: rs(3),
                },
              ]}
              numberOfLines={2}>
              {item?.authorizes}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: rs(20),
            width: rs(50),
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
      <Header
        text={trans('Eventual Visits')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.AddUpdateEventVig as never)
        }
      />
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
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={params.search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
            <View
              style={{
                ...globalStyles.flexRow,
                justifyContent: 'space-between',
              }}>
              <View>
                <SelectMonth
                  defaultValue={new Date() || selectedDate}
                  //showYearOnly={true}
                  onPress={handleMonthChange}
                />
              </View>
              <View>
                <Text
                  style={{
                    ...typographies(colors).ralewayBold15,
                    color: colors.primaryText,
                  }}>
                  {trans('Total')}: {itemCount}
                </Text>
              </View>
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
              totalPages > 1 &&
              List.length > 1 && (
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

export default EventsVig;
