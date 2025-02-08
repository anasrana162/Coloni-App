/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { CommonState } from '../../../state/common.state';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import { vehiclesStates } from '../../../state/allSelector.state';
import {
  deleteAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../../state/features/vehicles/vehicle.slice';
import {
  debounceHandler,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../../utilities/helper';
import userService from '../../../services/features/users/user.service';
import { apiResponse } from '../../../services/features/api.interface';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

const useVehicles = () => {
  const {
    isLoading,
    isGetting,
    list,
    hasMore,
    page,
    perPage,
    results,
    total,
    refreshing,
    totalPages,
    search,
  }: CommonState = customUseSelector(vehiclesStates);
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  const { t: trans } = useTranslation(); 
  useEffect(() => {
    if (isFocused) {
      dispatch(searchingAction({ search: '' }));
      dispatch(isGettingAction({ page: 1, perPage: 12, search: '' }));
    }
  }, [isFocused]);

  // const loadMore = () => {
  //   hasMore && dispatch(gettingMoreAction({ page, perPage, search }));
  // };
  const onRefresh = () => {
    dispatch(refreshingAction({ search: search, page: 1, perPage: 12 }));
  };

  const handleSearch = (text: string) => {
    debounceHandler(dispatch(searchingAction({ search: text, page, perPage })));
  };

  
  const onDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({ index, id }));
        // await documentsService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this vehicle?'),
      onPressAction: confirm,
    });
  };

  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    dispatch(
      isGettingAction({
        page: page + 1,
        perPage: 12,
      }),
    );
  };
  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    dispatch(
      isGettingAction({
        page: page - 1,
        perPage: 12,
      }),
    );
  };
  return {
    isLoading,
    list,
    hasMore,
    results,
    onRefresh,
    onDelete, 
    refreshing,
    handleSearch,
    search,
    total,
    isGetting,
    page,
    perPage,
    totalPages,
    onNextPage,
    onPrevPage,
  };
};

export default useVehicles;
