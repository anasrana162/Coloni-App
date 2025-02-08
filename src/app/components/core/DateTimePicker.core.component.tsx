import React from 'react';
import {
  CustomDateTimePicker,
  DateTimePickerMode,
} from '../../packages/datetimePicker.package';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {customUseSelector} from '../../packages/redux.package';
import {themeStates} from '../../state/allSelector.state';
interface props {
  minimumDate?: Date;
  value?: Date;
  mode?: DateTimePickerMode;
  onChange?: (event: DateTimePickerEvent, date?: Date) => void;
}
const DateTimePicker: React.FC<props> = ({
  minimumDate = new Date(),
  value = new Date(),
  mode = 'date',
  onChange = () => {},
}) => {
  const {theme} = customUseSelector(themeStates);
  return (
    <CustomDateTimePicker
      value={value}
      mode={mode}
      onChange={onChange}
      themeVariant={theme}
    />
  );
};

export default DateTimePicker;
