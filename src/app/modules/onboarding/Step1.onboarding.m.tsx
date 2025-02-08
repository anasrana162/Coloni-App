import React from 'react';
import Container from '../../layouts/Container.layout';
import OnboardingHeader from './Onboarding.Header';
import {ImageBackground, Text, View} from 'react-native';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import imageLink from '../../assets/images/imageLink';
import Button from '../../components/core/button/Button.core';
import {onboardingStyles} from './styles/onboarding.styles';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {customUseSelector} from '../../packages/redux.package';
import {themeStates} from '../../state/allSelector.state';
const Step1 = () => {
  const navigation = useCustomNavigation();
  const {colors} = useTheme() as any;
  const {theme} = customUseSelector(themeStates);
  const {t: trans} = useTranslation();
  const styles = onboardingStyles(colors);
  return (
    <Container
      statusBarBg={colors.white}
      bottomTab={false}
      barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}>
      <OnboardingHeader skip={true} />
      <View style={{...customPadding(39, 20, 0, 20)}}>
          <Text
            style={[
              typographies(colors).montserratMedium25,
              {color: colors.primary, lineHeight: rs(40)},
            ]}>
            {trans('Imagine having all the control of your residence in one app')}
          </Text>
        <Text
          style={[
            typographies(colors).montserratNormal12,
            {lineHeight: rs(20), ...customPadding(10)},
          ]}>
          {trans(
            'With ColoiApp you can manage access, income and expenses, visits, suppliers and have complete transparency of your complex.',
          )}
        </Text>
      </View>
      <View
        style={[globalStyles.flexShrink1, {...customPadding(25, 10, 10, 10)}]}>
        <ImageBackground
          source={imageLink.onboardingImage2}
          borderRadius={40}
          style={{
            height: `${'100%'}`,
          }}>
          <View style={styles.bottomContainer}>
            <Button
              text={trans('Next')}
              style={{width: ` ${'50%'}`}}
              onPress={() => navigation.navigate(screens.step2 as never)}
            />
            <View style={styles.slideContainer}>
              <View style={styles.slide} />
            </View>
          </View>
        </ImageBackground>
      </View>
    </Container>
  );
};

export default Step1;
