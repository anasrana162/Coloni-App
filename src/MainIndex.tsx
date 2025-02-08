import React, {useEffect} from 'react';
import {CustomSafeAreaProvider} from './app/packages/safeAreaContext.package';
import {CustomNavigationContainer} from './app/packages/navigation.package';
import RouterIndex from './app/routes/RootRoute.route';
import BottomSheetIndex from './app/components/bottom-sheet/BottomSheetIndex';
import {themeStates} from './app/state/allSelector.state';
import {customUseSelector} from './app/packages/redux.package';
import {darkTheme} from './app/assets/global-styles/darkTheme.assets';
import {lightTheme} from './app/assets/global-styles/lightTheme.assets';
import {AppProvider} from './app/wrappers/AppWrapper';
import FlashMessage from 'react-native-flash-message';
import {typographies} from './app/assets/global-styles/typography.style.asset';
import rs from './app/assets/global-styles/responsiveSze.style.asset';
import {StatusBar, StyleSheet} from 'react-native';
import {
  requestUserPermission,
  getFCMToken,
  listenForForegroundMessages,
} from './app/services/features/notifications/notifications.service';
const MainIndex = () => {
  const {theme = ''} = customUseSelector(themeStates) || {};
  useEffect(() => {
    const initNotification = async () => {
      await requestUserPermission();
      await getFCMToken();
      const unsubscribe = listenForForegroundMessages();

      // Cleanup subscription on unmount
      return () => unsubscribe();
    };

    initNotification();
  }, []);
  return (
    <CustomSafeAreaProvider>
      <CustomNavigationContainer
        theme={theme === 'dark' ? darkTheme : lightTheme}>
        <AppProvider>
          <StatusBar
            barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          />
          <RouterIndex />
          <BottomSheetIndex />
          <FlashMessage
            position="bottom"
            style={[
              styles.container,
              {
                backgroundColor:
                  theme === 'dark'
                    ? (darkTheme as any).colors.gray2
                    : (lightTheme as any).colors.gray2,
              },
            ]}
            floating={true}
            titleStyle={[
              typographies(theme === 'dark' ? darkTheme : lightTheme)
                .ralewayMedium14,
              styles.text,
              {
                color:
                  theme === 'dark'
                    ? (darkTheme as any).colors.black
                    : (lightTheme as any).colors.black,
              },
            ]}
            hideOnPress={true}
            animated={true}
          />
        </AppProvider>
      </CustomNavigationContainer>
    </CustomSafeAreaProvider>
  );
};
export default MainIndex;

const styles = StyleSheet.create({
  container: {
    borderRadius: rs(500),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: rs(20),
    paddingVertical: rs(12),
  },
  text: {textAlign: 'center'},
});
