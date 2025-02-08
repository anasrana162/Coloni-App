import React, { useCallback, useEffect, useMemo, useState, } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import Container from '../../../layouts/Container.layout';
import Header from '../../../components/core/header/Header.core';
import { useCustomNavigation } from '../../../packages/navigation.package';
import EmptyContent from '../../../components/core/EmptyContent.core.component';
import { customUseDispatch, customUseSelector } from '../../../packages/redux.package';
import { frequentVisitStates, userStates } from '../../../state/allSelector.state';
import { useTranslation } from 'react-i18next';
import { gettingMoreAction, isGettingAction, refreshingAction, searchingAction } from '../../../state/features/frequentVisit/frequentVisit.slice';
import { TouchableOpacity } from 'react-native';
import { customMargin, customPadding, globalStyles } from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import SearchInput from '../../../components/app/SearchInput.app';
import Pagination from '../../../components/core/Pagination.core.component';
import { debounceHandler } from '../../../utilities/helper';
import { useIsFocused, useTheme } from '@react-navigation/native';
import imageLink from '../../../assets/images/imageLink';
import { colors } from '../../../assets/global-styles/color.assets';
import ShowDate from '../../../components/app/ShowDate.app';
import moment from 'moment';
import SelectMonth from '../../../components/app/SelectMonth.app';
const AccessAlertVig = () => {
  const { t: trans } = useTranslation();
  // const navigation = useCustomNavigation<any>();
  // const { userInfo } = customUseSelector(userStates);
  const isFocused = useIsFocused();
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    totalPages,
  } = customUseSelector(frequentVisitStates);
  const [itemCount, setItemCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
    period: new Date()
  });
  console.log('checking list', list);
  const dispatch = customUseDispatch();
  const { colors } = useTheme() as any;
  const onNext = () => {
    if (params.page < totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({ ...prevParams, page: newPage }));
      dispatch(isGettingAction({ ...params, page: newPage }));
    }
  };
  //for pagination
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({ ...prevParams, page: newPage }));
      dispatch(isGettingAction({ ...params, page: newPage }));
    }
  };
  const onRefresh = () => {
    dispatch(refreshingAction({ search }));
  };

  const handleSearch = (text: string) => {
    debounceHandler(dispatch(searchingAction({ search: text })));
  };
  useEffect(() => {
    setItemCount(list.length);
  }, [list]);


  // const filteredList = useMemo(() => {
  //   if (!selectedDate) return list;
  //   return list.filter(item => {
  //     const itemDate = new Date(item?.date);
  //     return (
  //       itemDate.getMonth() === selectedDate.getMonth() &&
  //       itemDate.getFullYear() === selectedDate.getFullYear()
  //     );
  //   });
  // }, [list, selectedDate]);

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const formattedDate = moment(newDate).format("YYYY-MM-DD");
    setParams({ ...params, period: formattedDate });
    // dispatch(searchingAction({ ...params, period: formattedDate, search }));
  };
  useEffect(() => {
    if (isFocused) {
      dispatch(isGettingAction(params));
    }
  }, [params, isFocused]);
  const loadMore = useCallback(() => {
    if (hasMore && !isGetting) {
      const newPage = params.page + 1;
      setParams(prevParams => ({ ...prevParams, page: newPage, search }));
      dispatch(gettingMoreAction({ ...params, page: newPage, search }));
    }
  }, [hasMore, isGetting, params]);
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const { name, note, _id } = item || {};
    const imageUrl = item?.images[0]
      ? { uri: item.images[0] }
      : imageLink.placeholder;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          globalStyles.flexRow,
          {
            ...customPadding(9, 7, 9, 14),
            backgroundColor: colors.graySoft,
            borderRadius: rs(20),
            marginTop: rs(12),
            gap: rs(20),
          },
        ]}>
        <View>
          <View
            style={[
              globalStyles.flexShrink1,
              globalStyles.rowBetween,
              { width: '89%' },
            ]}>
            <View style={globalStyles.flexShrink1}>
              <Text
                style={[
                  typographies(colors).ralewayBold12,
                  { color: colors.primary },
                ]}>
                {item?.resident?.street?.name} {item?.resident?.home}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewayMedium10,
                  {
                    color: colors.primary,
                    lineHeight: rs(20),
                    flexShrink: 1,
                    flexGrow: 1,
                  },
                ]}>
                {name}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View
                style={[
                  globalStyles.flexRow,
                  globalStyles.flexShrink1,
                  { gap: rs(5) },
                ]}>
              </View>
            </View>
          </View>
          <Text
            numberOfLines={2}
            style={[
              typographies(colors).montserratNormal8,
              { color: colors.gray3, lineHeight: rs(17) },
            ]}>
            {note}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container bottomTab={false}>
      <Header
        text={trans("Access Alert")}
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
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              //onEndEditing={handleEndEditing}
              style={{ marginBottom: rs(4) }}
            />
            <View style={styles.container}>
              <View>
                <SelectMonth

                  style={{ ...customMargin(10, 5, 0, 10) }}
                  defaultValue={new Date() || selectedDate}
                  //showYearOnly={true}
                  onPress={handleMonthChange}
                />
              </View>
              <View>
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium14,
                    color: colors.primary,
                  }}>
                  {itemCount}
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{ ...customPadding(20, 20, 10, 20), gap: rs(5) }}
        ListFooterComponent={
          <>
            {hasMore ? (
              <View style={[{ height: rs(40) }, globalStyles.activityCenter]}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              !isLoading && totalPages > 1 && (
                <Pagination
                  PageNo={params.page}
                  onNext={() => onNext()}
                  onBack={() => onBack()}
                />
              )
            )}
          </>
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
    ...customMargin(2, 2, 10, 2),
    ...customPadding(2, 2, 10, 2),
    borderBottomWidth: 2,
    borderBottomColor: colors.primary
  },
  ListContainer: {
    ...customPadding(10, 10, 10, 10),
    //marginHorizontal: 12,
    backgroundColor: colors.gray,
    borderRadius: 12,
    flex: 1,
    //color:colors.primary
  },
  ListContentText: {
    ...typographies(colors).ralewayMedium12,
    ...customPadding(0, 26, 0, 0),
    // paddingHorizontal:16,
  },
});
export default AccessAlertVig;
