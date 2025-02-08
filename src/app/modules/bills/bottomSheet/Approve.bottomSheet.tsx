import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {useTranslation} from 'react-i18next';
import Badge from '../../../components/app/Badge.app';
import {globalStyles} from '../../../assets/global-styles/global.style.asset';
import BottomSheetHeader from '../../../components/app/BottomSheetHeader.app';

interface props {
  title: string;
  body?: string;
  onPress?: () => void;
}

const ApproveBottomSheet: React.FC<props> = ({title, body, onPress}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  return (
    <View style={{alignItems: 'center'}}>
      <BottomSheetHeader title={title} />
      <Text
        style={[
          typographies(colors).ralewayMedium12,
          {color: colors.light, marginTop: rs(8), textAlign: 'center'},
        ]}>
        {body}
      </Text>
      <View
        style={[
          globalStyles.flexRow,
          {width: '90%', marginTop: rs(10), marginBottom: rs(15)},
        ]}>
        <Badge
          onPress={() => global.showBottomSheet({flag: false})}
          text={trans('No')}
          style={{flexGrow: 1 / 2, width: '48%', borderRadius: rs(10)}}
          bgColor={colors.gray3}
          textColor={colors.black}
        />
        <Badge
          text={trans('Confirm')}
          textColor={colors.black}
          bgColor={colors.light}
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

export default ApproveBottomSheet;