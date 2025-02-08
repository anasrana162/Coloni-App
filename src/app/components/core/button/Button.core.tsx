import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {buttonProps} from '../../../types/components.interface';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
const Button: React.FC<buttonProps> = ({
  text = '',
  borderRadius = 10,
  bgColor,
  style = {},
  textColor,
  textStyle = {},
  onPress,
  icon,
  isLoading,
}) => {
  const {colors} = useTheme() as any;
  const styles = buttonStyles(borderRadius, bgColor || colors.light, icon);
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      disabled={isLoading}
      style={[styles.container, style]}>
      {icon}
      {isLoading ? (
        <ActivityIndicator color={colors.pureWhite} />
      ) : (
        <Text
          style={[
            typographies(colors).ralewayBold,
            {color: textColor || colors.dark},
            textStyle,
          ]}
          numberOfLines={1}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const buttonStyles = (borderRadius: number, bgColor: string, icon: any) =>
  StyleSheet.create({
    container: {
      borderRadius,
      backgroundColor: bgColor,
      flexShrink: 1,
      height: rs(54),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: icon ? rs(10) : 0,
    },
  });
