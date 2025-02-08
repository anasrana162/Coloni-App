import {StyleSheet} from 'react-native';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../../assets/global-styles/color.assets';
import {
  customPadding,
  customMargin,
} from '../../../assets/global-styles/global.style.asset';
export const chatStyles = StyleSheet.create({
  flexEnd: {alignSelf: 'flex-end'},
  rightText: {
    ...customPadding(10, 15, 10, 15),
    borderBottomRightRadius: rs(12),
    borderTopRightRadius: rs(0),
    borderTopLeftRadius: rs(12),
    borderBottomLeftRadius: rs(12),
    backgroundColor: colors.darkBlue,
    color: colors.white,
    ...customMargin(12, 20, 0, 10),
    lineHeight: rs(20),
  },
  leftContainer: {
    flexDirection: 'row',
    gap: rs(12),
    flexShrink: 1,
    alignSelf: 'flex-start',
  },
  leftText: {
    ...customPadding(10, 15, 10, 15),
    borderBottomRightRadius: rs(12),
    borderTopRightRadius: rs(12),
    borderTopLeftRadius: rs(0),
    borderBottomLeftRadius: rs(12),
    backgroundColor: colors.primary,
    color: colors.white,
    ...customMargin(12, 20, 0, 10),
    lineHeight: rs(20),
  },
});
