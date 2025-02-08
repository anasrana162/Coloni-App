import React from 'react';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {themeStates} from '../../state/allSelector.state';
import CustomSwitch from '../core/CustomSwitch.core.component';
import {useTheme} from '@react-navigation/native';
import {updateTheme} from '../../state/features/themeSlice';

const DarkToLight = () => {
  const dispatch = customUseDispatch();
  const {theme} = customUseSelector(themeStates);
  const {colors} = useTheme() as any;
  const handlePress = () => {
    dispatch(updateTheme(theme === 'dark' ? 'light' : 'dark'));
  };
  return (
    <CustomSwitch
      value={theme === 'dark' ? true : false}
      activeColor={colors.dark}
      onPress={handlePress}
    />
  );
};

export default DarkToLight;
