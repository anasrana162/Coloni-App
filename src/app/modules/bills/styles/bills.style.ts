import {StyleSheet} from 'react-native';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {customPadding} from '../../../assets/global-styles/global.style.asset';
import {colors} from '../../../assets/global-styles/color.assets';
export const billsStyles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(9),
    marginTop: rs(14),
    flex: 1,
    marginBottom: 10,
    // ...customPadding(0, 10, 35, 10),
  },
  flexGrow5: {flexGrow: 0.5, minWidth: '50%', maxWidth: '50%'},
  middleContainer: {
    flexDirection: 'row',
    gap: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 7,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  rightContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingLeft: rs(9),
  },
  middleBadgeContainer: {
    flexDirection: 'row',
    gap: 7,
    flexShrink: 1,
    flexGrow: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 8,
    flexShrink: 1,
    paddingHorizontal: rs(9),
    justifyContent: 'space-between',
  },
  flexGrow2: {flexGrow: 0.2},
});
