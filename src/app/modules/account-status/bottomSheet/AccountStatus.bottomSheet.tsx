import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Badge from '../../../components/app/Badge.app';
import {globalStyles} from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {SCREEN_WIDTH} from '../../../assets/ts/core.data';
interface props {
  title: string;
  body: string;
  onPress?: () => void;
}
const AccountStatusBottomSheet: React.FC<props> = ({title, body, onPress}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  return (
    <View style={{alignSelf: `${'center'}`, width: SCREEN_WIDTH - 40}}>
      <Text
        style={[
          typographies(colors).montserratSemibold16,
          {color: colors.primary, textAlign: `${'center'}`, lineHeight: rs(40)},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          typographies(colors).ralewayMedium14,
          {
            color: colors.primary,
            textAlign: `${'center'}`,
            lineHeight: rs(20),
          },
        ]}>
        {body}
      </Text>
      <View
        style={[
          globalStyles.flexRow,
          {marginTop: rs(15), marginBottom: rs(15)},
        ]}>
        <Badge
          onPress={() => global.showBottomSheet({flag: false})}
          text={trans('Cancel')}
          style={{flexGrow: 1 / 2, width: `${'48%'}`, borderRadius: rs(10)}}
          bgColor={colors.gray3}
          textColor={colors.black}
        />
        <Badge
          text={trans('Confirm')}
          onPress={() => {
            global.showBottomSheet({flag: false});
            onPress && onPress();
          }}
          textColor={colors.black}
          style={{flexGrow: 1 / 2, width: `${'48%'}`, borderRadius: rs(10)}}
        />
      </View>
    </View>
  );
};

export default AccountStatusBottomSheet;
