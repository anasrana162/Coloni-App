import {View, FlatList, ActivityIndicator, Text} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {accountStatusStates, userStates} from '../../state/allSelector.state';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
} from '../../state/features/accountStatus/accountStatus.slice';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {userRoles} from '../../assets/ts/core.data';
import Badge from '../../components/app/Badge.app';
import AccountStatusItem from '../../components/app/AccountStatusItem.app';
import SelectMonth from '../../components/app/SelectMonth.app';
import Pagination from '../../components/core/Pagination.core.component';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {typographies} from '../../assets/global-styles/typography.style.asset';
const AccountStatus = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    status,
    date,
    period,
    totalPages,
    total,
  } = customUseSelector(accountStatusStates);
  const isFocused = useIsFocused();
  const [params, setParams] = useState({
    page: 1,
    perPage: 8,
    search: '',
    status: 'asset',
    period: moment(new Date()).format('YYYY'),
  });

  //filter by date code starts from here
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dispatch = customUseDispatch();

  const {colors} = useTheme() as any;

  const onRefresh = () => {
    console.log('params on refresh:', params);
    dispatch(refreshingAction(params));
  };
  const onNext = () => {
    if (params.page < totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };
  //for pagination
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(isGettingAction(params));
    }
  }, [isFocused]);

  const handleStatus = (value: string) => {
    console.log('value', value, 'Values', {
      ...params,
      page: 1,
      perPage: 8,
      search: '',
      status: value,
      period: moment(selectedDate).format('YYYY'),
    });
    setParams({
      ...params,
      page: 1,
      perPage: 8,
      search: '',
      status: value,
      period: moment(selectedDate).format('YYYY'),
    });
    dispatch(
      searchingAction({
        ...params,
        page: 1,
        perPage: 8,
        search: '',
        status: value,
        period: moment(selectedDate).format('YYYY'),
      }),
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return <AccountStatusItem userInfo={userInfo} item={item} index={index} />;
  };
  const memoizedValue = useMemo(() => renderItem, []);

  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  console.log('TotalPages', totalPages);
  return (
    <Container>
      <Header
        text={!isAdmin ? trans('Account Statement') : trans('Account Status')}
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) &&
          navigation.navigate(screens.addUpdateAccountStatus as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            {isAdmin && (
              <View style={globalStyles.flexRow}>
                <Badge
                  text={trans('Assets')}
                  onPress={() => handleStatus('asset')}
                  style={{width: `${'49%'}`}}
                  bgColor={status === 'asset' ? colors.tertiary : colors.gray5}
                  textColor={status === 'asset' ? colors.white : colors.gray7}
                />
                <Badge
                  text={trans('InActive')}
                  onPress={() => handleStatus('inactive')}
                  style={{width: `${'49%'}`}}
                  bgColor={
                    status === 'inactive' ? colors.tertiary : colors.gray5
                  }
                  textColor={
                    status === 'inactive' ? colors.white : colors.gray7
                  }
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <SelectMonth
                style={{...customMargin(8, 20, 4, 10)}}
                defaultValue={new Date() || params?.period}
                showYearOnly={true}
                onPress={period => {
                  setSelectedDate(period);
                  setParams({
                    ...params,
                    period: moment(period).format('YYYY'),
                  });
                  dispatch(
                    searchingAction({
                      ...params,
                      period: moment(period).format('YYYY'),
                    }),
                  );
                }}
              />
              <Text
                style={[
                  {color: colors.primaryText, fontSize: 13},
                  customMargin(8, 10, 4, 20),
                  typographies(colors).ralewayBold15,
                ]}>{`${trans('Total')}: ${total}`}</Text>
            </View>
          </View>
        }
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
                PageNo={params.page}
                onNext={() => onNext()}
                onBack={() => onBack()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};

export default AccountStatus;
