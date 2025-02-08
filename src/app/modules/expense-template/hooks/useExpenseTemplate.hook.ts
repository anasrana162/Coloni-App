import {useTheme} from '@react-navigation/native';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {
  expenseTemplateStates,
  userStates,
} from '../../../state/allSelector.state';
import {CommonState} from '../../../state/common.state';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {
  isGettingAction,
  gettingMoreAction,
  refreshingAction,
  searchingAction,
} from '../../../state/features/expenseTemplate/expenseTemplate.slice';

const useExpenseTemplate = () => {
  const {userInfo} = customUseSelector(userStates);
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const handleOpen = () => {};
  const {
    isLoading,
    isGetting,
    list,
    hasMore,
    page,
    perPage,
    refreshing,
    search,
  }: CommonState = customUseSelector(expenseTemplateStates);
  const dispatch = customUseDispatch();
  useEffect(() => {
    dispatch(searchingAction({search: ''})); 
    if (!isGetting) {
      dispatch(isGettingAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadMore = () => {
    hasMore && dispatch(gettingMoreAction({page, perPage}));
  };
  const onRefresh = () => {
    dispatch(refreshingAction());
  };
  const handleSearch = (text: string) => {
    dispatch(searchingAction({search: text}));
  };
  return {
    isLoading,
    list,
    loadMore,
    hasMore,
    onRefresh,
    refreshing,
    userInfo,
    handleOpen,
    colors,
    navigation,
    trans,
    handleSearch,
    search,
  };
};

export default useExpenseTemplate;
