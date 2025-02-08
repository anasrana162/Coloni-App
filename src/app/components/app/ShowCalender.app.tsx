import { Text, ViewStyle, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { momentTimezone } from '../../packages/momentTimezone.package';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import CalenderIcon from '../../assets/icons/Calender.icon';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { globalStyles } from '../../assets/global-styles/global.style.asset';
import DateTimePicker from '../core/DateTimePicker.core.component';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

interface Props {
  style?: ViewStyle;
  onPress?: (value: any, name: string) => void;
  name?: string;
  selectDate?: any 
  defaultValue?: Date;
}

const ShowCalender: React.FC<Props> = ({ style, selectDate, defaultValue, onPress, name }) => {
  const [date, setDate] = useState<Date>(() => defaultValue || momentTimezone().toDate());
  const [show, setShow] = useState<boolean>(false);
  const { colors } = useTheme() as any;

  const onChange = useCallback((event: DateTimePickerEvent, newDate?: Date) => {
    if (newDate) {
      setDate(newDate);
      if (selectDate) {
        selectDate(newDate)
      }
      setShow(false);
      if (onPress) {
        onPress(newDate, name || '');
        // setShow(false);
      }
    }
    setShow(false);
  }, [selectDate, onPress, name]);

  const handleOpenModal = useCallback(() => {
    setShow(true);
  }, []);
  const {t: trans} = useTranslation();

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOpenModal}
        style={[globalStyles.flexRow, { gap: rs(5) }, style]}>
        <CalenderIcon height={rs(16)} width={rs(16)} />
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            { color: colors.primary, marginLeft: 10 },
          ]}>
          {date ? momentTimezone(date).format('MM/DD/YYYY') : trans('Select Date')}
        </Text>
      </TouchableOpacity>
      {show && <DateTimePicker onChange={onChange} value={date} />}
    </>
  );
};

export default ShowCalender;
