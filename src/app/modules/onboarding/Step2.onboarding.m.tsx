import React from 'react';
import Container from '../../layouts/Container.layout';
import OnboardingHeader from './Onboarding.Header';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import imageLink from '../../assets/images/imageLink';
import Button from '../../components/core/button/Button.core';
import { onboardingStyles } from './styles/onboarding.styles';
import ArrowLeftIcon from '../../assets/icons/ArrowLeft.icon';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import { storeLocalData } from '../../packages/asyncStorage/storageHandle';
import { useTheme } from '@react-navigation/native';
import { customUseSelector } from '../../packages/redux.package';
import { themeStates } from '../../state/allSelector.state';
import { useTranslation } from 'react-i18next';
const Step2 = () => {
  const navigation = useCustomNavigation();
  const { colors } = useTheme() as any;
  const { theme } = customUseSelector(themeStates);
  const styles = onboardingStyles(colors);
  const { t: trans } = useTranslation();
  const handleNavigation = () => {
    global.changeState(screens.login);
    storeLocalData.onboardingFlag(true);
  };
  return (
    <Container
      statusBarBg={colors.white}
      bottomTab={false}
      barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}>
      <OnboardingHeader skip={true} />
      <View style={{ ...customPadding(39, 20, 0, 20) }}>
        <Text
          style={[
            typographies(colors).montserratMedium25,
            { color: colors.primary, lineHeight: rs(40) },
          ]}>
          {trans('Simple, fast and accesible')}
        </Text>
        <Text
          style={[
            typographies(colors).montserratNormal12,
            { lineHeight: rs(20), ...customPadding(10) },
          ]}>
          {trans(
            'With a few clicks you can find all the information, grant or restrict access to your visits, payments, reservations.',
          )}
        </Text>
        <Text
          style={[
            typographies(colors).montserratNormal12,
            { lineHeight: rs(20), ...customPadding(10) },
          ]}>
          {trans("If you have any questions, please contact support via WhatsApp:")}
        </Text>
        <Text
          style={[
            typographies(colors).montserratNormal12,
            { color: colors.primary, lineHeight: rs(20) },
          ]}>
          https://wa.me/5218135512717
        </Text>
      </View>
      <View
        style={[globalStyles.flexShrink1, { ...customPadding(25, 10, 10, 10) }]}>
        <ImageBackground
          source={imageLink.onboardingImage3}
          borderRadius={40}
          style={{
            height: `${'100%'}`,
          }}>
          <View style={styles.bottomContainer}>
            <View style={styles.gap}>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigation.goBack()}
                style={styles.backBtn}>
                <ArrowLeftIcon fill={colors.dark} />
              </TouchableOpacity>
              <Button
                text={trans('Next')}
                style={{ width: ` ${'50%'}` }}
                onPress={handleNavigation}
              />
            </View>
            <View style={styles.slideContainer}>
              <View style={styles.slideRight} />
            </View>
          </View>
        </ImageBackground>
      </View>
    </Container>
  );
};

export default Step2;
