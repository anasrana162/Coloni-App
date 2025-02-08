import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import BottomSheetHeader from '../../../components/app/BottomSheetHeader.app';
import {useTranslation} from 'react-i18next';
import CalenderIcon from '../../../assets/icons/Calender.icon';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import {useTheme} from '@react-navigation/native';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import MessageToSendBottomSheet from './MessageToSend.bottomSheet';
const NotifyBottomSheet: React.FC<{
  onTextChange: () => void;
}> = ({onTextChange = (txt: string) => {}}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  return (
    <>
      <BottomSheetHeader title={trans('Message To Send')} />
      <View style={{gap: rs(14), ...customPadding(10, 20, 30, 20)}}>
        <TouchableOpacity
          style={[globalStyles.flexRow, {gap: rs(7)}]}
          activeOpacity={0.7}
          onPress={() => {
            global.showBottomSheet({
              flag: true,
              component: MessageToSendBottomSheet,
              componentProps: {
                onTextChange: (txt: string) => {
                  console.log('TXT RECEIVED at notify.bottomsheet', txt);
                  onTextChange(txt); // Call the prop function
                },
              },
            });
          }}>
          <CalenderIcon height={rs(6)} width={rs(6)} />
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary},
            ]}>
            {trans('Only Overdue Debts')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.flexRow, {gap: rs(7)}]}
          onPress={() => {
            global.showBottomSheet({
              flag: true,
              component: MessageToSendBottomSheet,
              componentProps: {
                onTextChange: (txt: string) => {
                  console.log('TXT RECEIVED at notify.bottomsheet', txt);
                  onTextChange(txt); // Call the prop function
                },
              },
            });
          }}
          activeOpacity={0.7}>
          <CalenderIcon height={rs(6)} width={rs(6)} />
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary},
            ]}>
            {trans('Overdue Debts Not Overdue ')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default NotifyBottomSheet;
