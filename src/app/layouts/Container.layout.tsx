import React, {ReactElement} from 'react';
import {StatusBarStyle, StyleSheet, View} from 'react-native';
import {globalStyles} from '../assets/global-styles/global.style.asset';
import CustomStatusBar from '../components/core/CustomStatusBar.core';
import CustomActivityBar from '../components/core/CustomActivityBar.core.component';
import {useTheme} from '@react-navigation/native';
import {customUseSelector} from '../packages/redux.package';
import {themeStates} from '../state/allSelector.state';
import BottomTabIcon from '../routes/bottom-tab/IconBottomTab.app.component';

interface props {
  children: ReactElement | any;
  containerStyle?: object;
  bg?: string;
  showActivity?: boolean;
  showHeader?: boolean;
  statusBarBg?: string;
  activityBgColor?: string;
  ph?: number;
  barStyle?: StatusBarStyle;
  bottomTab?: boolean;
}

const Container: React.FC<props> = ({
  children,
  containerStyle = {},
  bg,
  showActivity = false,
  showHeader = true,
  statusBarBg,
  activityBgColor,
  ph = 0,
  barStyle,
  bottomTab = false,
}) => {
  const {colors} = useTheme() as any;
  const styles = containerStyles(bg || colors.white, ph);
  const {theme} = customUseSelector(themeStates);
  return (
    <View style={globalStyles.flex1}>
      <CustomStatusBar
        bgColor={statusBarBg || colors.gray2}
        showHeader={showHeader}
        barStyle={
          'default' || theme === 'dark' ? 'light-content' : 'dark-content'
        }
      />
      <View style={[styles.container, containerStyle]}>{children}</View>
      {bottomTab && <BottomTabIcon />}
      {showActivity && (
        <CustomActivityBar bgColor={activityBgColor || colors.white} />
      )}
    </View>
  );
};
export default Container;

const containerStyles = (bgColor: any, ph: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
      flex: 1,
      position: 'relative',
      paddingHorizontal: ph,
    },
  });
