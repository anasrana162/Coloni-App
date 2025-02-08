import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import AdministratorIcon from '../../assets/images/svg/adminstratorIcon.svg';
import DevicesIcon from '../../assets/images/svg/devicesIcon.svg';
import ConnectionIcon from '../../assets/images/svg/connectioncon.svg';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { colors } from '../../assets/global-styles/color.assets';

const ResidentItem: React.FC<{
  onPress?: () => void;
  item: any;
  style?: ViewStyle;
}> = ({ style, onPress, item }) => {
  const { t: trans } = useTranslation();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        globalStyles.flexRow,
        shadow(colors).shadow,
        {
          ...customPadding(20, 12, 11, 20),
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
      <View style={[globalStyles.rowBetween, globalStyles.flexGrow1]}>
        <View style={{ width: '60%', height: '100%' }}>
          {item?.role == 'Resident' && (
            <Text style={typographies(colors).ralewayBold12} numberOfLines={1}>
              {item?.street?.name} {item?.home}
            </Text>
          )}
          {item?.role !== 'Resident' && (
            <Text
              style={[
                typographies(colors).ralewayBold12,
                { color: colors.primary },
              ]}>
              {trans(item?.role)}
            </Text>
          )}
          {item?.role == 'Resident' && (
            <Text
              numberOfLines={1}
              style={[
                typographies(colors).ralewayBold,
                { color: colors.black, fontSize: 8 },
              ]}>
              {item?.name}
            </Text>
          )}
          <View style={[globalStyles.flexRow, { marginTop: rs(5) }]}>
            <DevicesIcon />
            <Text
              style={[
                typographies(colors).montserratNormal8,
                { color: colors.gray9 },
              ]}>
              {trans('Active Devices')} {item?.maxDevices}
            </Text>
          </View>
          <View style={[globalStyles.flexRow, { marginTop: rs(4) }]}>
            {item?.role !== 'Resident' && <ConnectionIcon />}
            <Text
              style={[
                typographies(colors).montserratNormal8,
                { color: colors.gray9 },
              ]}>
              {item?.role == 'Resident'
                ? moment(item?.createdAt).format('DD/MM/YYYY')
                : `${trans('Last access')} : ${moment(item?.lastAccess).format(
                  'DD/MM/YYYY',
                )}`}
            </Text>
          </View>
        </View>
        <Text
          style={[
            typographies(colors).montserratNormal8,
            { color: colors.grayDark, position: 'absolute', right: 10 },
          ]}>
          {item?.clue} {'>'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ResidentItem;
