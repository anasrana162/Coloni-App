import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

const LoadingComp = () => {
  const {colors} = useTheme() as any;
  return (
    <>
      <StatusBar backgroundColor={'#00000001'} barStyle={'light-content'} />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#00000099',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={colors.primaryText} size={'large'} />
      </View>
    </>
  );
};

export default LoadingComp;

const styles = StyleSheet.create({});
