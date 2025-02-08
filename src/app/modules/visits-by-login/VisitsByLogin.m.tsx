import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  View,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {useTranslation} from 'react-i18next';
import {
  debounceHandler,
  formatDate,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import visitsService from '../../services/features/visits/visits.service';
import {
  gettingMoreAction,
  refreshingAction,
  deleteAction,
  isGettingAction,
  searchingAction,
} from '../../state/features/visits/visits.slice';
import {useFocusEffect, useIsFocused, useTheme} from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates, visitsStates} from '../../state/allSelector.state';
import {useCustomNavigation} from '../../packages/navigation.package';
import {userRoles} from '../../assets/ts/core.data';
import {screens} from '../../routes/routeName.route';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import ShowDate from '../../components/app/ShowDate.app';
import {colors} from '../../assets/global-styles/color.assets';
import Button from '../../components/core/button/Button.core';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {nanoid} from '@reduxjs/toolkit';
import Pagination from '../../components/core/Pagination.core.component';
import moment from 'moment';
import eventualVisitsService from '../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import {config} from '../../../Config';
import SelectMonth from '../../components/app/SelectMonth.app';
import FlashMessage, {showMessage} from 'react-native-flash-message';
const VisitsByLogin = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
    period: moment().month(moment().month()).date(1).format('YYYY-MM-DD'),
    // dateType: 'month',
  });
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {colors} = useTheme() as any;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [list, setlist] = useState(null);

  const fetchVisits = async (params: any) => {
    let data = await eventualVisitsService.list(params);
    var {
      data: {list, page, perPage, results, total, totalPages, totalCount},
      success,
    } = data;
    console.log('Data', data);
    if (success) {
      setPaginationInfo({
        page,
        perPage,
        results,
        total,
        totalPages,
        totalCount,
      });
      setlist(list);
      setLoading(false);
      setRefreshing(false);
      return;
    } else {
      Alert.alert(trans('Error'), trans('Unable to fetch logs!'));
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    //  moment(newDate).format('YYYY-MM-DD')
    setParams({
      ...params,
      period: moment(newDate)
        .month(moment(newDate).month())
        .date(1)
        .format('YYYY-MM-DD'),
    });
    fetchVisits({
      ...params,
      period: moment(newDate)
        .month(moment(newDate).month())
        .date(1)
        .format('YYYY-MM-DD'),
    });
  };

  const onRefresh = () => {
    fetchVisits({...params, search: ''});
  };

  const handleSearch = debounceHandler((text: string) => {
    setParams({...params, search: text});
    fetchVisits({...params, search: text});
  });
  useEffect(() => {
    if (isFocused) {
      fetchVisits(params);
      // Reset search parameter when the screen is focused
      setParams(prevParams => ({
        ...prevParams,
        search: '',
      }));
    }
  }, [isFocused]);

  //code for dowloading data in excel starts from here
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
      } else {
        //Alert.alert('Permission ', 'Storage permission is required.');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const generateAndDownloadExcel = async () => {
    setLoading(true);
    {
      Platform.OS === 'android'
        ? ToastAndroid.show('File started downloading....', ToastAndroid.SHORT)
        : showMessage({
            message: 'File started downloading....',
            duration: 2000,
          });
    }
    try {
      const formattedData = list.map((item: any) => ({
        Home: item?.resident?.home,
        VisitType: item?.visitType,
        Name: item?.name,
        Note: item?.note,
        AdmissionTime: formatDate(item?.createdAt, 'DD/MM/YYYY, HH:MM'),
      }));
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(formattedData);
      XLSX.utils.book_append_sheet(wb, ws, 'Visits');
      const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'base64'});
      const path =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/VisitByLogin-${nanoid()}.xlsx`
          : `${RNFS.DocumentDirectoryPath}/VisitByLogin-${nanoid()}.xlsx`;

      await RNFS.writeFile(path, wbout, 'base64');
      {
        Platform.OS === 'android'
          ? ToastAndroid.show('File saved successfully!', ToastAndroid.SHORT)
          : showMessage({
              message: 'File saved successfully!',
              duration: 2000,
            });
      }
      Alert.alert(
        'Success',
        `Excel file downloaded successfully! at path ${path}`,
        [{text: trans('OK')}],
      );
    } catch (error: any) {
      console.error('Error writing file:', error.message);
      Alert.alert(
        'Error',
        `Failed to download the Excel file: ${error.message}`,
        [{text: trans('OK')}],
      );
      {
        Platform.OS === 'android'
          ? ToastAndroid.show('Error in file download!', ToastAndroid.SHORT)
          : showMessage({
              message: 'Error in file download!',
              duration: 2000,
            });
      }
    } finally {
      setLoading(false);
    }
  };
  //code for dowloading data in excel ends here

  //pagination code
  const onNext = () => {
    if (params.page < paginationInfo?.totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      fetchVisits({...params, page: newPage});
    }
  };
  //pagination code
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      fetchVisits({...params, page: newPage});
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.addVisits as never, {
                edit: true,
                index,
                id: item?._id,
              })
            : undefined
        }
        style={[globalStyles.rowBetween]}>
        <View style={styles.ListContainer}>
          <Text style={styles.ListContentText}>
            🏠{item?.resident?.street?.name} {item?.resident?.home}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Visitor Name')} 🙋🏻‍♂️ {item?.visitorName}{' '}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Authorizes')}: {item?.authorizes}{' '}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Max Work')}: {item?.marWork}{' '}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Note')}: {item?.note}{' '}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Expected admission time')}: ✏️{' '}
            {formatDate(item?.createdAt, 'YYYY-MM-DD HH:MM:SS')}{' '}
          </Text>
          <Text style={styles.ListContentText}>📱 {item?.resident?.clue} </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Visit By Login')}
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) &&
          navigation.navigate(screens.ResidentVisitByLogin as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={params?.search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
            <View style={styles.container}>
              <View>
                <SelectMonth
                  style={{...customMargin(10)}}
                  defaultValue={selectedDate}
                  name="period"
                  onPress={handleMonthChange}
                />
              </View>
              <View>
                <Text
                  style={{
                    ...typographies(colors).ralewayBold15,
                    color: colors.primaryText,
                  }}>
                  {trans('Total')}: {paginationInfo?.totalCount}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: 150,
                height: 40,
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.primary,
                borderRadius: 10,
              }}
              onPress={generateAndDownloadExcel}>
              <Text style={styles.generateFiletext}>
                {loading ? trans('Loading...') : trans('Generate File')}
              </Text>
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
    ...customMargin(2, 2, 10, 2),
  },
  ListContainer: {
    ...customPadding(10, 10, 10, 10),
    //marginHorizontal: 12,
    backgroundColor: colors.gray,
    borderRadius: 12,
    flex: 1,
    //color:colors.primary
  },
  generateFiletext: {
    ...typographies(colors).ralewayMedium14,
    color: colors.white,
    // ...customMargin(10, 20, 2, 20),
  },
  ListContentText: {
    ...typographies(colors).ralewayMedium12,
    ...customPadding(0, 26, 0, 0),
    // paddingHorizontal:16,
  },
});

export default VisitsByLogin;
