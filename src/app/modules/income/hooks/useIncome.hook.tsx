import { useLayoutEffect, useEffect } from 'react';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import { paymentsStates, userStates } from '../../../state/allSelector.state';
import { CommonState } from '../../../state/common.state';
import {
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  refreshingAction,
} from '../../../state/features/payments/payments.slice';
import { useTranslation } from 'react-i18next';
import { useCustomNavigation } from '../../../packages/navigation.package';
import { useTheme } from '@react-navigation/native';

const useIncome = () => {
  const {
    isLoading,
    isGetting,
    list,
    hasMore,
    page,
    perPage,
    refreshing,
    total,
    status,
  }: CommonState = customUseSelector(paymentsStates);
  const { userInfo } = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  const { t: trans } = useTranslation();
  const navigation = useCustomNavigation<any>();
  const { colors } = useTheme();

  useLayoutEffect(() => {
    console.log("🚀 ~ useLayoutEffect triggered");
    if (!isGetting) {
      console.log("🚀 ~ Dispatching isGettingAction");
      dispatch(isGettingAction());
    }
  }, [dispatch, isGetting]);

  useEffect(() => {
    if (!isLoading && isGetting && list.length === 0) {
      console.log("🚀 ~ Dispatching isGettingAction inside useEffect");
      dispatch(isGettingAction());
    }
  }, []);
  // useEffect(() => {
  //   if (!isLoading && isGetting && list.length === 0) {
  //     console.log("🚀 ~ Dispatching isGettingAction inside useEffect");
  //     dispatch(isGettingAction());
  //   }
  // }, [dispatch, isLoading, isGetting, list.length]);
  const loadMore = () => {
    if (hasMore) {
      console.log("🚀 ~ Dispatching gettingMoreAction");
      dispatch(gettingMoreAction({ page, perPage, status }));
    }
  };

  const onRefresh = () => {
    console.log("🚀 ~ Dispatching refreshingAction");
      dispatch(refreshingAction({ status }));
  };

  const handleSearch = (value: string) => {
    console.log("🚀 ~ Dispatching searchingAction with value:", value);
    dispatch(searchingAction({ status: value }));
  };

  console.log("🚀 ~ useIncome ~ list:", list);

  return {
    isLoading,
    list,
    loadMore,
    hasMore,
    onRefresh,
    refreshing,
    handleSearch,
    total,
    userInfo,
    trans,
    navigation,
    status,
    colors,
  };
};

export { useIncome };
