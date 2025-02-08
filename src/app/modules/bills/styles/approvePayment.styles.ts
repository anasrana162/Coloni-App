import {StyleSheet} from 'react-native';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset'; 
import {colors} from '../../../assets/global-styles/color.assets'; 

export const approvePaymentStyles = StyleSheet.create({
  date: {textTransform: 'uppercase', textAlign: 'center', marginTop: rs(15)},
  bottomContainer: {flexDirection: 'row', gap: 8, marginTop: rs(15)},
  row: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  
  blueText: {
    ...typographies(colors).montserratMedium13,
    color: colors.primary,
  },
  
  lightText: {
    ...typographies(colors).montserratMedium13,
    color: colors.gray1,
  },
});
