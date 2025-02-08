/* eslint-disable react-hooks/exhaustive-deps */
import {useLayoutEffect} from 'react';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {incidentsState, userStates} from '../../../state/allSelector.state';
import {CommonState} from '../../../state/common.state';
import {
  isGettingAction,
  refreshingAction,
  searchingAction,
  gettingMoreAction,
} from '../../../state/features/incidents/incidents.slice';
import { debounceHandler } from '../../../utilities/helper';

const useIncidents = () => {
  const {
    isLoading,
    isGetting,
    list,
    hasMore,
    page,
    perPage,
    refreshing,
    status,
    search,
    totalPages, 
  }: CommonState = customUseSelector(incidentsState);
  const {userInfo} = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  useLayoutEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction({status}));
    }
  }, []);
  const loadMore = () => {
    hasMore && dispatch(gettingMoreAction({page, perPage}));
  };
  const onRefresh = () => {
    dispatch(refreshingAction({status}));
  };

  const handleSearch = debounceHandler(
    (status: string) => dispatch(searchingAction({ search:status })),
    
  );
    const handleChangeStatus = (value: string) => {
    dispatch(searchingAction({  status: value }));
  console.log("cheackin searched values...",value)

  };
  return {
    handleChangeStatus,
    isLoading,
    list,
    loadMore,
    hasMore,
    onRefresh,
    refreshing,
    handleSearch,
    status,
    userInfo,
    dispatch,
    search,
    totalPages, 
  };
};

export default useIncidents;
