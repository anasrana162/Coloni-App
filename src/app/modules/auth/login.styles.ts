import {customMargin} from '../../assets/global-styles/global.style.asset';
import {StyleSheet} from 'react-native';
export const loginStyles = StyleSheet.create({
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...customMargin(10, 0, 23),
  },
  innerContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
