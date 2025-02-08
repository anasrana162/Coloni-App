import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useTranslation } from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import { debtorsReportStates, userStates } from '../../state/allSelector.state';
import { useFocusEffect, useIsFocused, useTheme } from '@react-navigation/native';
import DownArrow from '../..//assets/images/svg/downArrow.svg';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/debtorsReport/debtorsReport.slice';
import { formatDate, showAlertWithTwoActions } from '../../utilities/helper';
import debtorsReportService from '../../services/features/debtorsReport/debtorsReport.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import { userRoles } from '../../assets/ts/core.data';
import Badge from '../../components/app/Badge.app';
import DetailsDebtorsReport from './Details.debtorsReport.m';
import SelectMonth from '../../components/app/SelectMonth.app';
import moment from 'moment';
import Pagination from '../../components/core/Pagination.core.component';
const DebtorsReport = () => {
  const { t: trans } = useTranslation();
  const navigation = useCustomNavigation<any>();
  const { userInfo } = customUseSelector(userStates);
  const {
    list,
    isLoading,
    totalPages,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    status,
    asset,
  } = customUseSelector(debtorsReportStates);
  const isFocused = useIsFocused();
  const [activeBadge, setActiveBadge] = useState<string>('asset');
  const [isAssetActive, setIsAssetActive] = useState<boolean>(true);
  const [isInactiveActive, setIsInactiveActive] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [params, setParams] = useState<any>({
    page: 1,
    perPage: 12,
    search: '',
    status: 'asset',
    asset: true,
    period: moment(new Date()).format('YYYY-MM-DD'),
  }); 
  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    dispatch(
      searchingAction({
        ...params,
        period: moment(newDate).format('YYYY-MM-DD'),
      }),
    ); 
  };
  const dispatch = customUseDispatch();
  const { colors } = useTheme() as any;
  
  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };

  
  const handleBadgePress = (badge: string) => {
    setActiveBadge(badge);

    const isAssetActive = badge === 'asset';
    const isInactiveActive = badge === 'inactive';
    console.log('Params badge', {
      ...params,
      status: badge,
      asset: isAssetActive,
      period: moment(selectedDate).format('YYYY'),
    });
    setParams({
      ...params,
      status: badge,
      asset: isAssetActive,
      period: moment(selectedDate).format('YYYY'),
    });
    dispatch(
      searchingAction({
        ...params,
        status: badge,
        asset: isAssetActive,
        period: moment(selectedDate).format('YYYY'),
      }),
    );
    // setIsAssetActive(isAssetActive);
    // setIsInactiveActive(isInactiveActive);
  };

  // const handleSearch = (status: string) => {
  //   setActiveBadge(status);
  //   dispatch(searchingAction({ status }));
  // };

  useEffect(() => {
    if (isFocused) {
      console.log('Params initails', params);
      dispatch(isGettingAction(params));
    }
  }, [isFocused]);
  // const loadMore = () => {
  //   hasMore && dispatch(gettingMoreAction({ page, perPage, search }));
  // };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({ index, id }));
        await debtorsReportService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this debtorsReport?'),
      onPressAction: confirm,
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const { period, total } = item || {};

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate(screens.detailsDebtorsReport as never, {
            index,
            item: item,
            status,
          })
        }
        style={[
          globalStyles.rowBetween,
          {
            backgroundColor: colors.gray5,
            borderRadius: rs(10),
            marginVertical: 5,
            ...customPadding(12, 14, 12, 14),
          },
        ]}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            { color: colors.primary },
          ]}>
          {moment(item?.period).format('MMMM  YYYY')}
        </Text>
        <View style={globalStyles.flexRow}>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              { color: colors.primary },
            ]}>
            $ {total}
          </Text>
          <View style={{ transform: [{ rotate: '-90deg' }] }}>
            <DownArrow />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = renderItem;
  return (
    <Container>
      <Header
        text={trans('Debtors Report')}
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() => {
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) &&
            navigation.navigate(screens.addUpdateDebtorsReport as never);
        }}
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{ backgroundColor: colors.white }}>
            <View style={{ ...customPadding(10, 10, 10, 10) }}>
              {userInfo?.role !== userRoles.RESIDENT && <View style={[globalStyles.flexRow]}>
                <Badge
                  text={trans('Assets')}
                  style={{ width: `${'49%'}` }}
                  onPress={() => handleBadgePress('asset')}
                  bgColor={params?.asset ? colors.tertiary : colors.gray5}
                  textColor={params?.asset ? colors.white : colors.gray7}
                />
                <Badge
                  text={trans('Inactive')}
                  style={{ width: `${'49%'}` }}
                  onPress={() => handleBadgePress('inactive')}
                  bgColor={!params?.asset ? colors.tertiary : colors.gray5}
                  textColor={!params?.asset ? colors.white : colors.gray7}
                />
              </View>}
            </View>
            <SelectMonth
              style={{ ...customMargin(10, 5, 0, 10) }}
              defaultValue={new Date() || selectedDate}
              showYearOnly={true}
              onPress={handleMonthChange}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{ ...customPadding(20, 20, 10, 20), gap: rs(5) }}

      // onEndReachedThreshold={0.25}
      // onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default DebtorsReport;
