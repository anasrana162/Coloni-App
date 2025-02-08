import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import SearchInput from '../../components/app/SearchInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { useTranslation } from 'react-i18next';
import { showAlertWithTwoActions } from '../../utilities/helper';
import visitsService from '../../services/features/visits/visits.service';
import {
  gettingMoreAction,
  refreshingAction,
  deleteAction,
  isGettingAction,
  searchingAction,
} from '../../state/features/visits/visits.slice';
import { useTheme } from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {
  userResidentsStates,
  userStates,
  visitsStates,
} from '../../state/allSelector.state';
import { useCustomNavigation } from '../../packages/navigation.package';
import { userRoles } from '../../assets/ts/core.data';
import { screens } from '../../routes/routeName.route';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import { colors } from '../../assets/global-styles/color.assets';
import userService from '../../services/features/users/user.service';
import { apiResponse } from '../../services/features/api.interface';
import { residents } from '../../state/features/user/user.slice';

const VisitsByLoginList = () => {
  const { t: trans } = useTranslation();
  const navigation = useCustomNavigation<any>();
  const { userInfo } = customUseSelector(userStates);
  // const {
  //   list,
  //   isLoading,
  //   refreshing,
  //   hasMore,
  //   page,
  //   perPage,
  //   isGetting,
  //   search,
  // } = customUseSelector(visitsStates);
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
  } = customUseSelector(userResidentsStates);
  const [Data, setData] = useState();
  const [showList, setShowList] = useState(false);
  const [key, setKey] = useState(0);
  const getDataHandler = async () => {
    var params = {
      page: 1,
      perPage: 10,
      search: "",
      asset: true,
      isAdmin: "",
    }
    const result = await userService.ResidentScreen(params);
    const { body, status } = result as apiResponse;
    console.log("body", body)
    setData(body?.list);
    // if (status) {
    //   dispatch(residents(body))
    // };
  };
  const dispatch = customUseDispatch();
  const { colors } = useTheme() as any;
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
  useEffect(() => {
    setKey(key + 1);
  }, [showList]);
  const loadMore = () => {
    hasMore && dispatch(gettingMoreAction({ page, perPage, search }));
  };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({ index, id }));
        await visitsService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this visit?'),
      onPressAction: confirm,
    });
  };
  useEffect(() => {
    getDataHandler();
  }, []);
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    console.log('item', item);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.addVisits as never, {
              // edit: true,
              // index,
              id: item?._id,
              name: `${item?.street.name} ${item?.home}`,
            })
            : undefined
        }
        style={[
          globalStyles.rowBetween,
          {
            borderBottomColor: colors.gray5,
            borderBottomWidth: rs(1),
            paddingBottom: rs(5),
          },
        ]}>
        <View>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              {
                ...customPadding(2, 2, 2, 12),
                color: colors.primary,
              },
            ]}>
            {item?.street?.name} {item?.home}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header text={trans('Select Resident')} />
      <View style={{ backgroundColor: colors.white }}>
        <TouchableOpacity
          onPress={() => setShowList(!showList)}
          style={styles.container}>
          <Text style={styles.textContainer}>{trans('Select a resident')}</Text>
        </TouchableOpacity>
      </View>
      {showList && (
        <FlatList
          keyboardShouldPersistTaps="always"
          stickyHeaderIndices={[0]}
          initialNumToRender={2}
          key={key}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={Data}
          renderItem={memoizedValue}
          keyboardDismissMode="on-drag"
          keyExtractor={(_item, index) => index.toString()}
          ListEmptyComponent={
            <EmptyContent
              text={trans('There are no data!')}
              forLoading={isLoading}
            />
          }
          contentContainerStyle={{ ...customPadding(20, 10, 10, 10), gap: rs(5) }}
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
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 24,
    width: 135,
    borderRadius: 10,
    backgroundColor: colors.tertiary,
    ...globalStyles.justifyAlignCenter,
    ...customMargin(10, 2, 4, 6),
  },
  textContainer: {
    ...typographies(colors).ralewayMedium12,
    color: colors.white,
  },
});
export default VisitsByLoginList;
