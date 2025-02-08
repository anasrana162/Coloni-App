import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { customPadding } from '../../../assets/global-styles/global.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import { colors } from '../../../assets/global-styles/color.assets';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';

interface inputLeftIconProps {
  icon?: any;
  placeholder?: string;
  value:any,
  onChangeText?: (
    value: any,
    name?: any,
    validationRules?: boolean | any | undefined,
  ) => void;
  defaultValue?: any;
  name?: string | any | undefined;
  validationRules?: () => boolean | undefined | any;
  inputProps?: TextInputProps;
  style?: ViewStyle;
  rightIcon?: any;
  inputRef?: any;
}

const Ip_AdressFeild: React.FC<inputLeftIconProps & { onIconPress?: () => void }> = ({
  icon,
  placeholder = '',
  onChangeText,
  value = '',
  name,
  inputProps = {},
  defaultValue,
  style,
  inputRef,
  onIconPress
}) => {
  const [showIp, setShowIp] = useState(false);
  const { colors } = useTheme() as any;

  const handleOnChange = (text: string) => {
    if (name && name.trim() !== '') {
      onChangeText && onChangeText(text, name);
    } else {
      onChangeText && onChangeText(text, undefined);
    }
  };

  const handleIconPress = () => {
    setShowIp(true); 
    if (onIconPress) {
      onIconPress(); 
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        numberOfLines={1}
        onChangeText={handleOnChange}
        ref={inputRef}
        placeholder={placeholder}
        selectionColor={colors.primary}
        placeholderTextColor={colors.gray1}
        value={showIp ? value : defaultValue||''} 
        {...inputProps}
      />
      <TouchableOpacity onPress={handleIconPress}>
        {icon && <View>{icon}</View>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.transparent,
    backgroundColor: colors.graySoft,
    ...customPadding(0, 10, 0, 10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: rs(10),
  },
  input: {
    ...typographies(colors).ralewayMedium12,
    color: colors.grayDark,
    flexGrow: 1,
  },
});

export default Ip_AdressFeild;
