import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { outlineButtonProps } from '../../../types/components.interface';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import { customPadding } from '../../../assets/global-styles/global.style.asset';
import { useTheme } from '@react-navigation/native';
const OutlineButton: React.FC<outlineButtonProps> = ({
  text = '',
  borderRadius = 10,
  borderColor,
  style = {},
  textColor,
  textStyle = {},
  activeOpacity = 1,
  onPress,
}) => {
  const { colors } = useTheme();
  const styles = buttonStyles(borderRadius, borderColor || colors.primary);
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[styles.container, style]}>
      <Text
        style={[
          typographies(colors).montserratSemibold,
          { color: textColor || colors.primary },
          textStyle,
        ]}
        numberOfLines={1}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default OutlineButton;

const buttonStyles = (borderRadius: number, borderColor: string) =>
  StyleSheet.create({
    container: {
      borderRadius,
      borderColor,
      borderWidth: 1,
      ...customPadding(15, 10, 15, 10),
      flexShrink: 1,
      alignItems: 'center',
    },
  });
