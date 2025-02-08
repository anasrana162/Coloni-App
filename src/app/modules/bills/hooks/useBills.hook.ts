import {useEffect, useState} from 'react';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {expenseStates, userStates} from '../../../state/allSelector.state';
import {CommonState} from '../../../state/common.state';
import {
  isGettingAction,
  refreshingAction,
  searchingAction,
  gettingMoreAction,
} from '../../../state/features/expenses/expense.slice';
import {debounceHandler} from '../../../utilities/helper';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import VisibleBottomSheet from '../bottomSheet/Visible.bottomSheet';
import {config} from '../../../../Config';
import moment from 'moment';

const useBills = () => {
  const {userInfo} = customUseSelector(userStates);
  const navigation = useCustomNavigation();
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const [selectedDate, setSelectedDate] = useState<any>(new Date()); 
  const handleOpen = () => {
    global.showBottomSheet({flag: true, component: VisibleBottomSheet});
  };
  const {
    isLoading,
    isGetting,
    list,
    hasMore,
    page,
    perPage,
    search,
    refreshing,
    tab,
    visible,
    select,
    date,
    category,
    totalAmount,
    totalPages,
  }: CommonState = customUseSelector(expenseStates);
  const dispatch = customUseDispatch();
  const onRefresh = () => {
    dispatch(
      refreshingAction({
        page: 1,
        perPage: 12,
        category: category,
        visible,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }),
    );
  };

  const handleSearch = debounceHandler((text: string) =>
    dispatch(
      searchingAction({
        search: text,
        page,
        perPage,
        category: category,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }),
    ),
  );
 
  const handledateChange = (params: any) => {
    var newObject = {
      page,
      perPage: 12,
      visible,
      select,
      category,
      period: moment(params?.period).format('YYYY-MM-DD'),
    };
    dispatch(isGettingAction(newObject));
    setSelectedDate(params?.period);
  };
 
  const handleTabChange = (value: any, name: string) => {
    var newObject = {
      page,
      perPage: 12,
      search,
      visible,
      select,
      category,
      period: moment(selectedDate).format('YYYY-MM-DD'),
    };

    console.log('new Object on Tab change', newObject);
    dispatch(isGettingAction({...newObject, [name]: value}));
  };
  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    dispatch(
      gettingMoreAction({
        page: page + 1,
        perPage: 12,
        search,
        tab,
        visible,
        select,
        date,
        category,
        period: moment(selectedDate).format('YYYY-MM-DD'),
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
        search,
        tab,
        visible,
        select,
        date,
        category,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }),
    );
  };
  return {
    isLoading,
    list,
    hasMore,
    onRefresh,
    refreshing,
    handleSearch,
    search,
    userInfo,
    handleOpen,
    tab,
    visible,
    // select,
    date,
    colors,
    navigation,
    trans,
    page,
    perPage,
    category,
    selectedDate,
    handleTabChange,
    handledateChange,
    onNextPage,
    onPrevPage,
  };
};

export default useBills;
