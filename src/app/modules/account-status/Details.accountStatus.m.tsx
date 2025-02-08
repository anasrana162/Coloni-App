import {
  View,
  ScrollView,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import Badge from '../../components/app/Badge.app';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import GraphicsDetails from './components/GraphicsDetails.accountStatus';
import ListDetails from './components/ListDetails.accountStatus';
import Button from '../../components/core/button/Button.core';
import AccountStatusBottomSheet from './bottomSheet/AccountStatus.bottomSheet';
import {screens} from '../../routes/routeName.route';
import {useCustomNavigation} from '../../packages/navigation.package';
import {
  deleteAction,
  updateAction,
} from '../../state/features/accountStatus/accountStatus.slice';
import accountStatusService from '../../services/features/accountStatus/accountStatus.service';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import imageLink from '../../assets/images/imageLink';
import {
  checkEmptyValues,
  formatDate,
  showAlertWithOneAction,
} from '../../utilities/helper';
import RNFS from 'react-native-fs';
// import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {nanoid} from '@reduxjs/toolkit';
import MonthYearInput from '../debtors-report/components/Month&yearInputField';
import {apiResponse} from '../../services/features/api.interface';
import {showMessage} from 'react-native-flash-message';
import {getLocalData} from '../../packages/asyncStorage/storageHandle';
import {accountStatusEndPoint} from '../../services/features/endpoint.api';
import {colors} from '../../assets/global-styles/color.assets';
import {userStates} from '../../state/allSelector.state';
import {userRoles} from '../../assets/ts/core.data';
import moment from 'moment';
const DetailsAccountStatus: React.FC<{
  route: {params: {index: number; item: any; status: string}};
}> = ({
  route: {
    params: {item, index, status},
  },
}) => {
  const itemsID = item?._id;
  console.log('checking data', item);
  const [show, setShow] = useState<boolean>(false);
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState({
    period: '',
    type: 'inactive',
    initialBalance: '',
    uploadFiles: [],
    uploadFilesName: '',
  });
  const dispatch = customUseDispatch();
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const [loading, setLoading] = useState(false);
  console.log('checking items', item);
  const mediaUrl = item?.resident?.images?.[0] || imageLink.placeholder;
  const calculateProfitLoss = (item: any) => {
    const profitLoss = item?.finalBalance - item?.initialBalance;
    return profitLoss;
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestStoragePermission();
    }
  }, []);
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
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const fetchDataAndDownloadCSV = async (id: any) => {
    setLoading(true);
    const token = await getLocalData.getApiToken();
    try {
      const url = `${accountStatusEndPoint.dischargeFileList}?accountStatusId=${id}`;
      const headers = {
        'Content-Type': 'text/csv',
        Authorization: `${token}`,
        Accept: 'text/csv',
      };
      const response = await fetch(url, {method: 'GET', headers});
      console.log(
        `Status: ${response.status}, Status Text: ${response.statusText}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
      }
      const responseText = await response.text();
      console.log('Raw Response Text:', responseText);
      const path =
        Platform.OS == 'ios'
          ? `${RNFS.DocumentDirectoryPath}/AccountStatus${nanoid()}.csv`
          : `${RNFS.DownloadDirectoryPath}/AccountStatus.csv`;
      if (responseText.trim() === '') {
        throw new Error('No data received from API');
      }
      await RNFS.writeFile(path, responseText, 'utf8');
      console.log('path', path);
      Alert.alert(trans('Success'), `trans('CSV file has been saved to') ${path}`);
      {
        Platform.OS === 'android'
          ? ToastAndroid.show('File saved successfully!', ToastAndroid.SHORT)
          : showMessage({
              message: 'File saved successfully!',
              duration: 2000,
            });
      }
    } catch (error) {
      Alert.alert(
        trans('Error'),
        trans('Failed to download or save the CSV file'),
      );
    }
  };
  const printDetails = async () => {
    //the
    const printContent = `
        <html>
        <style>
          .container {
            padding: 20px 15px;
            text-align: center;
            margin-top: 20px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            font-family: Arial, sans-serif;
          }
    
          .image-preview {
            width: 120px;
            height: 120px;
            border-radius: 60px;
            border: 5px solid white;
            margin-bottom: 15px;
          }
    
          .summary-text {
            color: ${colors.gray7};
            margin: 10px;
            font-size: 22px;
            font-weight: 600;
          }
    
          .text-white {
            color: ${colors.black};
            margin-top: 10px;
            font-weight: bold;
            font-size: 24px;
          }
    
          .row {
            display: flex;
            justify-content: space-between;
            width: 95%;
            margin-top: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            font-size: 20px;
          }
    
          .box {
            display: flex;
            justify-content: space-between;
            background-color: white;
            padding: 10px 15px;
            border-radius: 10px;
            width: 100%;
            margin-top: 20px;
            font-size: 20px;
          }
    
          .profit-loss-row {
            display: flex;
            justify-content: space-between;
            width: 95%;
            margin-top: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid white;
            font-size: 20px;
            font-weight: bold;
          }
    
          .rotate-arrow {
            transform: rotate(-90deg);
          }
    
          .flex-row {
            display: flex;
            gap: 6px;
            align-items: center;
          }
    
          .amount {
            font-size: 20px;
            font-weight: bold;
          }
        </style>
        </head>
        <body>
          <div class="container">
            <img src="${mediaUrl}" class="image-preview" />
            <div class="text-white">${formatDate(
              item?.period,
              'MMM YYYY',
            )}</div>
            <div class="summary-text">SUMMARY OF MOVEMENTS</div>
    
            <div class="row">
              <div>Initial Balance</div>
              <div class="amount">$${item?.initialBalance}</div>
            </div>
    
            <div class="row">
              <div>Income</div>
              <div class="amount"></div>
            </div>
    
            <div class="row">
              <div>Share</div>
              <div class="flex-row">
                <div class="amount">$36,000</div>
                <div class="rotate-arrow">▼</div>
              </div>
            </div>
    
            <div class="row">
              <div>Total Income</div>
              <div class="amount">$${item?.totalIncome}</div>
            </div>
    
            <div class="row">
              <div>Bills</div>
              <div class="amount"></div>
            </div>
    
            <div class="row">
              <div>Total Spends</div>
              <div class="amount">$${item?.totalExpense}</div>
            </div>
    
            <div class="profit-loss-row">
              <div>Final Balance</div>
              <div class="amount">$${item?.finalBalance}</div>
            </div>
    
            <div class="profit-loss-row">
              <div>Profit / Loss</div>
              <div class="amount">$${calculateProfitLoss(item)}</div>
            </div>
          </div>
        </body>
        </html>
      `;
    const customDirectory =
      Platform.OS == 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.DownloadDirectoryPath;
    const dirExists = await RNFS.exists(customDirectory);
    if (!dirExists) {
      await RNFS.mkdir(customDirectory); // Create the directory
    }

    const results: any = await RNHTMLtoPDF.convert({
      html: printContent,
      fileName: `AccountStatus-${moment(new Date()).format('DD-MMM-YYYY')}`,
      base64: false,
      directory: 'Downloads',
    });

    console.log('results after print:', results);

    Alert.alert(trans('Success'), trans('PDF downloaded successfully!'));
  };
  const id = item?._id;
  useLayoutEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const result = await accountStatusService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking body', body);
        if (status) {
          const isAsset = body?.type === 'asset';
          const periodDate = body?.period || '';
          setData({
            period: periodDate,
            type: isAsset ? 'asset' : 'inactive',
            initialBalance: body?.initialBalance ?? 0,
            uploadFiles: body?.uploadFiles || [],
            uploadFilesName: body?.uploadFilesName || '',
          });
        } else {
          navigation.goBack();
          showMessage({message});
        }
      } catch (error) {
        console.error('Fetching details failed:', error);
        showMessage({message: 'Error fetching details'});
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);
  const handleDataChange = (fieldName: string, value: any) => {
    if (fieldName === 'asset') {
      setData(prevData => ({
        ...prevData,
        type: value ? 'asset' : 'inactive',
        [fieldName]: value,
      }));
    } else {
      setData(prevData => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
  };
  const updateAccountStatus = async () => {
    const payload = {...data};
    payload.type = data.type === 'asset' ? 'asset' : 'inactive';
    console.log('Final payload:', payload);
    const emptyFields = [];
    if (!payload.period) emptyFields.push(trans('Period'));
    if (payload.initialBalance === null || payload.initialBalance === '')
      emptyFields.push(trans('Initial Balance'));
    if (!payload.uploadFiles || payload.uploadFiles.length === 0)
      emptyFields.push(trans('Upload Files'));
    if (emptyFields.length > 0) {
      showAlertWithOneAction({
        title: trans('Invalid'),
        body: `${trans(
          'Please fill up the following fields correctly',
        )}: ${emptyFields.join(', ')}`,
      });
      return;
    }

    try {
      const result = await accountStatusService.update({...payload}, item?._id);
      const {status, body, message} = result as apiResponse;
      if (status) {
        dispatch(updateAction({item: body, index, id: item?._id}));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Account Status'),
          body: message,
        });
      }
    } catch (error) {
      console.error('Update failed:', error);
      showAlertWithOneAction({
        title: trans('Error'),
        body: trans('Something went wrong'),
      });
    }
  };

  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  return (
    <Container>
      <Header
        text={!isAdmin ? trans('Account Statement') : trans('Account Status')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
        <MonthYearInput
          label={trans('Period')}
          name="period"
          disabled={!isAdmin}
          defaultValue={data?.period}
          onChange={value => handleDataChange('period', value)}
        />
        <LabelInput
          label={trans('Initial Balance')}
          inputProps={{inputMode: 'numeric'}}
          defaultValue={data.initialBalance}
          editable={isAdmin}
          onChangeText={value => handleDataChange('initialBalance', value)}
        />
        <ActiveOrDisActive
          label={trans('Asset')}
          style={{marginBottom: rs(15)}}
          defaultValue={data?.type === 'asset'}
          disabled={!isAdmin}
          name="asset"
          onChange={value => handleDataChange('asset', value)}
        />

        <View style={globalStyles.flexRow}>
          <Badge
            text={trans('Report')}
            style={{width: `${'49%'}`}}
            onPress={() => setShow(false)}
            bgColor={!show ? colors.tertiary : colors.gray5}
            textColor={!show ? colors.white : colors.gray7}
          />
          <Badge
            text={trans('Graphics')}
            style={{width: `${'49%'}`}}
            onPress={() => setShow(true)}
            bgColor={show ? colors.tertiary : colors.gray5}
            textColor={show ? colors.white : colors.gray7}
          />
        </View>
        {show ? (
          <GraphicsDetails
            index={index}
            item={item}
            isAdmin={isAdmin}
            status={status}
            onDataChange={payload => {
              handleDataChange('uploadFiles', payload.uploadFiles);
              handleDataChange('uploadFilesName', payload.uploadFilesName);
            }}
          />
        ) : (
          <ListDetails
            onDataChange={payload => {
              handleDataChange('uploadFiles', payload.uploadFiles);
              handleDataChange('uploadFilesName', payload.uploadFilesName);
            }}
            isAdmin={isAdmin}
            index={index}
            item={item}
            status={status}
          />
        )}
        <View style={[globalStyles.flexRow, {marginTop: rs(15)}]}>
          <Button
            text={trans('Discharge')}
            style={{width: '49%'}}
            bgColor={colors.secondary}
            textColor={colors.white}
            onPress={() =>
              global.showBottomSheet({
                flag: true,
                component: AccountStatusBottomSheet,
                componentProps: {
                  title: trans('Discharge'),
                  body: trans('Download the movement?'),
                  onPress: async () => {
                    try {
                      await fetchDataAndDownloadCSV(id);
                    } catch (error) {
                      console.error('Error generating CSV:', error);
                    }
                  },
                },
              })
            }
          />

          <Button
            onPress={printDetails}
            text={trans('Print')}
            style={{width: `${'49%'}`}}
            bgColor={colors.secondary}
            textColor={colors.white}
          />
        </View>
        {isAdmin && (
          <Button
            text={trans('Update Income/Expenses')}
            style={{marginTop: rs(7)}}
            onPress={() =>
              global.showBottomSheet({
                flag: true,
                component: AccountStatusBottomSheet,
                componentProps: {
                  title: trans('Account status'),
                  body: trans(
                    'Update Account Statement to the latest movements of the period?',
                  ),

                  onPress: () => updateAccountStatus(),
                },
              })
            }
          />
        )}

        {isAdmin && (
          <Button
            text={trans('Eliminate')}
            style={{marginTop: rs(7)}}
            textColor={colors.white}
            bgColor={colors.eliminateBtn}
            onPress={() =>
              global.showBottomSheet({
                flag: true,
                component: AccountStatusBottomSheet,
                componentProps: {
                  title: trans('Account status'),
                  body: trans('Delete the Account Statement?'),
                  onPress: () => {
                    dispatch(deleteAction({index, id: item?._id}));
                    navigation.goBack();
                    accountStatusService.delete(item?._id);
                    console.log('id deleted successfully,', item?._id);
                  },
                },
              })
            }
          />
        )}
      </ScrollView>
    </Container>
  );
};

export default DetailsAccountStatus;
