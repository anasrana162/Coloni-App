import {View, Text, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import AdministratorIcon from '../../assets/images/svg/adminstratorIcon.svg';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import {useTranslation} from 'react-i18next';


const MassiveChargesItem: React.FC<{
  onPress?: () => void;
  style?: ViewStyle;
  data: any;
}> = ({style, onPress, data}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        globalStyles.flexRow,
        shadow(colors).shadow,
        {
          // ...customPadding(20, 12, 11, 20),
          padding: 15,
          backgroundColor: colors.graySoft,
          borderRadius: rs(25),
          gap: rs(18),
          marginBottom: rs(15),
        },
        style,
      ]}>
      <View
        style={[
          globalStyles.justifyAlignCenter,
          shadow(colors).shadow,
          {
            height: rs(40),
            width: rs(40),
            borderRadius: rs(40),
            backgroundColor: colors.primary,
          },
        ]}>
        <AdministratorIcon />
      </View>
      <View>
        <Text
          style={[typographies(colors).ralewayBold12, {color: colors.primary}]}>
          {data?.paymentType?.name}
        </Text>
        <Text
          style={[
            typographies(colors).montserratSemibold,
            {color: colors.gray3, lineHeight: rs(17), fontSize: 12},
          ]}>
          {moment(data?.updatedAt).format('MMMM YYYY')}
        </Text>
        <Text
          style={[
            typographies(colors).montserratNormal8,
            {color: colors.gray9, lineHeight: rs(17)},
          ]}>
          {trans('Added Date:')} {moment(data?.createdAt).format('DD/MM/YYYY')}
        </Text>
        <Text
          style={[
            typographies(colors).montserratNormal8,
            {color: colors.gray9, lineHeight: rs(17)},
          ]}>
          {trans('Expiration Date:')} {moment(data?.dueDate).format('DD/MM/YYYY')}
        </Text>

      </View>
      <Text
        style={[
          typographies(colors).ralewayBold12,
          {color: colors.gray3, position: 'absolute', right: 20},
        ]}>
        ${data?.amount}
      </Text>
    </TouchableOpacity>
  );
};

export default MassiveChargesItem;
