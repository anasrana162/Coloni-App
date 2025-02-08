import {
  Text,
  ViewStyle,
  TouchableOpacity,
  View,
  Modal,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {momentTimezone} from '../../packages/momentTimezone.package';
import {useTheme} from '@react-navigation/native';
import MonthPicker from 'react-native-month-year-picker';

interface Props {
  style?: ViewStyle;
  onPress?: (value: any, name: string) => void;
  name?: string;
  defaultValue?: Date;
  showYearOnly?: boolean;
}

const SelectMonth: React.FC<Props> = ({
  style,
  onPress,
  name,
  defaultValue,
  showYearOnly,
}) => {
  const [date, setDate] = useState<Date>(
    defaultValue || momentTimezone().toDate(),
  );
  const [show, setShow] = useState<boolean>(false);
  const {colors} = useTheme() as any;

  const onMonthChange = (event: string, newDate: Date) => {
    setShow(false);
    setDate(newDate);
    onPress && onPress(newDate, name || '');
  };

  const handleOpenModal = () => {
    setShow(true);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOpenModal}
        style={[globalStyles.flexRow, {gap: rs(6)}, style]}>
        <CalenderIcon />
        <Text style={typographies(colors).ralewayBold15}>
          {showYearOnly
            ? momentTimezone(date).format('YYYY') + ' >'
            : momentTimezone(date).format('MMMM, YYYY') + ' >'}
        </Text>
      </TouchableOpacity>
      {show && Platform.OS === 'ios' ? (
        <Modal
          transparent
          animationType="slide"
          visible={show}
          onRequestClose={() => setShow(false)}>
          <View
            style={[
              globalStyles.flex1,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            ]}>
            <MonthPicker
              onChange={onMonthChange}
              value={date || new Date()}
              minimumDate={new Date(1900, 0)}
              maximumDate={new Date(3000, 0)}
              autoTheme={true}
            />
          </View>
        </Modal>
      ) : (
        show && (
          <MonthPicker
            onChange={onMonthChange}
            value={date || new Date()}
            minimumDate={new Date(1900, 0)}
            maximumDate={new Date(3000, 0)}
            autoTheme={true}
          />
        )
      )}
    </>
  );
};

export default SelectMonth;
