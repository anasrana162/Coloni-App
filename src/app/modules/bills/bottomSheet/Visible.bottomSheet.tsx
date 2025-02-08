import {View, Text} from 'react-native';
import React from 'react';
import Badge from '../../../components/app/Badge.app';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const VisibleBottomSheet = () => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();

  return (
    <View style={{...customPadding(5, 15, 15, 15)}}>
      <Text
        style={[
          typographies(colors).montserratSemibold16,
          {color: colors.primary, textAlign: 'center', lineHeight: rs(40)},
        ]}>
        {trans('Bills')}
      </Text>
      <Text
        style={[
          typographies(colors).ralewayMedium14,
          {
            color: colors.primary,
            textAlign: 'center',
            lineHeight: rs(20),
            marginBottom: rs(12),
          },
        ]}>
        {trans('Do you confirm the activation of expenses?')}
      </Text>
      <View style={globalStyles.flexRow}>
        <Badge
          text="No"
          style={{width: `${'48.5%'}`, flexGrow: 1 / 2, borderRadius: rs(10)}}
          textColor={colors.black}
          onPress={() => global.showBottomSheet({flag: false})}
        />
        <Badge
          text="Confirm"
          style={{width: `${'48.5%'}`, flexGrow: 1 / 2, borderRadius: rs(10)}}
          textColor={colors.black}
          bgColor={colors.gray3}
          onPress={() => global.showBottomSheet({flag: false})}
        />
      </View>
    </View>
  );
};

export default VisibleBottomSheet;
