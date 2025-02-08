import {Dimensions, StatusBar} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const userRoles = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'Administrator',
  VIGILANT: 'Vigilant',
  RESIDENT: 'Resident',
};
export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  STATUS_BAR_HEIGHT,
  userRoles,
};
