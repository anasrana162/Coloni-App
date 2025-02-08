import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  StatusBarStyle,
} from 'react-native';
import {customUseSafeAreaInsets} from '../../packages/safeAreaContext.package';
import {useTheme} from '@react-navigation/native';
interface props {
  barStyle?: StatusBarStyle;
  showHeader?: boolean;
  bgColor?: string;
  extraHeight?: number;
}
const CustomStatusBar: React.FC<props> = ({
  barStyle = 'dark-content',
  showHeader = true,
  bgColor,
  extraHeight = 0,
}) => {
  const {colors} = useTheme() as any;
  const {top} = customUseSafeAreaInsets();
  const statusBarProps: any = {barStyle: barStyle, animated: true};
  const style = styles(top, bgColor || colors.transparent, extraHeight);
  if (Platform.OS === 'android') {
    statusBarProps.translucent = true;
    statusBarProps.backgroundColor = bgColor;
  }
  if (!showHeader) {
    if (Platform.OS === 'android') {
      statusBarProps.backgroundColor = colors.transparent;
    }
    return <StatusBar {...statusBarProps} />;
  }
  return (
    <View style={style.container}>
      <StatusBar {...statusBarProps} />
    </View>
  );
};
export default CustomStatusBar;

const styles = (height: any, bgColor: any, extraHeight: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
      paddingBottom: height + extraHeight,
    },
  });
