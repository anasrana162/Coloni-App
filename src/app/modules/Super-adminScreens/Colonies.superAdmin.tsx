import { View, ScrollView, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { screens } from '../../routes/routeName.route';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { userRoles } from '../../assets/ts/core.data';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { useTranslation } from 'react-i18next';
import { useCustomNavigation } from '../../packages/navigation.package';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { debounceHandler } from '../../utilities/helper';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import { ColonySuperAdmin, userStates } from '../../state/allSelector.state';

import AdministratorIcon from '../../assets/images/svg/adminstratorIcon.svg';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { gettingMoreAction, refreshingAction, searchingAction } from '../../state/features/SuperAdmin/SuperAdminSlice';
import { colors } from '../../assets/global-styles/color.assets';
import colonySuperAdminServices from '../../services/features/SuperAdminColony/colonySuperAdmin.services';
import { storeUserData } from '../../state/features/auth/authSlice';
import { storeLocalData } from '../../packages/asyncStorage/storageHandle';
import { config } from '../../../Config';
interface props {
  item: any;
  index: number;
  userInfo: any;
  status: string;
}
const ColoniessuperAdmin: React.FC<props> = ({ index, item, status }) => {

  const { t: trans } = useTranslation();
  const { userInfo } = customUseSelector(userStates);
  const navigation = useCustomNavigation<any>();
  const { colors } = useTheme() as any;
  const dispatch = customUseDispatch();

  const [colonies, setColonies] = useState<any>(null)
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    date,
  } = customUseSelector(ColonySuperAdmin);
  console.log("checking list...", list);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );
  const loadMore = () => {
    hasMore && dispatch(gettingMoreAction({ page, perPage, search }));
  };

  const handleSearch = (status: string) => {
    dispatch(searchingAction({ status }));
  }

  const onRefresh = () => {
    dispatch(refreshingAction({ search }));
  };

  useEffect(() => {
    fetchColonies()
  }, [])

  const fetchColonies = async () => {
    var fetchColonies = await colonySuperAdminServices.list(null)
    setColonies(fetchColonies?.body?.list)
    // var { body: { list } } = fetchColonies as apiResponse
    console.log("fetchColonies", fetchColonies?.body)
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const onPress = async () => {
      try {
        const response = await colonySuperAdminServices.getAcessColony(item?._id);
        console.log('API Response Super admin:', response);
        var { body } = response
        dispatch(storeUserData(body.user));
        storeLocalData.loggedInFlag(true);
        // check && storeLocalData.userCredential(loginData);
        storeLocalData.apiToken(body?.token);
        config.token = body?.token;
        config.role = body?.user?.role;
        global.changeState(screens.home);

        navigation.navigate(screens.dashboard as never, {
        });
      } catch (error) {
        console.error('Error fetching colony access:', error);
      }
    };
    const onViewPress = () => {
      navigation.navigate(screens.AddUpdateColoniesSuperAdmin as never, {
        index,
        id: item?._id,
        edit: true,
        item: item,
      });
    };
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            globalStyles.flexRow,
          ]}
          onPress={onPress}
        >
          <View
            style={[
              globalStyles.justifyAlignCenter,
              shadow(colors).shadow,
              {
                height: rs(40),
                width: rs(40),
                borderRadius: rs(40),
                backgroundColor: colors.primary,
              },
            ]}
          >
            <AdministratorIcon />
          </View>
          <View style={[globalStyles.rowBetween, globalStyles.flexGrow1]}>
            <View style={globalStyles.flexGrow1}>
              <Text
                style={[
                  typographies(colors).ralewayBold12,
                  { color: colors.primary },
                ]}
              >
                {item?.name}
              </Text>
              <Text
                style={[
                  typographies(colors).montserratNormal8,
                  { color: colors.gray9, lineHeight: rs(17) },
                ]}
              >
                {item?.AdminId?.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewButton,
          ]}
          onPress={onViewPress}
        >
          <Text
            style={[
              typographies(colors).ralewayBold12,
              { color: colors.gray9 },
            ]}
          >
            {trans("View")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };



  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container bottomTab={false}>
      <Header
        text={trans("Colonies")}
        rightIcon={
          // userInfo?.role === userRoles.SUPER_ADMIN ? (
          <ImagePreview source={imageLink.addIcon} />
          // ) : undefined
        }
        rightControl={() =>
          navigation.navigate(screens.AddUpdateColoniesSuperAdmin as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        initialNumToRender={2}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        data={colonies}
        ListHeaderComponent={
          <View style={{ backgroundColor: colors.white }}>
            <SearchInput onChangeText={handleSearch} defaultValue={search} />
            <View
              style={[
                { ...customPadding(14, 5, 18, 5), gap: rs(4) },
              ]}
            />
          </View>
        }
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListEmptyComponent={
          <EmptyContent text={trans('There are no data!')} forLoading={isLoading} />
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
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    ...customPadding(20, 12, 11, 20),
    backgroundColor: colors.graySoft,
    borderRadius: rs(25),
    gap: rs(18),
    marginBottom: rs(15),
    // alignItems: 'center',
    flexGrow: 1,

  },
  viewButton: {
    marginLeft: 'auto',
    padding: rs(10),
    backgroundColor: colors.graySoft,
    borderRadius: rs(25),
  },
});
export default ColoniessuperAdmin;
