import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {screens} from '../../routes/routeName.route';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {storeLocalData} from '../../packages/asyncStorage/storageHandle';
import {customUseSelector} from '../../packages/redux.package';
import {themeStates} from '../../state/allSelector.state';
const OnboardingHeader: React.FC<{skip?: boolean}> = ({skip = true}) => {
  const {theme} = customUseSelector(themeStates);
  const {colors} = useTheme();
  const {t: trans} = useTranslation();
  const handleNavigation = () => {
    global.changeState(screens.login);
    storeLocalData.onboardingFlag(true);
  };
  return (
    <View style={styles(colors).container}>
      <ImagePreview
        source={theme === 'dark' ? imageLink.whiteLogo : imageLink.colorLogo}
        styles={{width: rs(167), height: rs(42)}}
      />
      {skip && (
        <TouchableOpacity
          style={styles(colors).skipText}
          activeOpacity={0.7}
          onPress={handleNavigation}>
          <Text style={typographies(colors).montserratNormal12}>
            {trans('Skip')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OnboardingHeader;

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      ...customPadding(6, 15, 0, 15),
    },
    skipText: {
      ...customPadding(8, 30, 8, 30),
      borderRadius: 100,
      backgroundColor: colors.gray,
      justifyContent: 'center',
    },
  });
