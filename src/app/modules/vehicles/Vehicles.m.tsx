import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import useVehicles from './hooks/useVehicles.hook';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { useTranslation } from 'react-i18next';
import VehicleItem from '../../components/app/VehicleItem.app';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import { userStates, vehiclesStates } from '../../state/allSelector.state';
import Pagination from '../../components/core/Pagination.core.component';
import { useIsFocused } from '@react-navigation/native';

const Vehicles = () => {
  const navigation = useCustomNavigation();
  const [key, setKey] = useState(0);
  const { userInfo } = customUseSelector(userStates);
  const { colors } = useTheme() as any;
  const { t: trans } = useTranslation();
  const isFocused = useIsFocused();

  const {
    handleSearch,
    hasMore,
    isLoading,
    list,
    onRefresh,
    onDelete,
    refreshing,
    results,
    search,
    page,
    perPage,
    totalPages,
    total,
    onNextPage,
    onPrevPage,
    isGetting,
  } = useVehicles();

  
  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
  }, [isFocused]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return <VehicleItem item={item} index={index} onDelete={onDelete} />;
  };
  console.log("List Vehicles", results)
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Vehicles')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addUpdateVehicles as never)
        }
      />
      <FlatList
        data={list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View style={{ backgroundColor: colors.white }}>
            <View style={{ ...customPadding(10, 20, 10, 20) }}>
              <SearchInput defaultValue={search} onChangeText={handleSearch} />
            </View>
            <View style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "center",
              borderBottomWidth: 2,
              borderBottomColor: colors.primary,
              // ...customMargin(22),
              ...customPadding(0, 0, 8),
              marginVertical:10

            }}>

              <Text
                style={[typographies(colors).ralewayBold18]}>
                {trans('Total')}
              </Text>
              <Text
                style={[typographies(colors).ralewayBold18]}>
                {results}
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={
          list?.length > 0 ? { paddingBottom: rs(20) } : globalStyles.emptyFlexBox
        }
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There is no data to display')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
        ListFooterComponent={
          <>
            {!isLoading && totalPages > 1 && (
              <Pagination
                PageNo={`${page}`}
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

export default Vehicles;
