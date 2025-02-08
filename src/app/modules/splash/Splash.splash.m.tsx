import {StatusBar, View} from 'react-native';
import React from 'react';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useTheme} from '@react-navigation/native';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import useSplash from './hooks/useSplash.hook';

const Splash = () => {
  const {colors} = useTheme() as any;
  const {} = useSplash();

  return (
    <View
      style={[
        globalStyles.flex1,
        globalStyles.justifyAlignCenter,
        {
          backgroundColor: colors.secondary,
        },
      ]}>
      <StatusBar
        backgroundColor={colors.secondary}
        barStyle={'light-content'}
      />
      <ImagePreview source={imageLink.whiteLogo} />
    </View>
  );
};

export default Splash;
