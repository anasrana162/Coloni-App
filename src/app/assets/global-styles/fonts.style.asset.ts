import {Platform} from 'react-native';

export const fonts = {
  montserrat400: 'Montserrat-400',
  montserrat500: 'Montserrat-500',
  montserrat600: 'Montserrat-600',
  montserrat700: 'Montserrat-700',
  raleway400: 'Raleway-400',
  raleway500: 'Raleway-500',
  raleway600: 'Raleway-600',
  raleway700: 'Raleway-700',
};

export const fws = {
  montserrat400: Platform.OS === 'android' ? '400' : 400,
  montserrat500: Platform.OS === 'android' ? '500' : 500,
  montserrat600: Platform.OS === 'android' ? '600' : 600,
  montserrat700: Platform.OS === 'android' ? '700' : 700,
  raleway400: Platform.OS === 'android' ? '400' : 400,
  raleway500: Platform.OS === 'android' ? '500' : 500,
  raleway600: Platform.OS === 'android' ? '600' : 600,
  raleway700: Platform.OS === 'android' ? '700' : 700,
};
