import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { screens } from '../../routes/routeName.route';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { billItemStyles } from '../../components/app/BillItem.app';
import { userRoles } from '../../assets/ts/core.data';
import useExpenseTemplate from './hooks/useExpenseTemplate.hook';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { calculateCash, formatDate } from '../../utilities/helper';
import SearchInput from '../../components/app/SearchInput.app';
import SelectMonth from '../../components/app/SelectMonth.app';
const ExpenseTemplate: React.FC = () => {
  const {
    isLoading,
    list,
    loadMore,
    hasMore,
    onRefresh,
    refreshing,
    userInfo,
    colors,
    navigation,
    trans,
    search,
    handleSearch,
  } = useExpenseTemplate();
  const styles = billItemStyles(colors);
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const onPress = () => {
      navigation.navigate(screens.addUpdateExpenseTemplate as never, {
        index,
        id: item?._id,
        edit: true,
      });
    };
    console.log("Item expese template: ", item)
    return (
      <TouchableOpacity
        style={[styles.container, { justifyContent: 'space-between' }]}
        activeOpacity={0.7}
        onPress={onPress}>
        <View>
          <Text
            style={typographies(colors).ralewaySemibold14}
            numberOfLines={1}>
            {item?.expenseType}
          </Text>
          <Text style={typographies(colors).ralewayMedium12} numberOfLines={1}>
            {item?.note}
          </Text>
        </View>
        <Text style={typographies(colors).ralewayMedium12}>
          {calculateCash(item?.amount)}
        </Text>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Expense Template')}
        rightIcon={
          userInfo?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          userInfo?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN)
            ? navigation.navigate(screens.addUpdateExpenseTemplate as never)
            : undefined
        }
      />
      <FlatList
        data={list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={{ backgroundColor: colors.white }}>
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              style={{ marginBottom: rs(10) }}
            />
          </View>
        }
        contentContainerStyle={
          list?.length > 0
            ? {
              ...customPadding(17, 20, 20, 20),
              gap: rs(10),
            }
            : [globalStyles.emptyFlexBox, { ...customPadding(17, 20, 20, 20) }]
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no template found!')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
        ListFooterComponent={
          hasMore ? (
            <View style={[{ height: rs(40) }, globalStyles.activityCenter]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : undefined
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore ? loadMore : undefined}
      />
    </Container>
  );
};

export default ExpenseTemplate;
