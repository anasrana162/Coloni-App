import {View, ActivityIndicator, FlatList, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import SearchInput from '../../components/app/SearchInput.app';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import Badge from '../../components/app/Badge.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import BillItem from '../../components/app/BillItem.app';
import {billsStyles as styles} from './styles/bills.style';
import {screens} from '../../routes/routeName.route';
import SelectMonth from '../../components/app/SelectMonth.app';
import useBills from './hooks/useBills.hook';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {userRoles} from '../../assets/ts/core.data';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import {useIsFocused} from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {
  expenseStates,
  themeStates,
  userStates,
} from '../../state/allSelector.state';
import {CommonState} from '../../state/common.state';
import moment from 'moment';
import {
  isGettingAction,
  refreshingAction,
  searchingAction,
  gettingMoreAction,
} from '../../state/features/expenses/expense.slice';
import {useTranslation} from 'react-i18next';
import {colors} from '../../assets/global-styles/color.assets';
import {debounceHandler} from '../../utilities/helper';
import {useCustomNavigation} from '../../packages/navigation.package';
import {typographies} from '../../assets/global-styles/typography.style.asset';

const IndexBills = () => {
  const dispatch = customUseDispatch();
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const isFocused = useIsFocused();
  const {theme} = customUseSelector(themeStates);
  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  const [isVisible, setIsVisible] = useState<any>(null);
  const [key, setKey] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [select, setSelect] = useState(true);
  const [showVisibleBar, setShowVisibleBar] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [mainButtons, setMainButtons] = useState('performed');
  const [params, setParams] = useState({
    page: 1,
    perPage: 12,
    visible: isAdmin ? true : '',
    category: isAdmin ? 'scheduled' : '',
    search: '',
    period: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [selectedDate, setSelectedDate] = useState<any>(new Date());

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
    date,
    category,
    totalAmount,
    totalPages,
  }: CommonState = customUseSelector(expenseStates);

  useEffect(() => {
    if (isFocused) {
      searchingAction({
        search: '',
      }),
        dispatch(isGettingAction(params));
      setSelectAll(false);
      setIsVisible(null);
      setShowVisibleBar(false);
      setParams(prev => ({...prev, search: ''}));
      // handleTabChange(false, 'select');
    }
  }, [isFocused]);

  useEffect(() => {
    setKey(key + 1);
  }, [params.category]);

  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };
  const handleSearch = debounceHandler((text: string) => {
    setParams({
      ...params,
      search: text,
      period: moment(selectedDate).format('YYYY-MM-DD'),
    });
    debounceHandler(
      dispatch(
        searchingAction({
          ...params,
          search: text,
          period: moment(selectedDate).format('YYYY-MM-DD'),
        }),
      ),
    );
  });
  const handledateChange = (date: string) => {
    setParams({...params, period: moment(date).format('YYYY-MM-DD')});
    dispatch(
      isGettingAction({...params, period: moment(date).format('YYYY-MM-DD')}),
    );
    setSelectedDate(date);
  };

  const handleTabChange = (value: any, name: string) => {
    setParams({
      ...params,
      [name]: value,
      period: moment(selectedDate).format('YYYY-MM-DD'),
    });
    dispatch(
      isGettingAction({
        ...params,
        [name]: value,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }),
    );
  };

  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    dispatch(
      gettingMoreAction({
        ...params,
        page: params.page + 1,
        perPage: 12,
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
        ...params,
        page: params.page - 1,
        perPage: 12,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }),
    );
  };

  const renderItem: any = ({item, index}: {item: any; index: number}) => {
    // Directly use `isVisible` to conditionally render `BillItem`

    return (
      <>
        {selectAll ? (
          <BillItem index={index} item={item} />
        ) : isVisible == null ? null : (
          <BillItem index={index} item={item} />
        )}
        {!isAdmin && <BillItem index={index} item={item} />}
      </>
    );
    return;
  };

  return (
    <Container bottomTab={false}>
      <Header
        text={isAdmin ? trans('Bills') : trans('Expenses')}
        leftIcon={false}
        rightControl={() =>
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.registrationExpense as never)
            : undefined
        }
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview
              source={imageLink.addIcon}
              styles={{height: rs(28), width: rs(28)}}
            />
          )
        }
      />
      <FlatList
        data={list}
        key={key}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: theme === 'dark' ? colors.black : colors.white,
              borderRadius: 10,
              padding: 10,
            }}>
            <SearchInput
              onChangeText={handleSearch}
              defaultValue={params.search}
            />
            {isAdmin && (
              <>
                <View style={styles.badgeContainer}>
                  <Badge
                    text={trans('Performed')}
                    style={styles.flexGrow5}
                    bgColor={mainButtons == 'scheduled' && colors.gray5}
                    textColor={mainButtons == 'scheduled' && colors.gray9}
                    onPress={() => {
                      setMainButtons('performed');
                      handleTabChange('scheduled', 'category');
                    }}
                  />
                  <Badge
                    text={trans('Scheduled')}
                    bgColor={mainButtons == 'performed' && colors.gray5}
                    textColor={mainButtons == 'performed' && colors.gray9}
                    onPress={() => {
                      setMainButtons('scheduled');
                      handleTabChange('Others', 'category');
                    }}
                    style={styles.flexGrow5}
                  />
                </View>
                <Text
                  style={{
                    ...typographies(colors).montserratMedium13,
                    fontSize: 12,
                    marginBottom: 20,
                  }}>
                  {trans(
                    "Please confirm by clicking 'Select.' Once selected, the activation of the expense will be visible.",
                  )}
                </Text>
              </>
            )}
            <View
              style={[styles.middleContainer, {marginTop: isAdmin ? 0 : 20}]}>
              <SelectMonth
                style={{paddingLeft: rs(9)}}
                defaultValue={selectedDate}
                name="date"
                onPress={date => handledateChange(date)}
              />

              {isAdmin && (
                <View style={styles.middleBadgeContainer}>
                  <Badge
                    text={trans('Select')}
                    classes="small"
                    bgColor={
                      select && !selectAll ? colors.active : colors.gray3
                    }
                    onPress={() => {
                      setSelectAll(false);
                      setSelect(!select);
                      handleTabChange(true, 'visible');
                    }}
                    style={styles.flexGrow5}
                  />
                  <Badge
                    classes="small"
                    text={trans('Select All')}
                    bgColor={
                      !select && selectAll ? colors.active : colors.gray3
                    }
                    style={styles.flexGrow5}
                    onPress={() => {
                      setSelect(false);
                      setSelectAll(!selectAll);
                      handleTabChange('', 'visible');
                    }}
                  />
                </View>
              )}
            </View>
            {selectAll ? (
              <></>
            ) : (
              <>
                {select && isAdmin && (
                  <View
                    style={[styles.bottomContainer, {marginBottom: rs(10)}]}>
                    <Badge
                      text={trans('Visible')}
                      onPress={() => {
                        setIsVisible(true);

                        setShowVisibleBar(true);
                        setOpenConfirmModal(true);
                        setKey(prevKey => prevKey + 1);
                      }}
                      classes="small"
                      bgColor={
                        isVisible && showVisibleBar
                          ? colors.active
                          : colors.gray3
                      }
                      style={styles.flexGrow2}
                    />
                    <Badge
                      text={trans('No Visible')}
                      onPress={() => {
                        setIsVisible(false);
                        setSelectAll(false);
                        setOpenConfirmModal(true);
                        setShowVisibleBar(true);
                        setKey(prevKey => prevKey + 1);
                      }}
                      bgColor={
                        !isVisible && showVisibleBar
                          ? colors.active
                          : colors.gray3
                      }
                      classes="small"
                      style={styles.flexGrow2}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        }
        contentContainerStyle={
          list?.length > 0
            ? {...customPadding(17, 20, 20, 20), gap: rs(10)}
            : [globalStyles.emptyFlexBox, {...customPadding(17, 20, 20, 20)}]
        }
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        // initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There is no data to display')}
            forLoading={isLoading}
          />
        }
        renderItem={renderItem} // Directly use the function without memoization
        ListFooterComponent={
          <>
            {!isLoading &&
              totalPages > 1 &&
              // list?.length > 0 &&
              (selectAll || select) &&
              (selectAll || isVisible !== null) && (
                <Pagination
                  PageNo={`${page}`}
                  onNext={() => onNextPage()}
                  onBack={() => onPrevPage()}
                />
              )}
          </>
        }
      />
      {openConfirmModal && (
        <ConfirmationModal
          onDismiss={() => {
            setOpenConfirmModal(false);
          }}
          title={trans('Bill')}
          para={trans('Do you confirm the activation of expense?')}
          button2Text={trans('No')}
          onButton2Press={() => {
            setIsVisible(false);
            setOpenConfirmModal(false);
          }}
          button1Text={trans('Confirm')}
          onButton1Press={() => {
            if (!isVisible) {
              console.log('No visible working');
              handleTabChange(false, 'visible');
              setIsVisible(false);
            } else {
              setIsVisible(true);
              handleTabChange(true, 'visible');
            }
            setOpenConfirmModal(false);
          }}
        />
      )}
    </Container>
  );
};

export default IndexBills;
