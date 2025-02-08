/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { nativeDriver } from '../../assets/ts/properties.asset';
import { shadow } from '../../assets/global-styles/global.style.asset';
import { getHexaOpacityColorCode } from '../../utilities/helper';
import { useTheme } from '@react-navigation/native';

const CustomSwitch: React.FC<{
  value?: boolean;
  onPress?: (params1: boolean, params2: string) => void;
  activeColor?: string;
  name?: string;
  disabled?: boolean; 
}> = ({ value = false, activeColor = '', onPress = () => { }, name, disabled = false }) => {
  const valueRef = useRef(false);
  const [show, setShow] = useState<boolean>(value);
  const translateRef = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme() as any;
  useEffect(() => {
    value ? handleSwitch(true) : handleSwitch(false);
    setShow(value);
  }, [value]);

  const handleSwitch = (flag = false) => {
    Animated.timing(translateRef, {
      toValue: flag ? 15 : 0,
      duration: 300,
      delay: 100,
      useNativeDriver: nativeDriver(),
    }).start(() => {
      valueRef.current = flag;
    });
  };
  const handlePress = () => {
    setShow(!show);
    onPress && onPress(!show, name ? name?.trim() : '');
    !show ? handleSwitch(true) : handleSwitch(false);
  };
  const backgroundColor = translateRef.interpolate({
    inputRange: [0, 15],
    outputRange: [colors.gray3, activeColor || colors.primary],
    extrapolate: 'clamp',
  });

  return (
    <Pressable onPress={!disabled ? handlePress : null}>
      <Animated.View style={[styles.containerStyle, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.circleStyle,
            {
              backgroundColor: show
                ? getHexaOpacityColorCode(colors.pureWhite, 0.37)
                : colors.pureWhite,
            },
            {
              transform: [
                {
                  translateX: translateRef,
                },
              ],
            },
            shadow(colors).shadow,
          ]}
        />
      </Animated.View>
    </Pressable >
  );
};

const styles = StyleSheet.create({
  circleStyle: {
    width: 13,
    height: 13,
    borderRadius: 24,
  },
  containerStyle: {
    width: 32,
    height: 19,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 36.5,
    justifyContent: 'center',
  },
});

export default CustomSwitch;
