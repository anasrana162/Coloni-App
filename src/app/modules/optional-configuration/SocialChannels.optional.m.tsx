import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {SocialChannelStates} from '../../state/allSelector.state';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/SocialChannel/SocialChannel.slice';
import Comment from '../../assets/images/svg/comment.svg';
import DoesNotComment from '../../assets/images/svg/DoesNotComment.svg';
import Post from '../../assets/images/svg/Post.svg';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import SocialChannel from '../../assets/images/svg/SocialChannel.svg';
import Pagination from '../../components/core/Pagination.core.component';
const SocialChannelsOptional = () => {
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
  } = customUseSelector(SocialChannelStates);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
  });
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation<any>();
  const onRefresh = () => {
    setParams(prev => ({...prev, page: 1}));
    dispatch(refreshingAction({search}));
  };
  //for pagination
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
    if (!isGetting) {
      dispatch(isGettingAction(params));
    }
  }, [params, isGetting]);

  const loadMore = () => {
    if (hasMore) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(gettingMoreAction({...params, page: newPage}));
    }
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {name, description, asset, allowComments, allowPost, _id} =
      item || {};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addSocialChannelOptional, {
            id: _id,
            index,
            edit: true,
          })
        }
        style={styles.container}>
        <View style={{...globalStyles.flexRow, marginTop: 10}}>
          <View>
            <SocialChannel />
          </View>
          <View
            style={[globalStyles.flexShrink1, {flexGrow: 1, marginLeft: 6}]}>
            <Text
              style={[
                typographies(colors).ralewayBold15,
                {color: colors.primary},
              ]}>
              {name}
            </Text>
            <View style={[globalStyles.flexShrink1]}>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {
                    color: colors.gray7,
                  },
                ]}
                numberOfLines={2}>
                {description}
              </Text>
            </View>

            <View style={[globalStyles.flexShrink1]}>
              <Text
                style={{
                  ...globalStyles.flexShrink1,
                  ...typographies(colors).ralewayMedium12,
                }}>
                {allowComments}
              </Text>
            </View>

            <View style={styles.flexRow}>
              <View style={styles.flexRow}>
                {allowPost && (
                  <>
                    <Comment />
                    <Text style={styles.bottomTexts}>
                      {trans('Allows Post')}
                    </Text>
                  </>
                )}
              </View>
              <View style={styles.flexRow}>
                {allowComments && (
                  <>
                    <Comment />
                    <Text style={styles.bottomTexts}>
                      {trans('Allow Comment')}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
          {asset && (
            <View style={styles.flexRow}>
              <Text style={styles.assetText}>{trans('Asset')}</Text>
              <DownArrow
                fill={colors.brightGreen}
                style={{transform: [{rotate: '-90deg'}]}}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Social Channel')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addSocialChannelOptional as never)
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
          <View style={{backgroundColor: colors.white}}></View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{...customPadding(0, 20, 10, 20), gap: rs(5)}}
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
        onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    //...globalStyles.flexRow,
    ...globalStyles.flexGrow1,
    alignItems: `${'flex-start'}`,
    ...customPadding(6, 10, 6, 10),
    backgroundColor: colors.graySoft,
    borderRadius: rs(10),
    marginTop: rs(10),
  },
  bottomTexts: {
    ...typographies(colors).ralewayMedium08,
    color: colors.gray7,
    ...customPadding(0, 2, 0, 2),
  },
  assetText: {
    ...typographies(colors).ralewayBold10,
    color: colors.brightGreen,
  },
  flexRow: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    ...customPadding(0, 2, 2, 0),
  },
});
export default SocialChannelsOptional;
