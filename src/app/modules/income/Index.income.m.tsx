import { View, FlatList, ActivityIndicator, Alert, Text } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import Badge from '../../components/app/Badge.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { billsStyles as styles } from '../bills/styles/bills.style';
import SelectMonth from '../../components/app/SelectMonth.app';
import { useIncome } from './hooks/useIncome.hook';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import PaymentItem from './components/PaymentItem.income.m';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import { monthChargesStates, userStates } from '../../state/allSelector.state';
import { useTranslation } from 'react-i18next';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { debounceHandler } from '../../utilities/helper';
import { useCustomNavigation } from '../../packages/navigation.package';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
} from '../../state/features/monthCharges/monthCharges.slice';
import SearchInput from '../../components/app/SearchInput.app';
import Pagination from '../../components/core/Pagination.core.component';


const IncomeIndex = () => {
  const { t: trans } = useTranslation();
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
    date,
    totalAmount,
    totalPages,
  } = customUseSelector(monthChargesStates);

  const isFocused = useIsFocused();

  const { userInfo } = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  const { colors } = useTheme() as any;
  const navigation = useCustomNavigation();

  const [status, setStatus] = useState<string>('');
  const [key, setkey] = useState<number>(0);
  const [amount, setAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [params, setParams] = useState({
    page: 1,
    perPage: 8,
    status: 'To Be Approved',
    search: '',
    month: new Date(new Date()).getMonth() + 1, 
    year: new Date(new Date()).getFullYear(), 
  });
  const onRefresh = () => {
    dispatch(refreshingAction({
      ...params,
       month: new Date(selectedDate).getMonth() + 1, 
      year: new Date(selectedDate).getFullYear(),
    }));
  };
  const handleSearch = debounceHandler((value: string) => {
    setParams({
      ...params,
      search: value,
      month: new Date(selectedDate).getMonth() + 1, 
      year: new Date(selectedDate).getFullYear(), 
    });
    dispatch(
      searchingAction({
        ...params,
        search: value,
        month: new Date(selectedDate).getMonth() + 1, 
        year: new Date(selectedDate).getFullYear(), 
      }),
    );
  }, 500);
  const handleChangeStatus = (value: string) => {
    switch (value) {
      case 'To Be Approved':
        setStatus(value);
        setParams({
          ...params,
          status: value,
          month: new Date(selectedDate).getMonth() + 1, 
          year: new Date(selectedDate).getFullYear(), 
        });
        dispatch(
          isGettingAction({
            ...params,
            status: value,
            month: new Date(selectedDate).getMonth() + 1, 
            year: new Date(selectedDate).getFullYear(), 
          }),
        );
        break;
      case 'Approved':
        console.log('Values reached', value);
        setStatus(value);
        setParams({
          ...params,
          status: value,
          month: new Date(selectedDate).getMonth() + 1, 
          year: new Date(selectedDate).getFullYear(), 
        });
        dispatch(
          isGettingAction({
            ...params,
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
      dispatch(isGettingAction({ ...params, search: '' }));
      setStatus('To Be Approved');

      // Reset search parameter when the screen is focused
      setParams(prevParams => ({
        ...prevParams,
        search: '', // Reset the search
      }));
    }
  }, [isFocused]);

  useEffect(() => {
    var checkAmount =
      Array.isArray(totalAmount) &&
      totalAmount.find(item => item.status == status);
    setAmount(checkAmount?.totalAmount);
  }, [status, totalAmount, selectedDate, params.search]);
  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    setParams({
      ...params,
      page: page + 1,
      month: new Date(selectedDate).getMonth() + 1,
      year: new Date(selectedDate).getFullYear(),
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: page + 1,
        month: new Date(selectedDate).getMonth() + 1,
        year: new Date(selectedDate).getFullYear(),
      }),
    );
  };
  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    setParams({
      ...params,
      page: page - 1,
      month: new Date(selectedDate).getMonth() + 1,
      year: new Date(selectedDate).getFullYear(),
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: page - 1,
        month: new Date(selectedDate).getMonth() + 1,
        year: new Date(selectedDate).getFullYear(),
      }),
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <PaymentItem
        index={index}
        item={item}
        userInfo={userInfo}
        status={status}
      />
    );
  };

  return (
    <Container bottomTab={false}>
      <Header
        text={trans('Income')}
      // rightIcon={
      //   userInfo?.role === userRoles.ADMIN ||
      //   userInfo?.role === userRoles.SUPER_ADMIN ? (
      //     <ImagePreview source={imageLink.addIcon} />
      //   ) : undefined
      // }
      // rightControl={() =>
      //   navigation.navigate(screens.ChargesMonthCharge as never)
      // }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        data={list}
        ListHeaderComponent={
          <View style={{ backgroundColor: colors.white }}>
            <SearchInput
              key={key}
              onChangeText={handleSearch}
              defaultValue={params.search} // Use params.search
            />

            <View
              style={[
                styles.badgeContainer,
                {
                  ...customPadding(0, 5, 18, 5),
                  gap: rs(6),
                  alignSelf: 'center',
                },
              ]}>
              <Badge
                text={trans('To Be Approved')}
                bgColor={status === 'To Be Approved' ? '' : colors.gray5}
                textColor={status === 'To Be Approved' ? '' : colors.gray7}
                onPress={() => handleChangeStatus('To Be Approved')}
                classes="small"
                style={{ flexGrow: 1 / 3, width: `${'32%'}` }}
              />
              <Badge
                text={trans('Approved')}
                onPress={() => handleChangeStatus('Approved')}
                bgColor={status === 'Approved' ? '' : colors.gray5}
                textColor={status === 'Approved' ? '' : colors.gray7}
                style={{ flexGrow: 1 / 3, width: `${'32%'}` }}
                classes="small"
              />
            </View>
            <View style={styles.middleContainer}>
              <SelectMonth
                defaultValue={date || new Date()}
                onPress={value => {
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
              <Text style={[typographies(colors).ralewayBold15, {}]}>{`${amount == undefined
                  ? trans('Calculating...')
                  : `Total: ${amount}`
                }`}</Text>
            </View>
          </View>
        }
        renderItem={renderItem} 
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{ ...customPadding(20, 20, 10, 20), gap: rs(5) }}
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

export default IncomeIndex;
