import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {billsStyles as styles} from '../bills/styles/bills.style';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {otherIncomeStates, userStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/otherIncome/otherIncome.slice';
import {
  calculateCash,
  debounceHandler,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import Badge from '../../components/app/Badge.app';
import SelectMonth from '../../components/app/SelectMonth.app';
import {userRoles} from '../../assets/ts/core.data';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {screens} from '../../routes/routeName.route';
import {useCustomNavigation} from '../../packages/navigation.package';
import {billItemStyles} from '../income/components/PaymentItem.income.m';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {momentTimezone} from '../../packages/momentTimezone.package';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import otherIncomeService from '../../services/features/otherIncome/otherIncome.service';
import {useFocusEffect} from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';

const OtherIncome = () => {
  const {t: trans} = useTranslation();
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    date,
    totalPages,
  } = customUseSelector(otherIncomeStates);
  //pagination code
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
  });
  console.log('checking list', list);
  const [totalAmount, setTotalAmount] = useState(0);
  const {userInfo} = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const navigation = useCustomNavigation<any>();

  const onRefresh = useCallback(() => {
    setParams(prev => ({...prev, page: 1}));
    dispatch(refreshingAction({search}));
  }, [dispatch, search]);
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );
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
  const handleSearch = debounceHandler(text => {
    setParams({...params, search: text});
    dispatch(searchingAction({...params, search: text}));
  }, 500);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const filteredList = useMemo(() => {
    if (!selectedDate) return list;
    return list.filter(item => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [list, selectedDate]);

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    dispatch(searchingAction({date: newDate, search}));
  };

  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction(params));
    }
    fetchTotalPrice();
  }, [list, params]);
  const fetchTotalPrice = () => {
    if (list && list.length > 0) {
      var pricesArr = filteredList.map((item: any) => item?.amount || 0);
      const sum = pricesArr.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue,
        0,
      );
      setTotalAmount(sum);
      console.log(sum); // Output: 15
    } else {
      setTotalAmount(0);
    }
  };
  //pagination code
  const loadMore = () => {
    if (hasMore) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(gettingMoreAction({...params, page: newPage}));
    }
  };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await otherIncomeService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this income?'),
      onPressAction: confirm,
    });
  };
  const billItemStyle = billItemStyles(colors);
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const mediaUrl = item?.images[0];

    return (
      <TouchableOpacity
        style={billItemStyle.container}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate(screens.addUpdateOtherIncome, {
            edit: true,
            index,
            id: item?._id,
          })
        }>
        <View style={billItemStyle.imageContainer}>
          <ImagePreview
            source={mediaUrl ? {uri: mediaUrl} : imageLink.profileImage}
            borderRadius={40}
            styles={billItemStyle.image}
          />
        </View>
        <View style={billItemStyle.middleContainer}>
          <View style={globalStyles.flexShrink1}>
            <Text style={typographies(colors).ralewayBold12} numberOfLines={1}>
              {item?.resident?.street?.name} {item?.resident?.home}
            </Text>
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.primary},
              ]}
              numberOfLines={1}>
              {item?.paymentType?.name}
            </Text>

            <View style={billItemStyle.dateContainer}>
              <CalenderIcon height={6} width={6} />
              <Text style={typographies(colors).montserratNormal8}>
                {
                  momentTimezone(item?.createdAt).format('DD-MM-YYYY')
                }
              </Text>
            </View>
            <Text
              style={[
                typographies(colors).montserratNormal8,
                globalStyles.flexShrink1,
                {marginTop: 2},
              ]}
              numberOfLines={1}>
              {trans('Note : ')}
              {item?.note}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <Text
              style={typographies(colors).montserratMedium10}>{`${calculateCash(
              item?.amount,
            )} >`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Other Income')}
        rightIcon={
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN ? (
            <ImagePreview source={imageLink.addIcon} />
          ) : undefined
        }
        rightControl={() => {
          navigation.navigate(screens.addUpdateOtherIncome as never);
        }}
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        initialNumToRender={2}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        data={filteredList}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              onChangeText={handleSearch}
              defaultValue={params.search}
            />
            <View style={[styles.middleContainer, {marginTop: rs(10)}]}>
              <SelectMonth
                defaultValue={new Date() || selectedDate}
                onPress={handleMonthChange}
              />
              <Text style={[typographies(colors).ralewayBold18, {}]}>
                ${totalAmount}
              </Text>
            </View>
          </View>
        }
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
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

export default OtherIncome;
