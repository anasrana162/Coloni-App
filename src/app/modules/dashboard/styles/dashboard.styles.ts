import {StyleSheet} from 'react-native';
import {STATUS_BAR_HEIGHT} from '../../../assets/ts/core.data';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../../assets/global-styles/color.assets';
import {customPadding} from '../../../assets/global-styles/global.style.asset';
export const dashboardStyles = StyleSheet.create({
  circle: {position: 'absolute', top: 0, left: 0},
  scrollView:{ backgroundColor: colors.white},
  header: {
    marginTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: rs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    marginTop: rs(40),
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: colors.white,
    height: rs(50),
    width: rs(50),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    ...customPadding(26, 36, 0, 36),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    ...customPadding(0, 24, 7, 24),
    borderRadius: 10,
  },
  statIcon: {
    height: rs(56),
    width: rs(56),
    borderWidth: 1,
    borderColor: colors.active,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rs(-25),
  },
});
