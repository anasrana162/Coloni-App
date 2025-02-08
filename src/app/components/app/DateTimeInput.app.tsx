import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
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
import DateTimePicker from '../core/DateTimePicker.core.component';
import {useTheme} from '@react-navigation/native';
const DateTimeInput: React.FC<dateTimeInputProps> = ({
  label,
  placeholder = '',
  defaultValue = momentTimezone().toDate(),
  onChange,
  disabled = false,
  style,
  name,
}) => {
  const [date, setDate] = useState<Date>();
  const [show, setShow] = useState<boolean>(false);
  const {colors} = useTheme() as any;
  const dateChange = (event: DateTimePickerEvent, newDate?: Date) => {
    setShow(false);
    newDate && setDate(newDate);
    onChange && onChange(newDate, name ? name?.trim() : '');
  };
  const handleOpenModal = () => {
    setShow(true);
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
          onPress={handleOpenModal}
          activeOpacity={0.6}>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              globalStyles.flexShrink1,
              globalStyles.flexGrow1,
              {
                color: !date
                  ? defaultValue
                    ? colors?.grayDark
                    : colors.gray3
                  : colors.grayDark,
              },
            ]}
            numberOfLines={1}>
            {!date
              ? momentTimezone(defaultValue).format('MM-DD-YYYY')
              : momentTimezone(date).format('MM-DD-YYYY') || placeholder}
          </Text>
          <CalenderIcon />
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          onChange={dateChange}
          value={momentTimezone(date).toDate()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </>
  );
};

export default DateTimeInput;

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
