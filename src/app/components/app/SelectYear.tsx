import { Text, ViewStyle, TouchableOpacity, Modal, FlatList ,View} from 'react-native';
import React, { useState } from 'react';
import CalenderIcon from '../../assets/icons/Calender.icon';
import { globalStyles } from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { momentTimezone } from '../../packages/momentTimezone.package';
import { useTheme } from '@react-navigation/native';

interface Props {
  style?: ViewStyle;
  onPress?: (value: any, name: string) => void;
  name?: string;
  defaultValue?: Date;
}

const SelectYear: React.FC<Props> = ({ style, onPress, name, defaultValue }) => {
  const [date, setDate] = useState<Date>(defaultValue || momentTimezone().toDate());
  const [show, setShow] = useState<boolean>(false);
  const { colors } = useTheme() as any;

  const onYearChange = (selectedYear: number) => {
    const newDate = new Date(selectedYear, 0); // Set to January of the selected year
    setShow(false);
    setDate(newDate);
    onPress && onPress(newDate, name || '');
  };

  const handleOpenModal = () => {
    setShow(true);
  };

  const years = Array.from({ length: 101 }, (_, index) => new Date().getFullYear() - index); // Generates a list of years

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOpenModal}
        style={[globalStyles.flexRow, { gap: rs(6) }, style]}>
        <CalenderIcon />
        <Text style={typographies(colors).ralewayBold15}>
          {momentTimezone(date).format('YYYY') + ' >'}
        </Text>
      </TouchableOpacity>
      
      <Modal visible={show}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setShow(false)}
        >
          <View style={{ backgroundColor: colors.background, borderRadius: 10, padding: 20 }}>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onYearChange(item)} style={{ padding: 10 }}>
                  <Text style={typographies(colors).ralewayMedium14}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default SelectYear;
