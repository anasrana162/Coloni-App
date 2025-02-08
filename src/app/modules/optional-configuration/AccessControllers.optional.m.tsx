import {TouchableOpacity, View,Text, ActivityIndicator,FlatList} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import SearchInput from '../../components/app/SearchInput.app';
import {customPadding, globalStyles} from '../../assets/global-styles/global.style.asset';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import { AccessControlStates, userStates } from '../../state/allSelector.state';
import { gettingMoreAction, isGettingAction, refreshingAction, searchingAction } from '../../state/features/AccessControl/AccessControl.slice';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { colors } from '../../assets/global-styles/color.assets';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {themeStates} from '../../state/allSelector.state';
import { formatDate } from '../../utilities/helper';
import { useTranslation } from 'react-i18next';
import Pagination from '../../components/core/Pagination.core.component';

const AccessControllersOptional = () => {
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const {theme} = customUseSelector(themeStates);

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
  } = customUseSelector(AccessControlStates);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: "",
  })
  const { t: trans } = useTranslation();
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
    setParams(prev => ({ ...prev, page: 1 }));
    dispatch(refreshingAction({ search }));
  };
  const handleSearch = (text: string) => {
    dispatch(searchingAction({ search: text }));
  };
  const handleEndEditing = () => {
    dispatch(searchingAction({ search }));
  };
  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction(params));
    }
  }, [params, isGetting]);
  const loadMore = () => {
    if (hasMore) {
      const newPage = params.page + 1;
      setParams(prevParams => ({ ...prevParams, page: newPage }));
      dispatch(gettingMoreAction({ ...params, page: newPage }));
    }
  };
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const { name,description,brand,_id} = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addAccessControllerOptional, {
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
            borderRadius:rs(10),
            marginTop: rs(10),
          },
        ]}>
        <View style={[globalStyles.flexShrink1, { flexGrow: 1, marginLeft: 10 }]}> 
          <Text
            style={[
              typographies(colors).ralewaySemibold14,
              { color: colors.primary},
            ]}>
           {name}
          </Text>
          <Text
            style={[
              typographies(colors).montserratNormal12,
              { color: colors.black},
            ]}>
           {brand}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium14,
                {
                  color: colors.error1,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {description}
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
        text={trans('Controllers')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addAccessControllerOptional as never)
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

export default AccessControllersOptional;
