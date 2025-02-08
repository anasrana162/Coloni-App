import {View, Text, ViewStyle} from 'react-native';
import React from 'react';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import CustomSwitch from '../core/CustomSwitch.core.component';
import {useTheme} from '@react-navigation/native';
interface props {
  label?: string;
  style?: ViewStyle;
  defaultValue?: boolean;
  name?: string;
  disabled?:boolean;
  onChange?: (params1: boolean, params2: string) => void;
}
const ActiveOrDisActive: React.FC<props> = ({
  label,
  style,
  onChange,
  defaultValue,
  name,
  disabled,
}) => {
  const {colors} = useTheme() as any;
  return (
    <View style={[globalStyles.rowBetween, style]}>
      <Text
        style={[typographies(colors).ralewayMedium12, {color: colors.primary}]}>
        {label}
      </Text>
      <CustomSwitch name={name} value={defaultValue} onPress={onChange} disabled={disabled} />
    </View>
  );
};

export default ActiveOrDisActive;
