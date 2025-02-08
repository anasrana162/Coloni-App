import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {Trans, useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {bookingsStates, userStates} from '../../state/allSelector.state';
import {useFocusEffect, useIsFocused, useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/booking/booking.slice';
import {showAlertWithTwoActions} from '../../utilities/helper';
import bookingService from '../../services/features/booking/booking.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {userRoles} from '../../assets/ts/core.data';
import Badge from '../../components/app/Badge.app';
import {Picker} from '@react-native-picker/picker';
import DownArrow from '../..//assets/images/svg/downArrow.svg';
import Pagination from '../../components/core/Pagination.core.component';
import moment from 'moment';
import SelectMonth from '../../components/app/SelectMonth.app';
import {colors} from '../../assets/global-styles/color.assets';
const Bookings = () => {
  // const [selectedValue, setSelectedValue] = useState("RESERVE MONTH");
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const [selectedMonth, setSelectedMonth] = useState(''); // Default month
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const {colors} = useTheme() as any;
  // const months = [
  //   'January', 'February', 'March', 'April',
  //   'May', 'June', 'July', 'August',
  //   'September', 'October', 'November', 'December'
  // ];
  const months = [
    {name: 'January', number: 1},
    {name: 'February', number: 2},
    {name: 'March', number: 3},
    {name: 'April', number: 4},
    {name: 'May', number: 5},
    {name: 'June', number: 6},
    {name: 'July', number: 7},
    {name: 'August', number: 8},
    {name: 'September', number: 9},
    {name: 'October', number: 10},
    {name: 'November', number: 11},
    {name: 'December', number: 12},
  ];
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    results,
    totalPages,
    status,
    totalAmount,
  } = customUseSelector(bookingsStates);
  console.log('checking list...ddddd.');
  const [total, setTotal] = useState();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [itemCount, setItemCount] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    perPage: 12,
    search: '',
    status:
      userInfo?.role === userRoles.VIGILANT ||
      userInfo?.role === userRoles.RESIDENT
        ? 'Paid'
        : 'X-Approved',
    period: moment(new Date()).format('YYYY-MM-DD'),
  });

  const dispatch = customUseDispatch();

  const isFocused = useIsFocused();

  const handleMonthSelect = month => {
    setSelectedMonth(month);
    const newDate = new Date(selectedDate);
    newDate.setMonth(month?.number - 1);
    console.log('Updated Date:', newDate);
    dispatch(
      isGettingAction({
        ...params,
        period: moment(newDate).format('YYYY-MM-DD'),
      }),
    );
    setDropdownOpen(false);
  };
  const getDataHandler = async () => {
    const result = await bookingService.list(params);
    setTotal(result?.body?.total);
    return result;
  };

  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };

  const handleSearch = (text: string) => {
    setParams({...params, search: text});
    dispatch(searchingAction({...params, search: text}));
  };

  const handleTabChange = val => {
    setParams({
      ...params,
      status: val,
      period: moment(selectedDate).format('YYYY-MM-DD'),
    });
    setSelectedMonth('');
    dispatch(
      isGettingAction({
        ...params,
        status: val,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }),
    );
  };

  useEffect(() => {
    getDataHandler();
    if (isFocused) {
      dispatch(isGettingAction(params));
    }
  }, [isFocused]);
  useEffect(() => {
    setItemCount(results);
  }, [list]);
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await bookingService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this booking?'),
      onPressAction: confirm,
    });
  };

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    setParams({...params, period: moment(newDate).format('YYYY-MM-DD')});
    dispatch(
      searchingAction({
        ...params,
        period: moment(newDate).format('YYYY-MM-DD'),
      }),
    );
  };

  const onNext = () => {
    setParams({...params, page: params.page + 1});
    dispatch(isGettingAction({...params, page: params.page + 1}));
  };

  const onBack = () => {
    setParams({...params, page: params.page - 1});
    dispatch(isGettingAction({...params, page: params.page - 1}));
  };

  const calculateTimeDifference = (startHour: number, endHour: number) => {
    if (endHour < startHour) {
      endHour += 24;
    }

    const difference = endHour - startHour;
    return difference;
  };

  const renderItem = useCallback(
    ({item, index}: {item: any; index: number}) => {
      const timeDifference = calculateTimeDifference(
        item?.bookingStart,
        item?.bookingEnd,
      );
      console.log('item:', item);
      return (
        <TouchableOpacity
          disabled={userInfo?.role === userRoles.VIGILANT}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(screens.ReservationDate as never, {
              edit: true,
              index,
              id: item?._id,
              item: item,
            })
          }
          style={[
            globalStyles.rowBetween,
            {
              borderBottomWidth: 1,
              borderBottomColor: colors.gray5,
              width: '90%',
              alignSelf: 'center',
            },
          ]}>
          <View style={stylesBooking.ListContainer}>
            {userInfo?.role === userRoles.RESIDENT && (
              <Text
                style={{...stylesBooking.ListContentText, color: colors.gray1}}>
                📆 {moment(item?.bookingDate).format('DD/MM/YYYY')}
              </Text>
            )}
            {userInfo?.role === userRoles.RESIDENT ? (
              <Text
                style={{...stylesBooking.ListContentText, color: colors.gray1}}>
                🙋‍♂️ {item?.amenity?.amenityName}
              </Text>
            ) : (
              <Text style={{...typographies(colors).ralewayBold12}}>
                {item?.name}
              </Text>
            )}
            <Text style={{...typographies(colors).ralewayBold12}}>
              {item?.hour}
            </Text>
            <Text
              style={{
                ...stylesBooking.ListContentText,
                ...typographies(colors).ralewayMedium12,
              }}>
              {item?.resident?.street?.name} {item?.resident?.home}
            </Text>
            <Text
              style={{
                ...stylesBooking.ListContentText,
                ...typographies(colors).ralewayMedium12,
              }}>
              {item?.note}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  ...stylesBooking.ListContentText,
                  ...typographies(colors).ralewayMedium12,
                }}>
                {trans('Start time: ')}
                {item?.bookingStart}
              </Text>
              <Text
                style={{
                  ...stylesBooking.ListContentText,
                  ...typographies(colors).ralewayMedium12,
                }}>
                {trans('End time: ')}
                {item?.bookingEnd}
              </Text>
            </View>
            {userInfo?.role === userRoles.RESIDENT && (
              <Text
                style={{...stylesBooking.ListContentText, color: colors.gray1}}>
                👨‍👦‍👦 {item?.guests}
              </Text>
            )}
            {userInfo?.role === userRoles.RESIDENT && (
              <Text
                style={{...stylesBooking.ListContentText, color: colors.gray1}}>
                ${item?.amount}
              </Text>
            )}
          </View>
          {userInfo?.role === userRoles.RESIDENT ? (
            <View style={stylesBooking.ActiveContainer}>
              <Text style={stylesBooking.ActiveText}>{item?.status}</Text>
            </View>
          ) : (
            <Text
              style={{...stylesBooking.ListContentText, color: colors.gray1}}>
              ${item?.amount}
            </Text>
          )}
        </TouchableOpacity>
      );
    },
    [colors, trans, navigation],
  );
  //const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={
          userInfo?.role === userRoles.VIGILANT
            ? trans('Paid Reservations')
            : userInfo?.role === userRoles.RESIDENT
            ? trans('Reservations')
            : trans('Bookings')
        }
        rightIcon={
          userInfo?.role !== userRoles.VIGILANT && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          navigation.navigate(screens.AmenityReservation as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={list}
        onScroll={() => setDropdownOpen(false)}
        renderItem={renderItem}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: colors.white,
              width: '90%',
              alignSelf: 'center',
            }}>
            {userInfo?.role !== userRoles.VIGILANT &&
              userInfo?.role !== userRoles.RESIDENT && (
                <View
                  style={[
                    globalStyles.flexRow,
                    {gap: rs(6), ...customPadding(10, 10, 10, 10)},
                  ]}>
                  <Badge
                    text={trans('X-Approved')}
                    onPress={() => {
                      handleTabChange('X-Approved');
                      setDropdownOpen(false);
                    }}
                    bgColor={
                      params.status === 'X-Approved'
                        ? colors.tertiary
                        : colors.gray5
                    }
                    textColor={
                      params.status === 'X-Approved'
                        ? colors.white
                        : colors.gray7
                    }
                    classes="small"
                    style={{
                      flexGrow: 1 / 3,
                      width: `${'32%'}`,
                      borderRadius: rs(10),
                    }}
                  />
                  <Badge
                    text={trans('Approved')}
                    onPress={() => {
                      handleTabChange('Approved');
                      setDropdownOpen(false);
                    }}
                    bgColor={
                      params.status === 'Approved'
                        ? colors.tertiary
                        : colors.gray5
                    }
                    textColor={
                      params.status === 'Approved' ? colors.white : colors.gray7
                    }
                    classes="small"
                    style={{
                      flexGrow: 1 / 3,
                      width: `${'32%'}`,
                      borderRadius: rs(10),
                    }}
                  />

                  <Badge
                    text={trans('Paid')}
                    onPress={() => {
                      handleTabChange('Paid');
                      setDropdownOpen(false);
                    }}
                    bgColor={
                      params.status === 'Paid' ? colors.tertiary : colors.gray5
                    }
                    textColor={
                      params.status === 'Paid' ? colors.white : colors.gray7
                    }
                    style={{
                      flexGrow: 1 / 3,
                      width: `${'32%'}`,
                      borderRadius: rs(10),
                    }}
                    classes="small"
                  />
                </View>
              )}
            <View
              style={{
                ...stylesBooking.container,
                borderBottomColor: colors.gray5,
              }}>
              <View>
                {/* <ShowDate
                  style={{ ...customMargin(2, 2, 2, 2) }}
                  onPress={handleMonthChange}
                  defaultValue={selectedDate || new Date()}
                /> */}
                <SelectMonth
                  style={{...customMargin(10)}}
                  defaultValue={selectedDate || new Date()}
                  // name="period"
                  onPress={handleMonthChange}
                />
              </View>
              <View>
                {userInfo?.role === 'Vigilant' ||
                userInfo?.role === userRoles.RESIDENT ? null : (
                  <Text
                    style={{
                      ...typographies(colors).ralewayMedium14,
                      color: colors.primary,
                    }}>
                    $ {totalAmount} ({list && list.length})
                  </Text>
                )}
                {(userInfo?.role === userRoles.VIGILANT ||
                  userInfo?.role === userRoles.RESIDENT) && (
                  <Text
                    style={{
                      ...typographies(colors).ralewayBold15,
                      color: colors.primary,
                    }}>
                    {trans('Total')}: {itemCount}
                  </Text>
                )}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{...customPadding(20, 0, 10, 0), gap: rs(5)}}
        ListFooterComponent={
          <>
            {!isLoading && totalPages > 1 && (
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
const stylesBooking = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    //backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B0C4DE',
    ...customMargin(0, 10, 10, 20),
    width: 106,
    elevation: 2,
    zIndex: 1,
    top: 40,
  },

  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    //color: colors.tertiary,
  },
  ActiveContainer: {
    backgroundColor: colors.brightGreen,
    width: 100,
    height: 24,
    // ...customPadding(2, 2, 2, 2),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  ActiveText: {
    ...typographies(colors).ralewayBold10,
    color: colors.white,
  },
  topContainer: {
    ...customMargin(10, 0, 10, 0),
    ...customPadding(6, 6, 6, 20),
    //backgroundColor: colors.tertiary,
  },
  topText: {
    //...typographies(colors).ralewayMedium10,
    //color: colors.tertiary,
    ...customPadding(2, 0, 2, 6),
  },
  amenityText: {
    ...globalStyles.flexRow,
    height: 20,
    width: 106,

    borderRadius: 5,
    gap: 10,
  },
  ListContainer: {
    ...customPadding(2, 10, 10, 10),
    borderRadius: 12,
    flex: 1,
  },
  ListContentText: {
    ...customPadding(0, 26, 0, 0),
  },
  container: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
    ...customMargin(2, 10, 8, 10),
    ...customPadding(2, 2, 8, 2),
    borderBottomWidth: 1,
  },
});

export default Bookings;
