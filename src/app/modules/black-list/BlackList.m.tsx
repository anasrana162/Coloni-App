import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useMemo} from 'react';
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
} from '../../state/features/blacklist/blacklist.slice';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {
  blacklistStates,
  themeStates,
  userStates,
} from '../../state/allSelector.state';
import {useIsFocused, useTheme} from '@react-navigation/native';
import blacklistService from '../../services/features/blacklist/blacklist.service';
import {showAlertWithTwoActions} from '../../utilities/helper';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {userRoles} from '../../assets/ts/core.data';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
const {width} = Dimensions.get('screen');
import {colors} from '../../assets/global-styles/color.assets';
import InfoIcon from '../../assets/icons/Info.icon';
import Pagination from '../../components/core/Pagination.core.component';
const BlackList = () => {
  const {t: trans} = useTranslation();
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
    totalPages,
    search,
    total,
  } = customUseSelector(blacklistStates);
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  const {colors} = useTheme() as any;

  const onRefresh = () => {
    dispatch(refreshingAction({page, perPage}));
  };

  const handleSearch = (text: string) => {
    dispatch(searchingAction({search: text, page, perPage}));
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(searchingAction({search: ''}));
      dispatch(isGettingAction({page: 1, perPage: 12, search: ''}));
    }
  }, [isFocused]);

  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    dispatch(
      gettingMoreAction({
        page: page + 1,
        perPage: 12,
      }),
    );
  };

  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    dispatch(
      gettingMoreAction({
        page: page - 1,
        perPage: 12,
      }),
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {tuition, brand, model, _id, images, color} = item || {};
    const isValidUri = (uri: string) =>
      (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (userInfo.role !== userRoles.VIGILANT) {
            navigation.navigate(screens.addUpdateBlackList, {
              index,
              id: _id,
              edit: true,
            });
          }
        }}
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? 'white' : colors.graySoft,
            borderRadius: rs(10),
            marginTop: 10,
            gap: rs(19),
          },
        ]}>
        <View
          style={{
            width: rs(50),
            height: rs(50),
            borderRadius: rs(50),
            borderWidth: rs(2),
            borderColor: colors.white,
            backgroundColor: colors.primary,
            marginLeft: 10,
            overflow: 'hidden',
          }}>
          <Image
            source={
              isValidUri(images[0] == undefined ? '' : images[0])
                ? {uri: images[0]}
                : imageLink.placeholder
            }
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View
          style={[
            globalStyles.flexShrink1,
            {marginVertical: rs(10), flexGrow: 1},
          ]}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {color: theme === 'dark' ? 'black' : colors.grayDark},
            ]}>
            {tuition}
          </Text>

          {userInfo.role !== userRoles.VIGILANT && (
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium10,
                {
                  color: theme === 'dark' ? 'black' : colors.darkBlue2,
                  lineHeight: rs(20),
                },
              ]}
              numberOfLines={2}>
              {brand}
            </Text>
          )}

          <Text
            style={[
              typographies(colors).ralewayBold10,
              {
                color:
                  userInfo.role === userRoles.VIGILANT
                    ? theme === 'dark'
                      ? 'black'
                      : colors.black
                    : colors.primary,
              },
            ]}>
            {model}
          </Text>

          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 30,
              borderWidth: 0.3,
              backgroundColor: color?.toLowerCase(),
              marginTop: 5,
            }}></View>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Restricted List')}
        rightIcon={
          userInfo?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          userInfo?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) &&
          navigation.navigate(screens.addUpdateBlackList as never)
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
            <View style={styles.infoCont}>
              <View
                style={{flexDirection: 'row', columnGap: 10, marginBottom: 5}}>
                <InfoIcon width={24} height={24} />
                <Text style={styles.infoAlertTitle}>
                  {trans('Missing Configuration')}
                </Text>
              </View>
              <Text style={styles.infoAlertDesc}>
                {trans(
                  'Please contact your dealer for support to enable Vehicle Blacklist validation settings.',
                )}
              </Text>
            </View>

            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
            <Text
              style={{
                ...typographies(colors).ralewayBold15,
                color: colors.primaryText,
                alignSelf: 'flex-end',
              }}>
              {trans('Total')}: {total}
            </Text>
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
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  infoCont: {
    width: width - 40,
    padding: 15,
    backgroundColor: colors.error4,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: -10,
  },
  infoAlertTitle: {fontSize: 16, color: colors.black, fontWeight: '500'},
  infoAlertDesc: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
    marginLeft: 5,
  },
});

export default BlackList;
