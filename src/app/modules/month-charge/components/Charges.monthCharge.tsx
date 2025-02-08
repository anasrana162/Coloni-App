import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../../layouts/Container.layout';
import Header from '../../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../../assets/global-styles/global.style.asset';
import AdministratorIcon from '../../../assets/images/svg/adminstratorIcon.svg';
import SearchInput from '../../../components/app/SearchInput.app';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {
  monthChargesStates,
  userResidentsStates,
  userStates,
} from '../../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
} from '../../../state/features/monthCharges/monthCharges.slice';
import {userRoles} from '../../../assets/ts/core.data';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {debounceHandler} from '../../../utilities/helper';
import EmptyContent from '../../../components/core/EmptyContent.core.component';
import {screens} from '../../../routes/routeName.route';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {residents} from '../../../state/features/user/user.slice';
import {apiResponse} from '../../../services/features/api.interface';
import userService from '../../../services/features/users/user.service';

interface Props {
  index: number;
  item: any;
  userInfo: any;
  status: string;
}

const ChargesmonthCharge: React.FC<Props> = () => {
  const {t: trans} = useTranslation();
  // const {
  //   list,
  //   isLoading,
  //   refreshing,
  //   hasMore,
  //   isGetting,
  //   search,
  //   status: stateStatus,
  // } = customUseSelector(monthChargesStates);
  // const {
  //   list,
  //   isLoading,
  //   refreshing,
  //   hasMore,
  //   page,
  //   perPage,
  //   isGetting,
  //   search,
  //   status,
  // } = customUseSelector(userResidentsStates);

  // const {userInfo: globalUserInfo} = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const styles = billItemStyles(colors);
  const navigation = useCustomNavigation<any>();

  const [list, setList] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    perPage: 100,
    search: '',
    asset: true,
  });

  const onRefresh = () => {
    getDataHandler(params);
  };

  const getDataHandler = async (params: any) => {
    const result = await userService.ResidentList(params);
    const {body, status} = result as apiResponse;
    if (status) {
      setList(body?.list);
    }
  };

  const handleSearch = (status: string) => {
    setParams({...params, search: status});
  };

  useEffect(() => {
    getDataHandler(params);
  }, []);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate(screens.addUpdateMonthCharge, {
            index,
            id: item?._id,
            status: '',
            item,
          })
        }>
        <View
          style={[
            globalStyles.justifyAlignCenter,
            shadow(colors).shadow,
            {
              height: rs(30),
              width: rs(30),
              borderRadius: rs(40),
              backgroundColor: colors.primary,
            },
          ]}>
          <AdministratorIcon />
        </View>
        <View>
          <Text style={typographies(colors).montserratMedium10}>
            {item?.street?.name} {item?.home}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container>
      <Header text={trans('Charges')} />

      <FlatList
        keyboardShouldPersistTaps="always"
        initialNumToRender={2}
        // refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        // onRefresh={onRefresh}
        data={list}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              onChangeText={handleSearch}
              defaultValue={params.search}
            />
            <View style={[{...customPadding(14, 5, 18, 5), gap: rs(4)}]}></View>
            <Text style={styles.textContainer}>
              {trans('Select a Resident')}
            </Text>
          </View>
        }
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListEmptyComponent={<EmptyContent text={trans('There are no data!')} />}
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
      />
    </Container>
  );
};

export default ChargesmonthCharge;

export const billItemStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.primary,
      flexDirection: 'row',
      ...customPadding(10, 16, 6, 12),

      alignItems: 'center',
      borderRadius: 15,
      gap: 19,
      marginVertical: 5,
    },
    textContainer: {
      color: '#9E9E9E',
      ...customPadding(0, 10, 2, 4),
    },
  });
