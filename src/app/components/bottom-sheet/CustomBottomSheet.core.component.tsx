import React, {FC, forwardRef, memo} from 'react';
import {Animated, Pressable, View} from 'react-native';
import useBottomSheetHook from './useBottomSheet.hook';
import styles from './bottomSheet.style';
import {bottomSheet} from './bottomSheetInterface';
import CustomStatusBar from '../core/CustomStatusBar.core';
import {useTheme} from '@react-navigation/native';
import {customUseSelector} from '../../packages/redux.package';
import {themeStates} from '../../state/allSelector.state';

const CustomBottomSheet: FC<bottomSheet> = forwardRef(
  ({Component, backDropHandler, extraProps}, ref) => {
    const {colors} = useTheme();
    const {theme} = customUseSelector(themeStates);
    const {opacityRef, positionRef, handleHideComponent} = useBottomSheetHook(
      ref,
      backDropHandler,
      extraProps,
    );
    return (
      <View style={styles(colors).container}>
        <CustomStatusBar
          showHeader={false}
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Animated.View style={[styles(colors).backdrop, {opacity: opacityRef}]}>
          <Pressable
            onPress={handleHideComponent}
            style={styles(colors).backdropHandler}
          />
          <Animated.View
            style={[
              styles(colors).viewContainer,
              {transform: [{translateY: positionRef}]},
            ]}>
            <Component {...extraProps.componentProps} />
          </Animated.View>
        </Animated.View>
      </View>
    );
  },
);

export default memo(CustomBottomSheet);
