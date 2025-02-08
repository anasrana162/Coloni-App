import {useTheme} from '@react-navigation/native';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {
  frequentVisitStates,
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
  deleteAction,
} from '../../../state/features/frequentVisit/frequentVisit.slice';
import frequentVisitService from '../../../services/features/frequentVisit/frequentVisit.service';
import {showAlertWithTwoActions} from '../../../utilities/helper';

const useFrequentVisit = () => {
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
    status,
    totalPages
  }: CommonState = customUseSelector(frequentVisitStates);
  const dispatch = customUseDispatch();
  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction());
    }
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
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await frequentVisitService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this visits?'),
      onPressAction: confirm,
    });
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
    handleDelete,
    status,
    totalPages
  };
};

export default useFrequentVisit;
