import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import BottomSheetHeader from '../../../components/app/BottomSheetHeader.app';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../../assets/global-styles/global.style.asset';
import Badge from '../../../components/app/Badge.app';
import OnlyTextInput from '../../../components/core/text-input/OnlyTextInput.core';
import CalenderIcon from '../../../assets/icons/Calender.icon';
import {momentTimezone} from '../../../packages/momentTimezone.package';
import NoteIcon from '../../../assets/images/svg/noteIcon.svg';

interface PartialProps {
  data?: any;
  onConfirm: void;
}
const PartialPaymentBottomSheet: React.FC<PartialProps> = ({
  data = [],
  onConfirm = (amount: number, date: string) => {},
}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const [total, setTotal] = useState(0); 
  const [favor, setFavor] = useState(false); 
  const [isChange, setIsChange] = useState(false); 

  const performCalculation = (number: number) => {
    if (isNaN(number)) {
      setTotal(data?.amount);
    } else {
      setTotal(data?.amount - number);
    }
  };

  useEffect(() => {
    if (total > 0) {
      setIsChange(true);
    }
  }, [total]);

  return (
    <View style={{alignItems: 'center'}}>
      <BottomSheetHeader title={trans('Partial Payment')} />
      <Text
        style={[
          typographies(colors).ralewayMedium12,
          {color: colors.light, marginTop: rs(8)},
        ]}>
        {trans('Partial Payment Amount')}
      </Text>
      <OnlyTextInput
        style={{width: '95%', marginVertical: rs(10)}}
        placeholder={`${data?.amount}`}
        onChangeText={txt => performCalculation(parseInt(txt))}
      />
      <Text
        style={[
          typographies(colors).ralewaySemibold14,
          {marginTop: rs(2), color: colors.primary},
        ]}>
        {trans('New Balance {{x}}', {
          x: `$ ${total !== 0 ? total : data?.amount}`,
        })}
      </Text>
      <View
        style={[
          globalStyles.flexRow,
          {width: '90%', alignItems: 'flex-start', marginTop: rs(16)},
        ]}>
        <CalenderIcon height={rs(12)} width={rs(14)} />
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.primary},
          ]}>
          {trans('Payment Date: {{x}}', {
            x: momentTimezone().format('DD-MM-YYYY'),
          })}
        </Text>
      </View>
      <View
        style={[
          globalStyles.flexRow,
          {width: '90%', alignItems: 'flex-start', marginTop: rs(7)},
        ]}>
        <NoteIcon />
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.primary},
          ]}>
          {trans('Review Note')}
        </Text>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.primary},
          ]}>
          {data?.note}
        </Text>
      </View>
      <View
        style={[
          globalStyles.flexRow,
          {width: '90%', marginTop: rs(13), marginBottom: rs(15)},
        ]}>
        <Badge
          onPress={() => global.showBottomSheet({flag: false})}
          text={trans('Cancel')}
          style={{flexGrow: 1 / 2, width: '48%', borderRadius: rs(10)}}
          bgColor={colors.gray3}
          textColor={colors.black}
        />
        <Badge
          text={trans('Ok')}
          disabled={!isChange}
          onPress={() => {
            onConfirm(total, momentTimezone().format('YYYY-MM-DD'));
            global.showBottomSheet({flag: false});
          }}
          style={{flexGrow: 1 / 2, width: '48%', borderRadius: rs(10)}}
        />
      </View>
    </View>
  );
};

export default PartialPaymentBottomSheet;
