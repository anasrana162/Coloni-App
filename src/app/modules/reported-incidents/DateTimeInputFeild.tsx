import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {dateTimeInputProps} from '../../types/components.interface';
import {momentTimezone} from '../../packages/momentTimezone.package';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import CalenderIcon from '../../assets/icons/Calender.icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTheme} from '@react-navigation/native';
import moment from 'moment';

const DateTimeInputField: React.FC<dateTimeInputProps> = ({
  label,
  placeholder = '',
  defaultValue = momentTimezone().toDate(),
  onChange,
  disabled = false,
  style,
  name,
  isReportActivity = false,
}) => {
  const initialDate = isReportActivity
    ? defaultValue
    : defaultValue instanceof Date
    ? defaultValue
    : new Date();

  const [date, setDate] = useState<Date>(initialDate);
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);
  const {colors} = useTheme() as any;

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowPicker(null);
    if (selectedDate) {
      const newDate = new Date(selectedDate.setSeconds(0, 0));
      setDate(newDate);
      setShowPicker('time');
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    setShowPicker(null);
    if (selectedTime && date) {
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
      );
      setDate(combinedDateTime);
      onChange && onChange(combinedDateTime, name ? name.trim() : '');
    }
  };

  return (
    <>
      <View style={[{marginBottom: rs(13)}, style]}>
        {label && (
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {color: colors.primary, marginBottom: rs(6), marginLeft: rs(12)},
            ]}>
            {label}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.textContainer, {backgroundColor: colors.gray8}]}
          disabled={disabled}
          onPress={() => setShowPicker('date')}
          activeOpacity={0.6}>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              globalStyles.flexShrink1,
              globalStyles.flexGrow1,
              {
                color: date ? colors.grayDark : colors.gray3,
              },
            ]}
            numberOfLines={1}>
            {date
              ? isReportActivity
                ? moment.utc(date).format('MM/DD/YYYY,  hh:mm A')
                : momentTimezone(date).format('MM-DD-YYYY  hh:mm A')
              : placeholder || 'Select Date & Time'}
          </Text>
          <CalenderIcon />
        </TouchableOpacity>
      </View>
      {showPicker === 'date' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
      {showPicker === 'time' && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </>
  );
};

export default DateTimeInputField;

const styles = StyleSheet.create({
  textContainer: {
    height: rs(42),
    flexDirection: 'row',
    gap: 8,
    ...customPadding(0, 16, 0, 16),
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
