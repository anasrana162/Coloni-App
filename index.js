/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MainIndex from './src/MainIndex';
import {CustomReduxProvider} from './src/app/packages/redux.package';
import store from './src/app/state/store';
import React from 'react';

const ColoniApp = () => (
  <CustomReduxProvider store={store}>
    <MainIndex />
  </CustomReduxProvider>
);
AppRegistry.registerComponent(appName, () => ColoniApp);
