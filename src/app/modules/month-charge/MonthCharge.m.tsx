import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
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
import {monthChargesStates, userStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
} from '../../state/features/monthCharges/monthCharges.slice';
import {debounceHandler} from '../../utilities/helper';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import Badge from '../../components/app/Badge.app';
import SelectMonth from '../../components/app/SelectMonth.app';
import MonthChargeItem from './components/MonthChargeItem.m';
import {userRoles} from '../../assets/ts/core.data';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {screens} from '../../routes/routeName.route';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useIsFocused} from '@react-navigation/native';
import {config} from '../../../Config';
import LeftArrowIcon from '../../assets/icons/LeftArrow.icon';
import Pagination from '../../components/core/Pagination.core.component';
const MonthCharge = () => {
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
    // status,
    results,
    date,
    totalAmount,
    totalPages,
  } = customUseSelector(monthChargesStates);

  const isFocused = useIsFocused();

  // /console.log("checking list",list);
  const {userInfo} = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const navigation = useCustomNavigation();

  
  // // states
  const [status, setStatus] = useState<string>('');
  const [key, setkey] = useState<number>(0);
  const [amount, setAmount] = useState(0);
  const [pagesItemAdded, setPagesItemAdded] = useState(5);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const onRefresh = () => {
    dispatch(
      refreshingAction({
        page: 1,
        perPage: 12,
        status: status,
        month: new Date(selectedDate).getMonth() + 1,
        year: new Date(selectedDate).getFullYear(),
      }),
    );
  };
  const handleSearch = debounceHandler(
    (value: string) =>
      dispatch(
        searchingAction({
          page,
          perPage,
          status,
          search: value, 
          month: new Date(selectedDate).getMonth() + 1,
          year: new Date(selectedDate).getFullYear(),
        }),
      ),
    500,
  );
  
  const handleChangeStatus = (value: string) => {
    // dispatch(searchingAction({search, status: value, date}));
    // dispatch(isGettingAction());
    // var checkAmount = totalAmount.find(
    //   (item: { status: string }) => item.status == value,
    // );
    console.log('check Amount', totalAmount);
    switch (value) {
      case 'Earning':
        setStatus(value);
        dispatch(
          isGettingAction({
            page: 1,
            perPage: 12,
            status: value,
            month: new Date(selectedDate).getMonth() + 1,
            year: new Date(selectedDate).getFullYear(),
          }),
        );
        // setAmount(checkAmount?.totalAmount);
        break;
      case 'To Be Approved':
        setStatus(value);
        dispatch(
          isGettingAction({
            page: 1,
            perPage: 12,
            status: value,
            month: new Date(selectedDate).getMonth() + 1,
            year: new Date(selectedDate).getFullYear(),
          }),
        );
        // setAmount(checkAmount?.totalAmount);
        break;
      case 'Approved':
        setStatus(value);
        dispatch(
          isGettingAction({
            page: 1,
            perPage: 12,
            status: value,
            month: new Date(selectedDate).getMonth() + 1,
            year: new Date(selectedDate).getFullYear(),
          }),
        );
        break;
    }
  };

  useEffect(() => {
    if (isFocused) {
      // Clear the search state when focused
      dispatch(searchingAction({search: ''}));

      // Fetch data
      dispatch(
        isGettingAction({
          page: 1,
          perPage: 12,
          search: '',
          status: 'Earning',
          month: new Date(selectedDate).getMonth() + 1,
          year: new Date(selectedDate).getFullYear(),
        }),
      );

      setStatus('Earning');
    }
  }, [isFocused]);

  
  useEffect(() => {
    console.log('Total Effect', totalAmount);
    var checkAmount =
      Array.isArray(totalAmount) &&
      totalAmount.find(item => item.status == status);
    console.log('checkAmount', checkAmount);
    setAmount(checkAmount?.totalAmount);

    setkey(key + 1);
  }, [status, totalAmount, selectedDate]);
  
  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    dispatch(
      gettingMoreAction({
        page: page + 1,
        perPage: 12,
        status: status,
        month: new Date(selectedDate).getMonth() + 1,
        year: new Date(selectedDate).getFullYear(),
      }),
    );
  };
  
  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    dispatch(
      gettingMoreAction({
        page: page - 1,
        perPage: 12,
        status: status,
        month: new Date(selectedDate).getMonth() + 1,
        year: new Date(selectedDate).getFullYear(),
      }),
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <MonthChargeItem
        index={index}
        item={item}
        status={status}
        userInfo={userInfo}
      />
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={
          userInfo?.role == userRoles.RESIDENT
            ? trans('Payment')
            : trans('Month Charges')
        }
        rightIcon={
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN ? (
            <ImagePreview source={imageLink.addIcon} />
          ) : undefined
        }
        rightControl={() =>
          navigation.navigate(screens.ChargesMonthCharge as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        refreshing={refreshing}
        key={key}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        data={list}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput onChangeText={handleSearch} defaultValue={search} />
            <View
              style={[
                styles.badgeContainer,
                {...customPadding(0, 5, 18, 5), gap: rs(6)},
              ]}>
              <Badge
                text={trans('Earning')}
                bgColor={status === 'Earning' ? '' : colors.gray5}
                onPress={() => handleChangeStatus('Earning')}
                textColor={status === 'Earning' ? '' : colors.gray7}
                classes="small"
                style={{flexGrow: 1 / 3, width: `${'32%'}`}}
              />
              <Badge
                text={trans('To Be Approved')}
                bgColor={status === 'To Be Approved' ? '' : colors.gray5}
                textColor={status === 'To Be Approved' ? '' : colors.gray7}
                onPress={() => handleChangeStatus('To Be Approved')}
                classes="small"
                style={{flexGrow: 1 / 3, width: `${'32%'}`}}
              />
              <Badge
                text={trans('Approved')}
                onPress={() => handleChangeStatus('Approved')}
                bgColor={status === 'Approved' ? '' : colors.gray5}
                textColor={status === 'Approved' ? '' : colors.gray7}
                style={{flexGrow: 1 / 3, width: `${'32%'}`}}
                classes="small"
              />
            </View>
            <View style={styles.middleContainer}>
              <SelectMonth
                defaultValue={new Date(selectedDate)}
                onPress={(value: string) => {
                  setSelectedDate(value);
                  dispatch(
                    isGettingAction({
                      page,
                      perPage,
                      status,
                      month: new Date(value).getMonth() + 1,
                      year: new Date(value).getFullYear(),
                    }),
                  );
                }}
              />
              <Text style={[typographies(colors).ralewayBold15, {}]}>{`${
                amount == undefined
                  ? trans('Calculating...')
                  : `Total: ${amount}`
              }`}</Text>
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
            {!isLoading && totalPages > 1 && (
              <Pagination
                PageNo={page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};

export default MonthCharge;
