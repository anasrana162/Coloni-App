import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {useTheme} from '@react-navigation/native';
interface badge {
  text: string;
  style?: ViewStyle;
  onPress?: () => void;
  textStyle?: TextStyle;
  textColor?: any;
  disabled?: boolean;
  bgColor?: any;
  isLoading?: boolean;
  classes?: 'big' | 'small';
}
const Badge: React.FC<badge> = ({
  text = '',
  style = {},
  onPress = () => {},
  textStyle = {},
  disabled = false,
  textColor,
  bgColor,
  classes = 'big',
}) => {
  const {colors} = useTheme() as any;
  const styles = badgeStyles(
    textColor || colors.white,
    bgColor || colors.tertiary,
    classes,
  );
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.5}>
      <Text
        style={[
          typographies(colors).ralewaySemibold12,
          styles.text,
          globalStyles.flexShrink1,
          textStyle,
        ]}
        numberOfLines={1}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Badge;

const badgeStyles = (
  textColor: string,
  bgColor: string,
  classes: 'big' | 'small',
) =>
  StyleSheet.create({
    container: {
      ...customPadding(
        classes === 'small' ? 4 : 7,
        12,
        classes === 'small' ? 4 : 7,
        12,
      ),
      borderRadius: 100,
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: bgColor,
    },
    text: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: textColor,
      width: '100%',
    },
  });
