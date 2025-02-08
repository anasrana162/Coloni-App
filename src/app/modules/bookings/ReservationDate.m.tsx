import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
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
import {useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
  updateAction,
} from '../../state/features/booking/booking.slice';
import {
  checkEmptyValues,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import bookingService from '../../services/features/booking/booking.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {userRoles} from '../../assets/ts/core.data';
import Badge from '../../components/app/Badge.app';
import {colors} from '../../assets/global-styles/color.assets';
import {Picker} from '@react-native-picker/picker';
import Reservation from 'react-native-calendars/src/agenda/reservation-list/reservation';
import LabelInput from '../../components/app/LabelInput.app';
import {Calendar} from 'react-native-calendars';
import {apiResponse} from '../../services/features/api.interface';
import {showMessage} from 'react-native-flash-message';
import {addAction} from '../../state/features/booking/booking.slice';
import moment from 'moment';
import CustomSelect from '../../components/app/CustomSelect.app';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const ReservationDate: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string; item: any}};
}> = ({
  route: {params: {edit, index, id, item} = {edit: false, index: -1, id: ''}},
}) => {
  const [selectedValue, setSelectedValue] = useState('RESERVE MONTH');
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const [fetching, setFetching] = useState(false);
  const [loadings, setLoading] = useState(false);
  console.log('checkinng if im getting amenity id...', item);
  // const {
  //     list,
  //     isLoading,
  //     refreshing,
  //     hasMore,
  //     page,
  //     perPage,
  //     isGetting,
  //     search,
  //     status,
  // } = customUseSelector(bookingsStates);
  // "note":"abc",
  // "guests":3,
  // "bookingEnd":"30",
  // "bookingStart":"12",
  // "hour":"hour 6",
  // "bookingDate":"2024-02-12",
  // "amenityId":"66d9490dbfe8fcaace7a53f6",
  // "status":"Paid",
  // "resident":"66e812edacebd0b19779987b",
  // "amount":20
  const values = useRef<{
    resident: string;
    bookingDate: string;
    note: string;
    guests: string;
    amount: number;
    bookingStart: string;
    bookingEnd: string;
    amenityId: any;
    hour: string;
  }>({
    resident: '',
    bookingDate: moment(new Date()).format('YYYY-MM-DD'),
    note: '',
    guests: '',
    amount: 0,
    bookingStart: '',
    bookingEnd: '',
    amenityId: id,
    hour: '',
  });

  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const isEndTimeValid = (start: string, end: string) => {
    // Convert times to numbers for comparison
    const startTime = parseFloat(start);
    const endTime = parseFloat(end);

    return endTime >= startTime;
  };

  const loading = useRef(false);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    const {bookingStart, bookingEnd, bookingDate} = values.current;

    if (!isEndTimeValid(bookingStart, bookingEnd)) {
      showAlertWithOneAction({
        title: trans('Invalid Time'),
        body: trans('End time must be greater than or equal to start time.'),
      });
      return;
    }

    const payload = {
      ...values.current,
      bookingDate,
      resident: item?.resident?._id ? item?.resident?._id : userInfo?._id,
      amount: parseInt(values?.current.amount),
      guests: parseInt(values?.current.guests),
      amenityId: id,
      hour: values.current.hour,
    };
    console.log('Payload before submit:', payload);

    // if (checkEmptyValues(payload)) {
    loading.current = true;
    const result = await (edit
      ? bookingService.update({...payload}, id)
      : bookingService.create(payload));
    const {status, body, message} = result as apiResponse;
    console.log('API Response:', result);
    if (status) {
      // edit
      //     ? dispatch(updateAction({ item: body, index, id }))
      //     : dispatch(addAction(body));
      navigation.navigate(screens.bookings as never);
    } else {
      showAlertWithOneAction({
        title: trans('Bookings'),
        body: message,
      });
    }
    loading.current = false;
    // } else {
    //     showAlertWithOneAction({
    //         title: trans('Invalid'),
    //         body: trans('Please fill-up correctly'),
    //     });
    // }
    setLoading(false);
  };

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await bookingService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking body', result);
        if (status) {
          values.current = {
            bookingDate: body?.bookingDate,
            amenityId: body?._id,
            note: body?.note,
            guests: body?.guests,
            amount: body?.amount,
            bookingStart: body?.bookingStart,
            bookingEnd: body?.bookingEnd,
            hour: body?.hour,
          };
          setSelectedDate(body?.bookingDate);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);

  const handleDelete = async () => {
    const result = await bookingService.delete(values?.current?.amenityId);
    try {
      const {status, message, body} = result as apiResponse;
      if (status) {
        Alert.alert(trans('Success'), trans('Booking deleted successfully!'));
        navigation.goBack();
      } else {
        Alert.alert(trans('Error'), trans('Unable to delete booking!') + ' ' + message);
      }
    } catch (error) {
      console.log('Error exception caught: ', error);
    }
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    console.log('selected day', day);
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Reservation Date')}
          body={item?.ameninty}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(20, 0, 20, 0)}}>
          <Calendar
            onDayPress={handleDayPress}
            monthFormat={'MMMM yyyy'}
            onMonthChange={(month: any) => {}}
            hideArrows={false}
            hideExtraDays={true}
            showWeekNumbers={true}
            onPressArrowLeft={(subtractMonth: any) => subtractMonth()}
            onPressArrowRight={(addMonth: any) => addMonth()}
            disableArrowRight={false}
            disableAllTouchEventsForDisabledDays={true}
            theme={{
              calendarBackground: colors.white,
              textSectionTitleColor: colors.primary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.primary,
              selectedDotColor: colors.white,
              arrowColor: colors.primary,
              textDayFontSize: 12,
              indicatorColor: colors.primary,
              markedDates: colors.primary,
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.primary,
                //selectedTextColor: colors.white,
              },
            }}
            renderHeader={(date: any) => {
              return (
                <View style={stylesBooking.header}>
                  <Text style={stylesBooking.headerText}>
                    {date.toString('MMMM yyyy')}
                  </Text>
                </View>
              );
            }}
            // Enable the option to swipe between months. Default = false
            enableSwipeMonths={true}
          />

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={stylesBooking.dateText}>{`${trans('Date')}:  ${moment(
              values?.current.bookingDate,
            ).format('MMM DD YYYY')}`}</Text>
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: '#46D12F',
                borderRadius: 10,
                marginHorizontal: 10,
              }}></View>
            <Text style={stylesBooking.dateText}>{trans('Available')}</Text>
          </View>
          <View style={{...customPadding(17, 20, 20, 20)}}>
            <CustomSelect
              placeholder={trans('Select an option')}
              label={trans('Schedule Type')}
              data={['6 hour blocks']}
              isDataObject={false}
              onChange={(text: any) => handleChange(text, 'hour')}
              defaultValue={values.current.hour}
              mainStyles={{
                height: rs(50),
                backgroundColor: colors.graySoft,
              }}
            />
            <LabelInput
              label={trans('Note')}
              placeholder={trans('Note')}
              name="note"
              onChangeText={handleChange}
              defaultValue={values?.current?.note}
            />
            <LabelInput
              label={trans('Guests')}
              placeholder={trans('Guests')}
              name="guests"
              inputProps={{inputMode: 'numeric'}}
              onChangeText={(text: string) => handleChange(text, 'guests')}
              defaultValue={values?.current?.guests}
            />
            <LabelInput
              label={trans('Amount')}
              placeholder={trans('Amount')}
              name="amount"
              inputProps={{inputMode: 'numeric'}}
              onChangeText={handleChange}
              defaultValue={
                values?.current?.amount ? values.current.amount.toString() : ''
              }
            />

            <LabelInput
              label={trans('Start')}
              placeholder={trans('Start')}
              name="bookingStart"
              inputProps={{inputMode: 'numeric'}}
              onChangeText={handleChange}
              defaultValue={values?.current?.bookingStart}
            />
            <LabelInput
              label={trans('End')}
              placeholder={trans('End')}
              name="bookingEnd"
              inputProps={{inputMode: 'numeric'}}
              onChangeText={handleChange}
              defaultValue={values?.current?.bookingEnd}
            />
          </View>

          {edit && (
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                width: 150,
                height: 40,
                marginTop: 20,
                alignSelf: 'center',
                backgroundColor: colors.error1,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  stylesBooking.SelectText,
                  {...typographies(colors).ralewayBold15, color: '#fff'},
                ]}>
                {trans('Eliminate')}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Container>
    </>
  );
};

const stylesBooking = StyleSheet.create({
  SelectDate: {
    ...customPadding(6, 6, 6, 20),
    backgroundColor: colors.tertiary,
  },
  SelectText: {
    ...typographies(colors).ralewayMedium12,
    color: colors.white,
  },
  dateText: {
    ...typographies(colors).ralewayMedium12,
    color: colors.graySoft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    ...typographies(colors).montserratMedium13,
    color: colors.primary,
    // backgroundColor: '#f0f0f0',
  },
  headerText: {
    // fontSize: 18,
    fontWeight: 'bold',
    ...typographies(colors).montserratMedium17,
    color: colors.primary,
  },
});
export default ReservationDate;
