import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import MonthPicker, { EventTypes } from 'react-native-month-year-picker';
import moment from 'moment';
import { useTheme } from '@react-navigation/native';
import CalenderIcon from '../../../assets/icons/Calender.icon';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { customPadding, globalStyles } from '../../../assets/global-styles/global.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';

interface MonthYearInputFieldProps {
  label?: string;
  placeholder?: string;
  defaultValue?: Date;
  onChange?: (date: Date, name?: string) => void;
  style?: object;
  name?: string;
}

const MonthYearInput: React.FC<MonthYearInputFieldProps> = ({
  label,
  placeholder = '',
  defaultValue = new Date(),
  onChange,
  style,
  name,
}) => {
  const [date, setDate] = useState<Date>(
    typeof defaultValue === 'string' ? new Date(defaultValue) : defaultValue,
  );
  const [show, setShow] = useState<boolean>(false);
  const { colors } = useTheme() as any;
useEffect(() => {
  if (defaultValue && defaultValue instanceof Date && !isNaN(defaultValue.getTime())) {
    setDate(defaultValue);
  } else if (typeof defaultValue === 'string') {
    setDate(new Date(defaultValue)); 
  }
}, [defaultValue]);
  const showPicker = useCallback((value: boolean) => {
    setShow(value);
  }, []);
  const onValueChange = useCallback(
    (event: EventTypes, newDate?: Date) => {
        setShow(false);
      switch (event) {
        case 'dateSetAction':
          if (newDate) {
            setDate(newDate);
            if (onChange) {
              onChange(newDate, name ? name.trim() : '');
            }
          }
          setShow(false); 
          break;
        case 'neutralAction':
            setShow(false); 
          break;
        case 'dismissedAction':
        default:
          setShow(false); 
          break;
      }
    },
    [onChange, name],
  );

  return (
    <SafeAreaView style={[{ marginBottom: 13 }, style]}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primary, marginBottom: 4, marginLeft: 12 }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.textContainer, { backgroundColor: colors.gray8 }]}
        onPress={() => showPicker(true)}
        activeOpacity={0.6}
      >
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            globalStyles.flexShrink1,
            globalStyles.flexGrow1,
            { color: !date ? colors.gray3 : colors.grayDark },
          ]}
          numberOfLines={1}
        >
          {date ? moment(date).format('MM-YYYY') : placeholder}
        </Text>
        <CalenderIcon />
      </TouchableOpacity>

      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date || new Date()}
          autoTheme
          maximumDate={new Date(3000, 0)}
        />
      )}
    </SafeAreaView>
  );
};

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

export default MonthYearInput;
