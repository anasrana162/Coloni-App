import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTranslation} from 'react-i18next';
import {
  gettingMoreAction,
  refreshingAction,
  isGettingAction,
  searchingAction,
} from '../../state/features/visits/visits.slice';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates, visitsStates} from '../../state/allSelector.state';
import {useCustomNavigation} from '../../packages/navigation.package';
import ShowDate from '../../components/app/ShowDate.app';
import Badge from '../../components/app/Badge.app';
import useFrequentVisit from '../frequent-visits/hooks/useFrequentVisit.hook';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {debounceHandler, formatDate} from '../../utilities/helper';
import DownArrow from '../..//assets/images/svg/downArrow.svg';
import {userRoles} from '../../assets/ts/core.data';
import {screens} from '../../routes/routeName.route';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import ConfirmationModalVisitLog from './ConfirmationModalVisitLog';
import moment from 'moment';
import {nanoid} from '@reduxjs/toolkit';
import Pagination from '../../components/core/Pagination.core.component';
import eventualVisitsService from '../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import {config} from '../../../Config';
import SelectMonth from '../../components/app/SelectMonth.app';
import {showMessage} from 'react-native-flash-message';
interface RadioButtonProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View style={styles.radioGroup}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionContainer,
            selectedValue === option && styles.selectedOptionContainer,
          ]}
          onPress={() => onSelect(option)}>
          <View style={styles.radioCircleContainer}>
            <View
              style={[
                styles.radioCircle,
                {
                  borderColor:
                    selectedValue === option ? colors.white : colors.primary,
                },
              ]}>
              {selectedValue === option && (
                <View
                  style={[
                    styles.radioInnerCircle,
                    {backgroundColor: colors.white},
                  ]}
                />
              )}
            </View>
          </View>
          <Text
            style={[
              styles.optionText,
              {
                color: selectedValue === option ? colors.white : colors.primary,
              },
            ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const VisitLog = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const isFocused = useIsFocused();
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('Date');
  const [status, setStatus] = useState('Records');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    period: moment(new Date()).format('YYYY-MM-DD'),
    search: '',
    status: 'entrance',
    type: 'records',
    dateType: 'month',
  });
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [list, setlist] = useState(null);
  const formattedDate = moment(selectedDate).format('DD-MM-YYYY');
  const getParaText = () => {
    if (status === 'Records') {
      return trans(
        `Download the Visitor Registry of the private day ${formattedDate}`,
      );
    } else {
      return trans(`Download the Alerts Logs of the day ${formattedDate}`);
    }
  };
  //code for dowloading data in excel starts from here
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestStoragePermission();
    }
    if (isFocused) {
      fetchLogs(params);
    }
  }, [isFocused, params.type]);

  const fetchLogs = async (params: any) => {
    setLoading(true);

    if (userInfo?.role == userRoles?.RESIDENT) {
      params = {...params, resident: userInfo?._id};
    }
    let logs = await eventualVisitsService.list(params);
    var {
      data: {list, page, perPage, results, total, totalPages, totalCount},
      success,
    } = logs;
    console.log('logs Fetched:', userInfo?._id, '  Token: ', config.token);
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

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      console.log('checking granted....', granted);
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
        : showMessage({message: 'File started downloading....'});
    }
    try {
      await eventualVisitsService.downloadFile(params, trans);
    } catch (error: any) {
      console.error('Error writing file:', error.message);
      Alert.alert(
        'Error',
        `Failed to download the Excel file: ${error.message}`,
        [{text: trans('OK')}],
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounceHandler((val: string) => {
    console.log('Working search');
    fetchLogs({...params, search: val});
  }, 200);

  const handleChange = (name: string, value: any) => {
    console.log('Name: ', name, ' value: ', value);
    if (name == 'type' && value == 'records') {
      setParams((prev: any) => ({
        ...prev,
        [name]: value,
        dateType: '',
        status: 'entrance',
      }));
      fetchLogs({
        ...params,
        [name]: value,
        dateType: '',
        status: 'entrance',
      });
    } else if (name == 'type' && value == 'alerts') {
      setParams((prev: any) => ({
        ...prev,
        [name]: value,
        status: '',
        dateType: 'Date',
      }));
      fetchLogs({
        ...params,
        [name]: value,
        status: '',
        dateType: 'Date',
      });
    } else {
      setParams((prev: any) => ({...prev, [name]: value}));
      console.log('Params', params);
      fetchLogs({...params, [name]: value});
    }

    // fetchLogs({ ...params, [name]: value });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs(params);
  };

  const onNextPage = () => {
    if (params.page >= paginationInfo?.totalPages) {
      return;
    }
    setParams({
      ...params,
      page: params?.page + 1,
    });
    fetchLogs({
      ...params,
      page: params?.page + 1,
    });
  };

  const onPrevPage = () => {
    if (params?.page <= 1) {
      return;
    }
    setParams({
      ...params,
      page: params?.page - 1,
    });
    fetchLogs({
      ...params,
      page: params?.page - 1,
    });
  };
  console.log(' skdm', params?.type);
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {note, visitorName, authorizes} = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.VisitLogDetails as never, {
                //edit: true,
                index,
                id: item?._id,
                item: item,
              })
            : undefined
        }
        style={[
          {
            backgroundColor: colors.gray6,
            borderRadius: 12,
            width: '90%',
            alignSelf: 'center',
          },
          globalStyles.rowBetween,
        ]}>
        <View style={styles.ListContainer}>
          <Text style={styles.ListContentTextInBlue}>
            🏠{item?.resident?.street?.name} {item?.resident?.home}
          </Text>
          <Text style={styles.ListContentText}>🙋‍♂️{visitorName} </Text>
          <Text style={styles.ListContentText}>
            {trans('Authorize: ') + authorizes}{' '}
          </Text>
          {params?.type === 'records' && (
            <>
              <Text style={styles.ListContentText}>
                {trans('Max Work : ') + item?.marWork}{' '}
              </Text>
              <Text style={styles.ListContentText}>
                {trans('Entry Note: ')} {note}{' '}
              </Text>
              <Text style={styles.ListContentText}>{trans('Exit Note: ')}</Text>
              <Text style={styles.ListContentText}>
                {trans('Added Date: ✏️')}
                {formatDate(item?.createdAt, 'YYYY-MM-DD')}{' '}
                {moment(item?.createdAt).format('LT')}
              </Text>
              <Text style={styles.ListContentText}>
                <Text style={{color: 'green'}}>→</Text>
                {moment(item?.updatedAt).format('LT')}
              </Text>
            </>
          )}
        </View>
        <View
          style={{
            transform: [{rotate: '-90deg'}],
            ...customMargin(2, 10, 2, 10),
          }}>
          <DownArrow />
        </View>
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container>
      <Header text={trans('Visit Log')} />
      {showModal && (
        <ConfirmationModalVisitLog
          title={trans('Discharge')}
          para={getParaText()}
          button1Text={trans('Confirm')}
          button2Text={trans('Cancel')}
          onButton1Press={() => {
            setShowModal(false);
            generateAndDownloadExcel();
          }}
          onButton2Press={() => setShowModal(false)}
          onDismiss={() => setShowModal(false)}
        />
      )}
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
              //defaultValue={search}
              onChangeText={txt => handleSearch(txt)}
              style={{...customMargin(10, 20, 10, 20)}}
            />
            <View style={{backgroundColor: colors.white}}>
              {userInfo?.role !== userRoles?.RESIDENT && (
                <View style={{...customPadding(10, 6, 10, 6)}}>
                  <View
                    style={[
                      globalStyles.flexRow,
                      {...customMargin(0, 10, 0, 10)},
                    ]}>
                    <Badge
                      text={trans('Records')}
                      bgColor={
                        params?.type === 'records'
                          ? colors.tertiary
                          : colors.gray5
                      }
                      textColor={
                        params?.type === 'records' ? colors.white : colors.gray7
                      }
                      onPress={() => handleChange('type', 'records')}
                      style={{flexGrow: 1 / 2, width: `${'48.5%'}`}}
                    />
                    <Badge
                      text={trans('Alerts')}
                      bgColor={
                        params?.type === 'alerts'
                          ? colors.tertiary
                          : colors.gray5
                      }
                      textColor={
                        params?.type === 'alerts' ? colors.white : colors.gray7
                      }
                      onPress={() => handleChange('type', 'alerts')}
                      style={{flexGrow: 1 / 2, width: `${'48.5%'}`}}
                    />
                  </View>
                </View>
              )}
              <View style={styles.container}>
                <View>
                  <SelectMonth
                    style={{paddingLeft: rs(9)}}
                    defaultValue={selectedDate}
                    name="period"
                    onPress={date => {
                      setSelectedDate(date);
                      handleChange('period', moment(date).format('YYYY-MM-DD'));
                    }}
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
              {userInfo?.role !== userRoles?.RESIDENT && (
                <>
                  {params?.type === 'records' && (
                    <View style={styles.textInRow}>
                      <View style={styles.textInRow}>
                        <TouchableOpacity
                          onPress={() => handleChange('status', 'entrance')}>
                          <View
                            style={[
                              styles.box1,
                              {
                                backgroundColor:
                                  params?.status == 'entrance'
                                    ? colors.primary
                                    : colors.white,
                                borderColor:
                                  params?.status == 'entrance'
                                    ? colors.black
                                    : colors.gray1,
                              },
                            ]}></View>
                        </TouchableOpacity>
                        <Text
                          style={[styles.headerText, {color: colors.black}]}>
                          {trans('Entries')}
                        </Text>
                      </View>
                      <View style={styles.textInRow}>
                        <TouchableOpacity
                          onPress={() => handleChange('status', 'exit')}>
                          <View
                            style={[
                              styles.box2,
                              {
                                backgroundColor:
                                  params?.status == 'exit'
                                    ? colors.primary
                                    : colors.white,
                                borderColor:
                                  params?.status == 'exit'
                                    ? colors.black
                                    : colors.gray1,
                              },
                            ]}></View>
                        </TouchableOpacity>
                        <Text
                          style={[styles.headerText, {color: colors.black}]}>
                          {trans('Departures')}
                        </Text>
                      </View>
                    </View>
                  )}
                  <TouchableOpacity
                    style={{
                      width: 150,
                      height: 40,
                      marginVertical: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      marginLeft: 20,
                    }}
                    onPress={() => setShowModal(true)}>
                    <Text style={styles.generateFiletext}>
                      {trans('Generate File')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <>
            {loading ? (
              <ActivityIndicator size={'large'} color={colors.primary} />
            ) : (
              <EmptyContent text={trans('There is no data!')} />
            )}
          </>
        }
        contentContainerStyle={{...customPadding(20, 0, 10, 0), gap: rs(5)}}
        ListFooterComponent={
          <>
            {!loading && paginationInfo?.totalPages > 1 && (
              <Pagination
                PageNo={params?.page}
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

const styles = StyleSheet.create({
  container: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
    ...customMargin(2, 20, 10, 2),
  },
  ListContainer: {
    ...customPadding(10, 10, 10, 10),
    flex: 1,
  },
  ListContentText: {
    ...typographies(colors).ralewayMedium12,
    ...customPadding(0, 26, 0, 0),
  },
  ListContentTextInBlue: {
    ...typographies(colors).ralewayBold15,
    color: colors.primary,
    ...customPadding(0, 26, 0, 0),
  },
  generateFiletext: {
    ...typographies(colors).ralewayMedium14,
    color: colors.white,
    // ...customMargin(10, 20, 2, 20),
  },
  headerText: {
    ...typographies(colors).ralewayMedium14,
    color: colors.primary,
    ...customPadding(2, 20, 2, 2),
  },
  textInRow: {
    ...globalStyles.flexRow,
    ...customPadding(0, 10, 2, 10),
  },
  box1: {
    height: 15,
    width: 18,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: colors.gray1,
  },
  box2: {
    height: 15,
    width: 18,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: colors.gray1,
  },
  containeForRadio: {
    backgroundColor: colors.tertiary,
  },
  radioGroup: {
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.tertiary,
    paddingHorizontal: 20,
  },
  optionContainer: {
    ...globalStyles.flexRow,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  selectedOptionContainer: {
    backgroundColor: colors.tertiary,
  },
  radioCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    ...typographies(colors).ralewayMedium10,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default VisitLog;
