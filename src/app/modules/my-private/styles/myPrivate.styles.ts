import {StyleSheet} from 'react-native';
import {colors} from '../../../assets/global-styles/color.assets';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';

export const myPrivateStyles = StyleSheet.create({
  listBorder: {
    width: '98%',
    alignSelf: 'flex-end',
    height: 1,
    backgroundColor: colors.primary,
    marginVertical: rs(11),
  },
  bottomContainer: {
    flexDirection: 'row',
    gap: rs(6),
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});
