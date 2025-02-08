import {customPadding} from './../../../assets/global-styles/global.style.asset';
import {StyleSheet} from 'react-native';
import {colors} from '../../../assets/global-styles/color.assets';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
export const activeDevicesStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    ...customPadding(6, 12, 6, 12),
    flexDirection: 'row',
    gap: rs(10),
    alignItems: 'center',
  },
  topLefText: {
    color: colors.white,
    flexGrow: 1 / 2,
    alignSelf: 'flex-start',
  },
  eachItemContainer: {
    ...customPadding(4),
    flexDirection: 'row',
    gap: rs(10),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5,
  },
  eachItemLeftContainer: {
    flexGrow: 1 / 2,
    flexDirection: 'row',
    gap: rs(8),
    alignItems: 'center',
  },
  eachItemRightContainer: {
    flexGrow: 1 / 2,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: rs(8),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
