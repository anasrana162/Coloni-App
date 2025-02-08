/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import {clickableTextProps} from '../../types/components.interface';
import {useTheme} from '@react-navigation/native';

const ClickableText: React.FC<clickableTextProps> = ({
  text = '',
  onPress = () => {},
  hasUnderline = false,
  style = {},
  wrpStyle = {},
  disabled = false,
  color,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        wrpStyle,
        {display: disabled ? 'none' : 'flex'},
      ]}>
      <Text
        style={[
          typographies(colors).ralewaySemibold12,
          styles.text,
          {color: color || colors.secondary},
          hasUnderline ? styles.underline : {},
          style,
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

export default ClickableText;

const styles = StyleSheet.create({
  container: {alignSelf: 'flex-start'},
  text: {
    alignSelf: 'flex-start',
    ...customPadding(0, 5, 0, 5),
  },
  underline: {textDecorationLine: 'underline'},
});
