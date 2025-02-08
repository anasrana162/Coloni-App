import {ViewStyle, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import {shadow as shadow1} from '../../assets/global-styles/global.style.asset';

interface props {
  icon?: any;
  bgColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: boolean;
}
const IconCircle: React.FC<props> = ({
  icon,
  bgColor,
  style,
  onPress,
  shadow = true,
}) => {
  const {colors} = useTheme() as any;
  const styles = circleStyles(bgColor || colors.primary);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, shadow && shadow1(colors).shadow, style]}
      onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

export default IconCircle;

const circleStyles = (bgColor: string) =>
  StyleSheet.create({
    container: {
      width: rs(60),
      height: rs(60),
      borderRadius: 50,
      backgroundColor: bgColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
