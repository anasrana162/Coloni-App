import {StyleSheet} from 'react-native';
import {customPadding} from '../../../assets/global-styles/global.style.asset';
import {getHexaOpacityColorCode} from '../../../utilities/helper';
import {colors} from '../../../assets/global-styles/color.assets';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';

export const callPreviewStyles = StyleSheet.create({
  topContainer: {
    ...customPadding(96),
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: rs(35),
  },
  bottomTab: {
    backgroundColor: getHexaOpacityColorCode(colors.white, 0.5),
    height: rs(4),
    width: rs(32),
    borderRadius: 30,
    alignSelf: 'center',
  },
  bottomMiddleCont: {
    ...customPadding(28, 0, 41),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignSelf: 'center',
  },
  center: {alignItems: 'center'},
  icon: {
    height: rs(50),
    width: rs(50),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: getHexaOpacityColorCode(colors.white, 0.16),
  },
  speaker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    gap: 5,
    ...customPadding(13, 0, 13),
    borderRadius: 50,
  },
});
