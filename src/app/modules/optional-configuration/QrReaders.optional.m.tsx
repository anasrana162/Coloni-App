import React, { useEffect, useMemo, useState, } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import { QrReaderStates } from '../../state/allSelector.state';
import { Trans, useTranslation } from 'react-i18next';
import { gettingMoreAction, isGettingAction, refreshingAction, searchingAction } from '../../state/features/QrReader/QrReaderSlice';
import { TouchableOpacity } from 'react-native';
import { customPadding, globalStyles } from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { colors } from '../../assets/global-styles/color.assets';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import Pagination from '../../components/core/Pagination.core.component';
import {themeStates} from '../../state/allSelector.state';


const QrReadersOptional = () => {
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
    totalPages,

  } = customUseSelector(QrReaderStates);
  const {theme} = customUseSelector(themeStates);
  
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
    const {types,model,name,_id } = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addQRReadersOptional, {
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
           {types}
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
        text={trans("QR Reader")}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addQRReadersOptional as never)
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

export default QrReadersOptional;
