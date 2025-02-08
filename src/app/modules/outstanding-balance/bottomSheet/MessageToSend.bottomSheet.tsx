import {View, Text} from 'react-native';
import React, {useState} from 'react';
import BottomSheetHeader from '../../../components/app/BottomSheetHeader.app';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import Badge from '../../../components/app/Badge.app';
import MultiLineInput from '../../../components/core/text-input/MultiLineInput.core.component';
const MessageToSendBottomSheet: React.FC<{onTextChange: () => void}> = ({
  onTextChange = (txt: string) => {},
}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const [message, setMessage] = useState(
    'Neighbor ${resident}, has ${totalPendingExpireAmount} pending payments. We hope to have your support soon.',
  );
  return (
    <>
      <BottomSheetHeader title={trans('Message To Send')} />
      <View
        style={{
          width: `${'95%'}`,
          alignSelf: `${'center'}`,
          paddingBottom: rs(10),
        }}>
        <MultiLineInput
          placeholder={trans(
            'Neighbor ${residentName}, has ${pendingPayments} pending payments. We hope to have your support soon.',
          )}
          style={{marginBottom: rs(10)}}
          name="description"
          onChangeText={txt => {
            setMessage(txt);
          }}
          defaultValue={message}
          // defaultValue={values.current?.description}
        />
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {
              color: colors.error1,
              marginBottom: 10,
              width: '95%',
            },
          ]}>
          {trans(
            'Do not remove these values ${resident} ${totalPendingExpireAmount} when modifying ',
          )}
        </Text>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.gray3, marginLeft: rs(5)},
          ]}>
          {trans('This message will be send to 5 residents.')}
        </Text>
        <View style={[globalStyles.flexRow, {marginTop: rs(9)}]}>
          <Badge
            text={trans('Cancel')}
            style={{
              borderRadius: rs(10),
              flexGrow: 1 / 2,
              width: `${'48%'}`,
            }}
            textColor={colors.dark}
            bgColor={colors.gray3}
            onPress={() => global.showBottomSheet({flag: false})}
          />
          <Badge
            text={trans('Accept')}
            style={{
              borderRadius: rs(10),
              flexGrow: 1 / 2,
              width: `${'48%'}`,
            }}
            onPress={() => {
              onTextChange(message);
              global.showBottomSheet({flag: false});
            }}
            textColor={colors.dark}
            bgColor={colors.light}
          />
        </View>
      </View>
    </>
  );
};

export default MessageToSendBottomSheet;
