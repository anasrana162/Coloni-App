import {View, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import rs from '../../assets/global-styles/responsiveSze.style.asset';

const ProgressBar: React.FC<{
  width?: string | number;
  style?: ViewStyle;
  color?: string;
  slider?: boolean;
}> = ({width = '10%', style = {}, color, slider = false}) => {
  const {colors} = useTheme() as any;
  const styles = progressBarStyle(width, color || colors.primary, colors);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.progressBar} />
      {slider && (
        <View
          style={{
            width: rs(15),
            height: rs(15),
            backgroundColor: colors.gray5,
            borderRadius: 500,
            alignSelf: 'center',
            left: -5,
          }}
        />
      )}
    </View>
  );
};
const progressBarStyle = (width?: string | any, color?: string, colors?: any) =>
  StyleSheet.create({
    container: {
      height: 5,
      flexDirection: 'row',
      width: '100%',
      backgroundColor: colors.gray2,
      borderRadius: 30,
      // alignItems: 'center',
    },
    progressBar: {
      backgroundColor: color,
      borderRadius: 30,
      width: typeof width === 'number' ? `${width}%` : width
    },
  });
export default ProgressBar;
