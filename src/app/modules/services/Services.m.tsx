import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/services/services.slice';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {servicesStates, userStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import servicesService from '../../services/features/services/services.service';
import {showAlertWithTwoActions} from '../../utilities/helper';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {userRoles} from '../../assets/ts/core.data';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import InfoIcon from '../../assets/icons/Info.icon';
import {config} from '../../../Config';
import {useIsFocused} from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';
const {width} = Dimensions.get('screen');
const Services = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const isFocused = useIsFocused();
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    totalPages,
    isGetting,
    search,
  } = customUseSelector(servicesStates);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
  });

  
  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };
  const handleSearch = (text: string) => {
    dispatch(searchingAction({search: text}));
  };
  useEffect(() => {
    if (isFocused) {
      dispatch(isGettingAction(params));
    }
  }, [isFocused]);

  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await servicesService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this services?'),
      onPressAction: confirm,
    });
  };

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
    const {name, notificationMessage, model, _id, images, active} = item || {};
    const isValidUri = (uri: string) =>
      (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addServices, {index, edit: true, id: _id})
        }
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {
            alignItems: `${'center'}`,
            ...customPadding(10, 10, 10, 10),
            backgroundColor: colors.graySoft,
            borderRadius: rs(10),
            marginTop: rs(10),
          },
        ]}>
        <Image
          source={
            isValidUri(images[0] == undefined ? '' : images[0])
              ? {uri: images[0]}
              : {uri: imageLink.placeholder}
          }
          style={{
            width: rs(50),
            height: rs(50),
            borderRadius: rs(50),
            borderWidth: rs(2),
            borderColor: colors.white,
          }}
        />
        <View style={[globalStyles.flexShrink1, {flexGrow: 1}]}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {color: colors.grayDark},
            ]}>
            {name}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium10,
                {
                  color: colors.darkBlue2,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {notificationMessage}
            </Text>
          </View>
        </View>
        {active && (
          <View
            style={{
              width: 80,
              height: 30,
              backgroundColor: '#22FE5F',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={[
                typographies(colors).ralewayBold12,
                {
                  color: colors.white,
                },
              ]}>
              {active ? trans('Active') : trans('Inactive')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Services')}
        rightIcon={
          userInfo?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          userInfo?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) &&
          navigation.navigate(screens.addServices as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={6}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <View
              style={{
                width: width - 40,
                padding: 15,
                backgroundColor: colors.primary,
                borderRadius: 20,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              <View
                style={{flexDirection: 'row', columnGap: 10, marginBottom: 5}}>
                <InfoIcon width={24} height={24} />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black,
                    fontWeight: '500',
                  }}>
                  {trans('Information')}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.white,
                  fontWeight: '500',
                  marginLeft: 5,
                }}>
                {trans('Residents must subscribe to the service in order to receive notifications.')}
              </Text>
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
                PageNo={page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
        // onEndReachedThreshold={0.25}
        // onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default Services;
