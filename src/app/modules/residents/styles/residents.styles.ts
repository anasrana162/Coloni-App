import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get("screen")
import {
  customMargin,
  customPadding,
} from './../../../assets/global-styles/global.style.asset';
import { colors } from '../../../assets/global-styles/color.assets';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
export const residentsStyles = StyleSheet.create({
  middleContainer: {
    flexDirection: 'row',
    gap: rs(10),
    width: `${'95%'}`,
    alignSelf: 'center',
    marginTop: rs(14),
  },
  lowerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    ...customMargin(22),
    ...customPadding(0, 0, 8),
  },
  listMainCont: {
    width: width - 40,
    // height: 100,
    // backgroundColor: colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  },
  listHeader: {
    width: "100%",
    // height: 100,
    backgroundColor: colors.tertiary,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    borderRadius:5,
    marginBottom: 10
  },
  listHeaderTitle: {
    ...typographies(colors).ralewayBold15,
    color: colors.white,
  }
});
