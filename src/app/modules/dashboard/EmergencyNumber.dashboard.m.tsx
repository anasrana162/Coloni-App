/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {useTranslation} from 'react-i18next';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {emergencyNumbersState, userStates} from '../../state/allSelector.state';
import {userRoles} from '../../assets/ts/core.data';
import {
  isGettingAction,
  gettingMoreAction,
  refreshingAction,
  deleteAction,
} from '../../state/features/emergencyNumber/emergencyNumber.slice';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {config} from '../../../Config';
import Pagination from '../../components/core/Pagination.core.component';
const {width} = Dimensions.get('screen');

const EmergencyNumber = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    total,
    perPage,
    totalPages,
    isGetting,
  } = customUseSelector(emergencyNumbersState);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
  });
  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };
  useEffect(() => {
    // if (!isGetting) {
    dispatch(isGettingAction(params));
    // }
  }, []);
  // const loadMore = () => {
  //   hasMore && dispatch(gettingMoreAction({ page, perPage }));
  // };

  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    setParams({
      ...params,
      page: page + 1,
      perPage: 10,
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: page + 1,
        perPage: 10,
      }),
    );
  };

  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    setParams({
      ...params,
      page: page - 1,
      perPage: 10,
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: page - 1,
        perPage: 10,
      }),
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    var imageSource = Array.isArray(item?.images)
      ? {uri: item?.images[0]}
      : {uri: item?.images};
    console.log('Image Source Emergency Number:', imageSource);
    const isValidUri = (uri: string) =>
      (uri && uri.startsWith('http')) || uri.startsWith('file');
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          config?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN)
            ? navigation.navigate(screens.addUpdateEmergencyNumber as never, {
                edit: true,
                index,
                id: item?._id,
              })
            : undefined
        }
        style={{
          width: width - 30,
          flexDirection: 'row',
          alignSelf: 'center',
          backgroundColor: colors.graySoft,
          padding: 10,
          borderRadius: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: rs(50),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.secondary,
            }}>
            <Image
              source={
                isValidUri(imageSource.uri)
                  ? imageSource
                  : imageLink?.placeholder
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 30,
                // borderWidth: rs(2),
                borderColor: colors.secondary,
              }}
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Text
              style={[
                typographies(colors).ralewayMedium14,
                {color: colors.black},
              ]}>
              {item?.name}
            </Text>
            <Text style={typographies(colors).montserratNormal12}>
              {item?.phone}
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
        text={trans('Emergency Numbers')}
        showBg={true}
        rightIcon={
          config?.role === userRoles.ADMIN ? (
            <ImagePreview source={imageLink.addIcon} />
          ) : config?.role === userRoles.SUPER_ADMIN ? (
            <ImagePreview source={imageLink.addIcon} />
          ) : (
            <></>
          )
        }
        rightControl={() =>
          navigation.navigate(screens.addUpdateEmergencyNumber as never)
        }
      />
      <FlatList
        data={list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  ...typographies(colors).ralewayBold12,
                  fontSize: 16,
                  color: colors?.primaryText,
                }}>{`${'Total'}: ${total}`}</Text>
            </View>
          );
        }}
        contentContainerStyle={
          list?.length > 0
            ? {
                // ...customPadding(20, 20, 20, 20),
                width: '93%',
                alignSelf: 'center',
                gap: rs(10),
              }
            : [globalStyles.emptyFlexBox, {...customPadding(17, 20, 20, 20)}]
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no emergency telephone numbers registered')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
        ListFooterComponent={
          <>
            {!isLoading && totalPages > 1 && (
              <Pagination
                PageNo={page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};

export default EmergencyNumber;
