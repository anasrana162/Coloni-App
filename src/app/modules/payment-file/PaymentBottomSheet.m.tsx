import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTranslation} from 'react-i18next';
import Badge from '../../components/app/Badge.app';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import BottomSheetHeader from '../../components/app/BottomSheetHeader.app';
import {colors} from '../../assets/global-styles/color.assets';

interface props {
  title: string;
  body?: string;
  onPress?: () => void;
}

const PaymentBottomSheet: React.FC<props> = ({title, body, onPress}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  return (
    <View style={styles.container}>
      <BottomSheetHeader title={title} />
      <Text style={styles.body}>{body}</Text>
      <View
        style={[
          globalStyles.flexRow,
          {width: '90%', marginTop: rs(10), marginBottom: rs(15)},
        ]}>
        <Badge
          onPress={() => global.showBottomSheet({flag: false})}
          text={trans('Okay')}
          onPress={() => {
            global.showBottomSheet({flag: false});
            onPress && onPress();
          }}
          style={{flexGrow: 1 / 2, width: '48%', borderRadius: rs(10)}}
          bgColor={colors.light}
          textColor={colors.black}
        />
        <Badge
          text={trans('No')}
          textColor={colors.black}
          bgColor={colors.gray3}
          onPress={() => {
            global.showBottomSheet({flag: false});
            onPress && onPress();
          }}
          style={{flexGrow: 1 / 2, width: '48%', borderRadius: rs(10)}}
        />
      </View>
    </View>
  );
};

export default PaymentBottomSheet;
const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  body: {
    ...typographies(colors).ralewayMedium12,
    color: colors.light,
    marginTop: rs(8),
    textAlign: 'center',
  },
});
