import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {activityHeight} from '../../utilities/helper';
import {config} from '../../../Config';
import {useTheme} from '@react-navigation/native';

const CustomActivityBar: React.FC<any> = ({bgColor}) => {
  const {colors} = useTheme() as any;
  const style = styles(config.activityHeight, bgColor || colors.transparent);
  return <View style={style.container} />;
};
export default CustomActivityBar;

const styles = (height: any, bgColor: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
      height: Platform.OS === 'ios' ? height : activityHeight(),
    },
  });
