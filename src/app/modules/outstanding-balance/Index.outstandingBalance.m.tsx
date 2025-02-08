import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ClickableText from '../../components/core/ClickableText.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {useTranslation} from 'react-i18next';
import ApproveBottomSheet from '../bills/bottomSheet/Approve.bottomSheet';
import ExcelIcon from '../../assets/images/svg/excelIcon.svg';
import NotificationIcon from '../../assets/images/svg/notificationIcon.svg';
import IconCircle from '../../components/app/IconCircle.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useFocusEffect, useIsFocused, useTheme} from '@react-navigation/native';
import Badge from '../../components/app/Badge.app';
import BalanceItem from './components/BalanceItem.ob';
import NotifyBottomSheet from './bottomSheet/Notify.bottomSheet';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import outstandingBalancesService from '../../services/features/outstandingBalances/outstandingBalances.service';
import {colors} from '../../assets/global-styles/color.assets';
import Pagination from '../../components/core/Pagination.core.component';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {config} from '../../../Config';

const IndexOutstandingBalance = () => {
  const {t: trans} = useTranslation();
  const isFocused = useIsFocused();
  const [show, setShow] = useState(false);
  const {userInfo} = customUseSelector(userStates);
  const navigation = useCustomNavigation();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [blockingFlow, setBlockingFlow] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');

  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
  });
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
  });
  useEffect(() => {
    if (Platform.OS === 'android') {
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Reset state when the screen loses focus
      return () => {
        setShow(false);
        setBlockingFlow(false);
      };
    }, []),
  );
  useEffect(() => {
    if (isFocused) {
      setSearch('');
      setFilteredData([]);
      fetchOutstandingBalances(params);
    }
  }, [isFocused]);
  const fetchOutstandingBalances = async (params: any) => {
    try {
      let balances = await outstandingBalancesService.list(params, true);
      var {
        data: {result, totalAmount, totalPages, perPage, currentPage},
        success,
      } = balances;
      if (success) {
        console.log('Data', balances);
        setList(result);
        setTotal(totalAmount);
        setPaginationInfo({
          totalPages: totalPages,
        });
      } else {
        Alert.alert(
          trans('Error'),
          trans('Unable to fetch Outstanding balance'),
        );
      }
    } catch (error) {
      Alert.alert(trans('Error'), trans('Unable to fetch Outstanding balance'));
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      if (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Storage permissions granted');
      } else {
        Alert.alert('Permission Denied', 'Storage permission is required.');
        // requestStoragePermission();
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const generateAndDownloadExcel = async () => {
    setLoading(true);
    try {
      let downloadFile = await outstandingBalancesService.downloadFile();
      if (downloadFile == 'error') {
        Alert.alert(trans('Error'), `trans('Failed to download the file')`, [
          {text: trans('OK')},
        ]);
      } else {
        Alert.alert('File Saved', `File has been saved to ${downloadFile}`);
      }
    } catch (error: any) {
      console.error('Error writing file:', error.message);
      Alert.alert(
        trans('Error'),
        `trans('Failed to download the file'): ${error.message}`,
        [{text: trans('OK')}],
      );
    } finally {
      setLoading(false);
    }
  };
  const filterData = (data: any) => {
    setSearch(data);
    const query = data.toLowerCase();
    const result = list.filter((item: any) => {
      return (
        item.home.toLowerCase().includes(query) ||
        item?.resident?.street?.name.toLowerCase().includes(query) ||
        item.pendingCharges.toString().includes(query) ||
        item.totalPendingExpireAmount.toString().includes(query)
      );
    });
    console.log('result', result);
    setFilteredData(result);
  };
  const onNextPage = () => {
    console.log('paginationInfo?.totalPages', paginationInfo?.totalPages);
    if (params.page >= paginationInfo.totalPages) {
      return;
    }
    console.log('Reaching here');
    setParams({
      ...params,
      page: params.page + 1,
    });
    fetchOutstandingBalances({
      ...params,
      page: params.page + 1,
    });
  };
  const onPrevPage = () => {
    if (params.page <= 1) {
      return;
    }
    setParams({
      ...params,
      page: params.page - 1,
    });
    fetchOutstandingBalances({
      ...params,
      page: params.page - 1,
    });
  };
  const handleMessageChange = async (txt: string) => {
    console.log('Token', config.token);
    console.log('Message changed', txt);
    if (list) {
      var notifications = list.map(item => {
        var {resident_id, resident, totalPendingExpireAmount} = item;
        const body = txt
          .replace(/\${resident}/g, resident)
          .replace(/\${totalPendingExpireAmount}/g, totalPendingExpireAmount);
        return {
          title: 'Outstanding Balance',
          body: body,
          colony: userInfo?.colony,
          resident: resident_id,
          sender: userInfo?._id,
        };
      });

      let payload: any = {
        notifications,
      };
      if (payload?.notifications) {
        let notify = await outstandingBalancesService.notifyRes(payload);
        console.log('Notify', notify);
        var {status, body, message} = notify;
        if (status) {
          Alert.alert(trans('Success'), trans('Notified Successfully'));
        } else {
          Alert.alert('Error!', 'Something went Wrong');
        }
      }
    }
  };

  return (
    <Container bottomTab={false}>
      <Header text={trans('Outstanding Balance')} leftIcon={false} />
      <ScrollView
        contentContainerStyle={{...customPadding(20, 20, 0, 20)}}
        showsVerticalScrollIndicator={false}>
        {show && (
          <View
            style={[
              globalStyles.rowBetween,
              {marginTop: rs(-20), marginBottom: rs(10)},
            ]}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <IconCircle
                icon={<ExcelIcon />}
                onPress={generateAndDownloadExcel}
                style={{width: rs(40), height: rs(40)}}
                shadow={false}
                bgColor={colors.gray5}
              />
            )}
            <IconCircle
              icon={<NotificationIcon />}
              onPress={() =>
                global.showBottomSheet({
                  flag: true,
                  component: NotifyBottomSheet,
                  componentProps: {
                    onTextChange: handleMessageChange,
                  },
                })
              }
              style={{width: rs(40), height: rs(40)}}
              shadow={false}
              bgColor={colors.gray5}
            />
          </View>
        )}
        <SearchInput
          onChangeText={txt => filterData(txt)}
          defaultValue={search}
        />
        <View
          style={[globalStyles.rowBetween, {...customPadding(10, 10, 0, 10)}]}>
          <ClickableText
            text={trans('Calculate Balance')}
            onPress={() =>
              !show &&
              global.showBottomSheet({
                flag: true,
                component: ApproveBottomSheet,
                componentProps: {
                  title: trans('Paid'),
                  body: trans(
                    'Perform the calculation of outstanding balances for Residents? All payment history will be reviewed.',
                  ),
                  onPress: () => setShow(true),
                },
              })
            }
          />

          <Text
            style={[
              typographies(colors).montserratNormal12,
              {color: colors.primary},
            ]}>
            ${total}
          </Text>
        </View>

        {show ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                // alignSelf: 'center',
                justifyContent: blockingFlow ? 'space-between' : 'flex-start',
                alignItems: 'center',
              }}>
              <Badge
                text={trans('Update Restriction')}
                style={{
                  alignSelf: 'flex-start',
                  borderRadius: rs(10),
                  marginTop: rs(12),
                }}
                onPress={
                  () => setBlockingFlow(true)
                  // navigation.navigate(screens.blockingOfDefaulters as never)
                }
                textColor={colors.dark}
              />
              {blockingFlow && (
                <Badge
                  text={trans('Cancel')}
                  style={{
                    alignSelf: 'flex-start',
                    borderRadius: rs(10),
                    marginTop: rs(12),
                  }}
                  onPress={
                    () => setBlockingFlow(false)
                    // navigation.navigate(screens.blockingOfDefaulters as never)
                  }
                  textColor={colors.dark}
                />
              )}
            </View>
            {blockingFlow && (
              <Text
                style={{
                  ...typographies(colors).montserratMedium13,
                  color: colors.primary,
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                {trans('Select a resident before restricting!')}
              </Text>
            )}
            <View style={{marginTop: rs(17)}} />
            <FlatList
              data={filteredData.length == 0 ? list : filteredData}
              scrollEnabled={false}
              ListFooterComponent={
                <>
                  {!loading && paginationInfo?.totalPages > 1 && (
                    <Pagination
                      PageNo={params.page}
                      onNext={() => onNextPage()}
                      onBack={() => onPrevPage()}
                    />
                  )}
                </>
              }
              renderItem={({item, index}) => {
                return (
                  <BalanceItem
                    item={item}
                    index={index}
                    blockingFlow={blockingFlow}
                    setBlockingFlow={(val: boolean) => setBlockingFlow(val)}
                  />
                );
              }}
            />
          </>
        ) : (
          <EmptyContent
            text={trans(
              'Tap on calculate balances if data exists it will be shown',
            )}
          />
        )}
      </ScrollView>
    </Container>
  );
};

export default IndexOutstandingBalance;
