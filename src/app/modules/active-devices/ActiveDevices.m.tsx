import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customMargin,
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {getLocalData} from '../../packages/asyncStorage/storageHandle';
import {useTranslation} from 'react-i18next';
import ActiveDevicesService from '../../services/features/ActiveDevices/ActiveDevices.Service';
import {FlatList} from 'react-native-gesture-handler';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import {
  ActiveDevicesSates,
  themeStates,
  userStates,
} from '../../state/allSelector.state';
import {
  deleteAction,
  gettingMoreAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/ActiveDevices/ActiveDevice.slice';
import {useFocusEffect, useIsFocused, useTheme} from '@react-navigation/native';
import DevicesIcon from '../../assets/images/svg/devicesIcon.svg';
import {formatDate} from '../../utilities/helper';
import CalenderIcon from '../../assets/icons/Calender.icon';
import Button from '../../components/core/button/Button.core';
import CustomSwitch from '../../components/core/CustomSwitch.core.component';
import {useCustomNavigation} from '../../packages/navigation.package';
import userService from '../../services/features/users/user.service';
import Pagination from '../../components/core/Pagination.core.component';
import {userRoles} from '../../assets/ts/core.data';
const ActiveDevices = () => {
  const {
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    totalPages,
    isGetting,
    search,
  } = customUseSelector(ActiveDevicesSates);
  const navigation = useCustomNavigation<any>();
  const {theme} = customUseSelector(themeStates);
  const {colors} = useTheme() as any;
  const isFocused = useIsFocused();
  const {userInfo} = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  const {t: trans} = useTranslation();
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useState({
    page: 1,
    perPage: 5,
    search: '',
  });

  const getDataHandler = async (params: any) => {
    const result = await ActiveDevicesService.list(params, true);
    var {
      data: {existingDevice, page, perPage, totalPages},
      success,
    } = result;
    if (success) {
      if (
        userInfo?.role == userRoles.ADMIN ||
        userInfo?.role == userRoles?.SUPER_ADMIN
      ) {
        setDeviceData(existingDevice || []);
        setPaginationInfo({
          page,
          perPage,
          totalPages,
        });
      } else {
        let devices: any[] | boolean =
          Array.isArray(existingDevice) &&
          existingDevice.filter((item: any) => item?.user == userInfo?._id);
        console.log('devices of res', devices);
        setDeviceData(devices ? devices : []);
        setPaginationInfo({
          page,
          perPage,
          totalPages,
        });
      }
      setLoading(false);
    } else {
      Alert.alert(trans('Error'), trans('Unable fetch devices!'));
      setLoading(false);
    }
  };

  const onRefresh = () => {
    dispatch(refreshingAction({...params, search: ''}));
    console.log('on refresh triggered');
  };

  const onNext = () => {
    if (params.page < paginationInfo?.totalPages) {
      const nextPage = params.page + 1;
      setParams({...params, page: nextPage});
      getDataHandler({...params, page: nextPage});
    }
  };

  const onBack = () => {
    if (params.page > 1) {
      const prevPage = params.page - 1;
      setParams({...params, page: prevPage});
      getDataHandler({...params, page: prevPage});
    }
  };

  const handleSearch = (text: string) => {
    setLoading(true);
    setParams({...params, search: text?.trim()});
    getDataHandler({...params, search: text?.trim()});
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      getDataHandler({...params, search: ''});
    }
  }, [isFocused]);

  const handleSubmit = async (bool: boolean, name: string, item: any) => {
    try {
      let result = await userService.patchNotifications(
        {status: bool},
        item?._id,
      );
      console.log('updated resident for blocking defaulters', result);
      if (result.status) {
        Alert.alert(trans('Success'), trans('Updated Successfuly'));
      } else {
        Alert.alert(trans('Error'), `${result.message}`);
      }
    } catch (error) {
      Alert.alert(trans('Error'), trans('Unable to update'));
    }
  };

  const renderDeviceItem = ({item}: {item: any}) => {
    return (
      <View
        style={[
          styles.eachItemContainer,
          {
            ...shadow(colors).shadow,
            backgroundColor: theme === 'dark' ? 'white' : colors.graySoft,
          },
        ]}>
        <View>
          <View style={styles.eachItemLeftContainer}>
            <DevicesIcon />
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.active, lineHeight: rs(20)},
              ]}>
              {item?.deviceId || trans('Unknown Device')}
            </Text>
          </View>
          <View style={styles.eachItemRightContainer}>
            <CalenderIcon fill={theme === 'dark' ? colors.primary : ''} />
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {
                  lineHeight: rs(20),
                  color: 'black',
                },
              ]}>
              {formatDate(item?.lastLogin, 'DD/MM/YYYY MM:SS') ||
                trans('Unknown Date')}
            </Text>
          </View>
          {userInfo?.role !== userRoles.VIGILANT && (
            <View style={styles.eachItemRightContainer}>
              <CustomSwitch
                value={item?.active}
                onPress={(val: boolean, name: string) =>
                  handleSubmit(val, name, item)
                }
                name="notification"
              />
              <Text
                style={[
                  customMargin(2, 2, 2, 2),
                  typographies(colors).ralewayMedium12,
                  {lineHeight: rs(20)},
                ]}>
                {trans('Notifications')}
              </Text>
            </View>
          )}
        </View>
        {(userInfo?.role == userRoles.ADMIN ||
          userInfo?.role == userRoles?.SUPER_ADMIN ||
          userInfo?.role == userRoles.VIGILANT) && (
          <TouchableOpacity
            style={[
              {...customPadding(8, 8, 8, 8)},
              {
                position: 'absolute',
                right: 15,
                bottom: 25,
              },
            ]}
            onPress={() => {
              if (item?._id) {
                dispatch(deleteAction({id: item._id}));
                ActiveDevicesService.delete(item._id);
              }
            }}>
            <DeleteIcon height={rs(16)} width={rs(16)} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Container>
      <Header text={trans('Devices')} />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={deviceData}
        renderItem={renderDeviceItem}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={loading}
          />
        }
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
        ListFooterComponent={
          <>
            {!loading && paginationInfo?.totalPages > 1 && (
              <Pagination
                PageNo={params.page}
                onNext={() => onNext()}
                onBack={() => onBack()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};
export const styles = StyleSheet.create({
  eachItemContainer: {
    ...globalStyles.flexRow,
    //...shadow(colors).shadow,
    ...customPadding(20, 12, 11, 20),
    // backgroundColor: colors.graySoft,
    borderRadius: rs(25),
    gap: rs(18),
    marginBottom: rs(15),
    justifyContent: 'space-between',
  },
  eachItemLeftContainer: {
    flexGrow: 1 / 2,
    flexDirection: 'row',
    gap: rs(8),
    alignItems: 'center',
  },
  eachItemRightContainer: {
    flexGrow: 1 / 2,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: rs(8),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default ActiveDevices;
