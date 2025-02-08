import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../layouts/Container.layout';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  customMargin,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import Badge from '../../components/app/Badge.app';
import { colors } from '../../assets/global-styles/color.assets';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import { AccessTagCardStates } from '../../state/allSelector.state';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import { useTranslation } from 'react-i18next';
import { gettingMoreAction, isGettingAction, refreshingAction, searchingAction } from '../../state/features/AccessTagCard/AccessTagCardSlice';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { useFocusEffect } from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';
import {themeStates} from '../../state/allSelector.state';

const AccessCardOptional = () => {
  const navigation = useCustomNavigation<any>();
  const { t: trans } = useTranslation();
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
    totalPages,
  } = customUseSelector(AccessTagCardStates);
  const {theme} = customUseSelector(themeStates);
  const refreshHasOccurred = useRef(false);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: "",
  })
  const dispatch = customUseDispatch();
  const handleSearch = (text: string) => {
    dispatch(searchingAction({ search: text, status }));
  };
  const handleEndEditing = () => {
    dispatch(searchingAction({ search }));
  };
//for pagination
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
  const onRefresh = useCallback(() => {
    setParams(prev => ({ ...prev, page: 1 }));
    dispatch(refreshingAction({ search }));
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      onRefresh(); 
    }, [onRefresh])
  );
  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction(params));
    }
  }, [params, isGetting]);
  
  
  const loadMore = useCallback(() => {
    if (hasMore && !isGetting) {
      const newPage = params.page + 1;
      setParams(prevParams => ({ ...prevParams, page: newPage }));
      dispatch(gettingMoreAction({ ...params, page: newPage }));
    }
  }, [hasMore, isGetting, params]);

  const handleStatus = (value: string) => {
    dispatch(searchingAction({ search, status: value }));
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const { user, card, _id } = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addAccessCardOptional, {
            id: _id,
            index,
            edit: true,
          })
        }
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {
            alignItems: `${'flex-start'}`,
            ...customPadding(10, 10, 10, 10),
            backgroundColor: colors.graySoft,
            borderRadius: rs(10),
            marginTop: rs(10),
          },
        ]}>
        <View style={[globalStyles.flexShrink1, { flexGrow: 1, marginLeft: 10 }]}>
          <Text
            style={[
              typographies(colors).montserratNormal18,
              { color: colors.primary },
            ]}>
            {user?.street?.name} {user?.home}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium12,
                {

                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {card}
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans("Access Tag/Card")}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addAccessCardOptional as never)
        }
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
          <View style={{ backgroundColor: theme === 'dark' ? colors.black : colors.white }}>
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              onEndEditing={handleEndEditing}
              style={{ marginBottom: rs(10) }}
            />
            <View style={globalStyles.flexRow}>
              <Badge
                text={trans('Activities')}
                onPress={() => handleStatus('Activities')}
                style={{ width: `${'49%'}` }}
                bgColor={status === 'Activities' ? colors.tertiary : colors.gray5}
                textColor={status === 'Activities' ? colors.white : colors.gray7}
              />
              <Badge
                text={trans('InActive')}
                onPress={() => handleStatus('inactive')}
                style={{ width: `${'49%'}` }}
                bgColor={status === 'inactive' ? colors.tertiary : colors.gray5}
                textColor={status === 'inactive' ? colors.white : colors.gray7}
              />
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

export default AccessCardOptional;
