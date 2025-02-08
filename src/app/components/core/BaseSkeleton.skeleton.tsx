import React, {useEffect, useRef} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {nativeDriver} from '../../assets/ts/properties.asset';
import {useTheme} from '@react-navigation/native';

interface baseSkeletonProps {
  width?: number | 'auto' | `${number}%`;
  height?: number | 'auto' | `${number}%`;
  borderRadius?: number;
  bgColor?: string;
  style?: ViewStyle;
}

const BaseSkeleton: React.FC<baseSkeletonProps> = ({
  width = 50,
  height = 30,
  borderRadius = 0,
  bgColor,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3));
  const {colors} = useTheme() as any;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: nativeDriver(),
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: nativeDriver(),
          duration: 800,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacity.current,
          height: height,
          width: width,
          backgroundColor: bgColor ? bgColor : colors.gray1,
          borderRadius: borderRadius,
        },
        style as ViewStyle,
      ]}
    />
  );
};

export default BaseSkeleton;
