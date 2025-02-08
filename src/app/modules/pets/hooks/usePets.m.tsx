/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {CommonState} from '../../../state/common.state';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {petStates, userStates} from '../../../state/allSelector.state';
import {
  isGettingAction,
  refreshingAction,
  searchingAction,
  gettingMoreAction,
} from '../../../state/features/pets/pet.slice';
import {debounceHandler} from '../../../utilities/helper';
import {useIsFocused} from '@react-navigation/native';

const usePets = () => {
  const {
    isLoading,
    isGetting,
    list,
    hasMore,
    page,
    perPage,
    refreshing,
    totalPages,
    search,
    total,
  }: CommonState = customUseSelector(petStates);
  const {userInfo} = customUseSelector(userStates);
  const isFocused = useIsFocused();
  const dispatch = customUseDispatch();
  const [params, setParams] = useState({
    page: 1,
    perPage: 12,
    search: '',
    period:new Date(),
  }); 
  useEffect(() => {
    if (isFocused) {
      dispatch(searchingAction({...params, search: ''}));
      dispatch(isGettingAction({...params, search: ''}));
    }
  }, [isFocused]);
  // const loadMore = () => {
  //   hasMore && dispatch(gettingMoreAction({ page, perPage, search }));
  // };
  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };

  
  const handleSearch = (text: string) => {
    if (!text) {
      debounceHandler(dispatch(searchingAction({...params, search: ''})));
    } else {
      debounceHandler(dispatch(searchingAction({...params, search: text})));
    }
  };

  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    setParams({
      ...params,
      page: params.page + 1,
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: params.page + 1,
      }),
    );
  };
  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    setParams({
      ...params,
      page: params.page - 1,
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: params.page - 1,
      }),
    );
  };
  console.log('List', list);
  return {
    isLoading,
    list,
    // loadMore,
    onNextPage,
    onPrevPage,
    params,
    onRefresh,
    refreshing,
    handleSearch,
    search,
    totalPages,
    total,
    userInfo,
  };
};

export default usePets;
