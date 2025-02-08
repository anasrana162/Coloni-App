import { StyleSheet } from 'react-native';
import { fonts } from './fonts.style.asset';
import rs from './responsiveSze.style.asset';
import { getHexaOpacityColorCode } from '../../utilities/helper';

const typographies = (colors: any) =>
  StyleSheet.create({
    ralewayBold: {
      fontFamily: fonts.raleway700,
      color: colors?.black,
      fontSize: rs(16),
    },

    ralewayMedium08: {
      fontFamily: fonts.raleway600,
      color: colors?.black,
      fontSize: rs(8),
    },
    ralewayBold12black: {
      fontFamily: fonts.raleway700,
      color: colors?.black,
      fontSize: rs(12),
    },
    ralewayBold15: {
      fontFamily: fonts.raleway700,
      color: colors?.primaryText,
      fontSize: rs(15),
    },
    ralewayBold10: {
      fontFamily: fonts.raleway700,
      color: colors?.primary,
      fontSize: rs(10),
    },
    ralewayBold12: {
      fontFamily: fonts.raleway700,
      color: colors?.primary,
      fontSize: rs(12),
    },
    ralewayBold18: {
      fontFamily: fonts.raleway700,
      color: colors?.primary,
      fontSize: rs(18),
    },
    ralewayNormal09: {
      fontFamily: fonts.raleway400,
      color: colors?.white,
      fontSize: rs(9),
    },
    ralewayNormal20: {
      fontFamily: fonts.raleway400,
      color: colors?.white,
      fontSize: rs(18),
    },
    montserratSemibold25: {
      fontFamily: fonts.montserrat600,
      color: colors?.black,
      fontSize: rs(25),
    },
    montserratMedium25: {
      fontFamily: fonts.montserrat500,
      color: colors?.black,
      fontSize: rs(25),
    },
    montserratMedium13: {
      fontFamily: fonts.montserrat500,
      color: colors?.black,
      fontSize: rs(13),
    },
    montserratMedium10: {
      fontFamily: fonts.montserrat500,
      color: colors?.primary,
      fontSize: rs(10),
    },
    montserratMedium17: {
      fontFamily: fonts.montserrat500,
      color: colors?.primary,
      fontSize: rs(17),
    },
    ralewayMedium12: {
      fontFamily: fonts.raleway500,
      color: colors?.black,
      fontSize: rs(12),
    },
    ralewayMediumD: {
      fontFamily: fonts.raleway500,
      color: colors?.primaryText,
      fontSize: rs(12),
    },
    ralewayNormal32: {
      fontFamily: fonts.raleway400,
      color: colors?.white,
      fontSize: rs(32),
    },
    ralewayNormal14: {
      fontFamily: fonts.raleway400,
      color: colors?.white,
      fontSize: rs(14),
    },
    ralewayMedium21: {
      fontFamily: fonts.raleway500,
      color: getHexaOpacityColorCode(colors?.white, 0.66),
      fontSize: rs(21),
    },
    ralewayMedium14: {
      fontFamily: fonts.raleway500,
      color: colors?.black,
      fontSize: rs(14),
    },
    ralewayMedium10: {
      fontFamily: fonts.raleway500,
      color: colors?.primary,
      fontSize: rs(10),
    },
    ralewayNormal12: {
      fontFamily: fonts.raleway400,
      color: colors?.white,
      fontSize: rs(12),
    },
    ralewaySemibold8: {
      fontFamily: fonts.raleway600,
      color: colors?.black,
      fontSize: rs(8),
    },
    ralewaySemibold10: {
      fontFamily: fonts.raleway600,
      color: colors?.black,
      fontSize: rs(10),
    },
    ralewaySemibold12: {
      fontFamily: fonts.raleway600,
      color: colors?.black,
      fontSize: rs(12),
    },
    ralewaySemibold14: {
      fontFamily: fonts.raleway600,
      color: colors?.black,
      fontSize: rs(14),
    },
    ralewaySemibold20: {
      fontFamily: fonts.raleway600,
      color: colors?.white,
      fontSize: rs(20),
    },
    montserratSemibold: {
      fontFamily: fonts.montserrat600,
      color: colors?.primary,
      fontSize: rs(16),
    },
    montserratNormal12: {
      fontFamily: fonts.montserrat500,
      color: colors?.black,
      fontSize: rs(12),
    },
    montserratNormal16: {
      fontFamily: fonts.montserrat400,
      color: colors?.black,
      fontSize: rs(16),
    },
    montserratNormal18: {
      fontFamily: fonts.montserrat400,
      color: colors?.black,
      fontSize: rs(18),
    },
    montserratNormal8: {
      fontFamily: fonts.montserrat400,
      color: colors?.gray3,
      fontSize: rs(8),
    },
    montserratNormal10: {
      fontFamily: fonts.montserrat400,
      color: colors?.gray3,
      fontSize: rs(10),
    },
    montserratSemibold16: {
      fontFamily: fonts.montserrat600,
      color: colors?.white,
      fontSize: rs(16),
      textAlign: 'center',
    },
    montserratSemibold22: {
      fontFamily: fonts.montserrat600,
      color: colors?.white,
      fontSize: rs(22),
      textAlign: 'center',
    },
  });

export { typographies };
