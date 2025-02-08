import {StyleSheet} from 'react-native';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
export const registrationExpensesStyles = StyleSheet.create({
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  middleTextContainer: {flexDirection: 'row', gap: 8, alignItems: 'center'},
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: rs(60),
  },
  center: {alignItems: 'center'},
});
