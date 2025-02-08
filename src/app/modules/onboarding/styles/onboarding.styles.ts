import {customMargin} from './../../../assets/global-styles/global.style.asset';
import {StyleSheet} from 'react-native';
import {getHexaOpacityColorCode} from '../../../utilities/helper';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
const onboardingStyles = (colors: any) =>
  StyleSheet.create({
    bottomContainer: {
      position: 'absolute',
      bottom: '10%',
      alignItems: 'center',
      width: '100%',
    },
    slideContainer: {
      backgroundColor: getHexaOpacityColorCode(colors.pureWhite, 0.4),
      ...customMargin(25),
      width: '20%',
      height: rs(3),
      borderRadius: 5,
    },
    slide: {
      backgroundColor: colors.pureWhite,
      width: '60%',
      borderRadius: 5,
      height: rs(3),
    },
    slideRight: {
      backgroundColor: colors.pureWhite,
      width: '60%',
      borderRadius: 5,
      height: rs(3),
      alignSelf: 'flex-end',
    },
    backBtn: {
      height: rs(54),
      width: rs(54),
      backgroundColor: colors.pureWhite,
      borderRadius: rs(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    gap: {flexDirection: 'row', gap: 15},
  });

export {onboardingStyles};
