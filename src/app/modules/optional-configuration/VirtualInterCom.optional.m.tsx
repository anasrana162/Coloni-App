import React, { useEffect, useMemo } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { VirtualPhoneStates } from '../../state/allSelector.state';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { customPadding, globalStyles } from '../../assets/global-styles/global.style.asset';
import { useTranslation } from 'react-i18next';
import { isGettingAction, refreshingAction, searchingAction } from '../../state/features/VirtualPhone/VirtualPhoneSlice';
import { gettingMoreAction } from '../../state/features/SmartDoor/smartDoorSlice';
import { typographies } from '../../assets/global-styles/typography.style.asset';

const VirtualInterComOptional = () => {
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
  } = customUseSelector(VirtualPhoneStates);
  const { t: trans } = useTranslation();
  const dispatch = customUseDispatch();
  const onRefresh = () => {
    dispatch(refreshingAction({ search }));
  };
  const handleSearch = (text: string) => {
    dispatch(searchingAction({ search: text }));
  };
  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction());
    }
  }, []);
  const loadMore = () => {
    hasMore && dispatch(gettingMoreAction({ page, perPage, search }));
  };
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const {guy,sipUser,name,_id} = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addVirtualInterphoneOptional, {
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
           {guy}
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
              {sipUser}
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
              {name}
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
        text={trans("Virtual Interphone")}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addVirtualInterphoneOptional as never)
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
          hasMore ? (
            <View style={[{ height: rs(40) }, globalStyles.activityCenter]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : undefined
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default VirtualInterComOptional;
