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
import {momentTimezone} from '../../../packages/momentTimezone.package';
import CustomSwitch from '../../../components/core/CustomSwitch.core.component';


interface BalanceInFavorProps {
  data?: any;
  onConfirm: void;
}


const BalanceInFavorBottomSheet: React.FC<BalanceInFavorProps> = ({
  data = [],
  onConfirm = (amount: number, date: string, isFavor: boolean) => {},
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
      <BottomSheetHeader title={trans('Balance in Favor')} />
      <OnlyTextInput
        style={{width: '95%', marginTop: rs(10)}}
        placeholder={data?.amount?.toString()}
        onChangeText={txt => performCalculation(parseInt(txt))}
      />
      <Text
        style={[
          typographies(colors).ralewayMedium10,
          {color: colors.light, width: '95%'},
        ]}>
        {trans('Received {{x}} on {{y}}', {
          x: `${data?.amount}`,
          y: momentTimezone(data?.updatedAt).format('DD-MM-YYYY'),
        })}
      </Text>
      <View
        style={[
          globalStyles.flexRow,
          {width: '95%', justifyContent: 'space-between', marginTop: rs(10)},
        ]}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            {color: colors.gray3, lineHeight: rs(20)},
          ]}>
          {trans('Balance in Favor')}
        </Text>
        <CustomSwitch onPress={() => setFavor(!favor)} />
      </View>
      <Text
        style={[
          typographies(colors).ralewayMedium10,
          {color: colors.primary, width: '95%', lineHeight: rs(20)},
        ]}>
        {trans('Balance in favor, will not be applied to a specific fee/time')}
      </Text>
      <View
        style={{
          width: '95%',
          borderRadius: rs(20),
          borderWidth: rs(1),
          borderColor: colors.gray3,
          marginTop: rs(7),
        }}>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.primary, lineHeight: rs(20), textAlign: 'center'},
          ]}>
          {trans('There is no documents applied yet')}
        </Text>
      </View>
      <View
        style={[
          globalStyles.flexRow,
          {width: '95%', justifyContent: 'space-between'},
        ]}>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.gray3, lineHeight: rs(20)},
          ]}>
          {trans('Total')}
        </Text>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.gray3, lineHeight: rs(20)},
          ]}>
          {trans('{{x}}', {x: total !== 0 ? total : data?.amount})}
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
            onConfirm(total, momentTimezone().format('YYYY-MM-DD'), favor);
            global.showBottomSheet({flag: false});
          }}
          textColor={colors.black}
          style={{flexGrow: 1 / 2, width: '48%', borderRadius: rs(10)}}
        />
      </View>
    </View>
  );
};

export default BalanceInFavorBottomSheet;
