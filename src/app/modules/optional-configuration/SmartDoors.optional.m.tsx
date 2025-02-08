import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import { SmartDoorStates, userStates } from '../../state/allSelector.state';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { gettingMoreAction, isGettingAction, refreshingAction, searchingAction  } from '../../state/features/SmartDoor/smartDoorSlice';
import { customPadding, globalStyles } from '../../assets/global-styles/global.style.asset';
import { colors } from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useFocusEffect } from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';
const SmartDoorsOptional = () => {
  const navigation = useCustomNavigation<any>();
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
    totalPages
  } = customUseSelector(SmartDoorStates);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: "",
  })
  const { t: trans } = useTranslation();
  const dispatch = customUseDispatch();

  const onRefresh = () => {
    setParams(prev => ({ ...prev, page: 1 }));
    dispatch(refreshingAction({ search }));
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
    const {description,model,name,_id } = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addSmartDoorOptional, {
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
              typographies(colors).montserratNormal18,
              { color: colors.primary},
            ]}>
           {name}
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
              {model}
            </Text>
          </View>
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
        text={trans("Smart Door")}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addSmartDoorOptional as never)
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
          <View style={{ backgroundColor: colors.white }}>
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

export default SmartDoorsOptional;
