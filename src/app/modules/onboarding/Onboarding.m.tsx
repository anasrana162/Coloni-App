import {ImageBackground, View, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import imageLink from '../../assets/images/imageLink';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../assets/ts/core.data';
import Button from '../../components/core/button/Button.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {customUseSelector} from '../../packages/redux.package';
import {themeStates} from '../../state/allSelector.state';

const Onboarding: React.FC = () => {
  const navigation = useCustomNavigation();
  const {theme} = customUseSelector(themeStates);
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  return (
    <Container
      showHeader={false}
      bottomTab={false}
      barStyle={theme === 'dark' ? 'dark-content' : 'light-content'}>
      <StatusBar
        barStyle={theme ? 'light-content' : 'dark-content'}
        backgroundColor={colors.transparent}
      />
      <ImageBackground
        source={imageLink.background}
        style={[
          globalStyles.flex1,
          {width: SCREEN_WIDTH, height: SCREEN_HEIGHT},
        ]}
        resizeMode="cover">
        <View style={styles.container}>
          <ImagePreview
            source={imageLink.whiteLogo}
            styles={{width: rs(247), height: rs(60)}}
          />
          <Button
            text={trans("let's start")}
            style={styles.width}
            onPress={() => navigation.navigate(screens.language as never)}
          />
        </View>
      </ImageBackground>
    </Container>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: '40%',
    marginBottom: '20%',
    justifyContent: 'space-between',
    flex: 1,
  },
  width: {
    width: '50%',
  },
});
