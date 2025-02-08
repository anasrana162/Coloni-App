import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import { SurveillanceStates, userStates } from '../../state/allSelector.state';
import { customPadding, globalStyles } from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { colors } from '../../assets/global-styles/color.assets';

import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useTranslation } from 'react-i18next';
import { gettingMoreAction, isGettingAction, refreshingAction, searchingAction } from '../../state/features/Surveillance/Surveillance.slice';
import { useFocusEffect } from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';

const SurveillanceCamerasOptional = () => {
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
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
    totalPages, 
  } = customUseSelector(SurveillanceStates);
  const refreshHasOccurred = useRef(false);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: "",
  })
  const onRefresh = useCallback(() => {
    if (!refreshHasOccurred.current) {
      refreshHasOccurred.current = true; 
      setParams(prev => ({ ...prev, page: 1 }));
      dispatch(refreshingAction({ search }));
    }
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      if (!refreshing) {
        onRefresh();
      }
    }, [refreshing, onRefresh])
  );
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
  
  const loadMore = useCallback(() => {
    if (hasMore && !isGetting) {
      const newPage = params.page + 1;
      setParams(prevParams => ({ ...prevParams, page: newPage }));
      dispatch(gettingMoreAction({ ...params, page: newPage }));
    }
  }, [hasMore, isGetting, params]);
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {webhost, name,description,_id} = item || {};
    const imageUrl = item?.images && item?.images.length > 0 
    ? { uri: item.images[0] }
    : imageLink.placeholder; 
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
            navigation.navigate(screens.addSurveillanceCameraOptional as never, {
                edit: true,
                index,
                id: item?._id,
                item:item
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
        <ImagePreview
           source={imageUrl}
          styles={{
            width: rs(50),
            height: rs(50),
            borderRadius: rs(50),
            borderWidth: rs(2),
            borderColor: colors.white,
          }}
        />
        <View
          style={[globalStyles.flexShrink1, { flexGrow: 1}]}>
          <Text
            style={[
              typographies(colors).ralewaySemibold20,
              {color: colors.primary},
            ]}>
            {webhost}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).montserratMedium10,
                {
                  color: colors.black,
                },
              ]}
              numberOfLines={2}>
              {name}
            </Text>
          </View>
          <Text
            style={[
              globalStyles.flexShrink1,
              typographies(colors).montserratMedium10,
              {
                color: colors.black,
              },
            ]}>
            {description}
          </Text>
          <View>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium10,
                {
                  color: colors.primary,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}>

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
        text={trans("Surveillance Camera")}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addSurveillanceCameraOptional as never)
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
          <View style={{backgroundColor: colors.white}}>
          
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

export default SurveillanceCamerasOptional;
