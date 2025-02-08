import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {screens} from '../../routes/routeName.route';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {billItemStyles} from '../../components/app/BillItem.app';
import {userRoles} from '../../assets/ts/core.data';
import useAmenities from './hooks/useAmenities.hook';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {calculateCash} from '../../utilities/helper';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {amenitiesStates, userStates} from '../../state/allSelector.state';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
} from '../../state/features/amenities/amenities.slice';
import Pagination from '../../components/core/Pagination.core.component';

const Amenities: React.FC = () => {
  const {userInfo} = customUseSelector(userStates);
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const isFocused = useIsFocused();
  const dispatch = customUseDispatch();
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
  });
  // const {
  //   isLoading,
  //   list,
  //   loadMore,
  //   hasMore,
  //   onRefresh,
  //   refreshing,
  //   userInfo,
  //   colors,
  //   navigation,
  //   trans,
  // } = useAmenities();
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
    totalPages,
  } = customUseSelector(amenitiesStates);
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
  }, [list, params, isFocused]);
  const loadMore = useCallback(() => {
    if (hasMore && !isGetting) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(gettingMoreAction({...params, page: newPage}));
    }
  }, [hasMore, isGetting, params]);
  // const onRefresh = () => {
  //   dispatch(refreshingAction());
  // };

  const onRefresh = useCallback(() => {
    setParams(prev => ({...prev, page: 1}));
    dispatch(refreshingAction({search}));
  }, [dispatch, search]);

  const styles = billItemStyles(colors);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const onPress = () => {
      navigation.navigate(screens.addUpdateAmenities as never, {
        index,
        id: item?._id,
        edit: true,
      });
    };
    const imageUrl = item?.images[0]
      ? {uri: item.images[0]}
      : imageLink.placeholder;
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.7}
        onPress={onPress}>
        <View style={styles.imageContainer}>
          <ImagePreview
            source={imageUrl}
            borderRadius={40}
            styles={styles.image}
          />
        </View>
        <View style={styles.middleContainer}>
          <View style={globalStyles.flexShrink1}>
            <Text style={typographies(colors).ralewayBold12} numberOfLines={1}>
              {item?.amenityName}
            </Text>

            <View style={styles.dateContainer}>
              <CalenderIcon height={6} width={6} />
              <Text style={typographies(colors).montserratNormal8}>
                {trans('See Agenda')}
              </Text>
            </View>
          </View>
          <Text
            style={typographies(colors).montserratMedium10}>{`${calculateCash(
            item?.price,
          )} >`}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Amenities')}
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.addUpdateAmenities as never)
            : undefined
        }
      />
      <FlatList
        data={list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={
          list?.length > 0
            ? {
                ...customPadding(17, 20, 20, 20),
                gap: rs(10),
              }
            : [globalStyles.emptyFlexBox, {...customPadding(17, 20, 20, 20)}]
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no amenities found!')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
        // ListFooterComponent={
        //   hasMore ? (
        //     <View style={[{height: rs(40)}, globalStyles.activityCenter]}>
        //       <ActivityIndicator color={colors.primary} />
        //     </View>
        //   ) : undefined
        // }
        ListFooterComponent={
          <>
            {hasMore ? (
              <View style={[{height: rs(40)}, globalStyles.activityCenter]}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              !isLoading &&
              totalPages > 1 && (
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
        onEndReached={hasMore ? loadMore : undefined}
      />
    </Container>
  );
};

export default Amenities;
