import {View, Text, ViewStyle} from 'react-native';
import React from 'react';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import InfoIcon from '../../assets/images/svg/infoIcon.svg';
import {useTheme} from '@react-navigation/native';
interface props {
  title?: string;
  style?: ViewStyle;
  body?: string;
  bgColor?: string;
}
const InfoCard: React.FC<props> = ({title = '', style, bgColor, body}) => {
  const {colors} = useTheme() as any;
  return (
    <View
      style={[
        {
          ...customPadding(9, 9, 9, 9),
          borderRadius: rs(10),
          backgroundColor: bgColor || colors.error4,
          marginBottom: rs(10),
        },
        style,
      ]}>
      <View
        style={[
          globalStyles.flexRow,
          {
            gap: rs(8),
          },
          globalStyles.flexShrink1,
        ]}>
        <InfoIcon height={rs(15)} width={rs(15)} />
        <Text style={[typographies(colors).ralewayMedium12]}>{title}</Text>
      </View>
      {body && (
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.white, marginTop: rs(5), lineHeight: rs(15)},
          ]}>
          {body}
        </Text>
      )}
    </View>
  );
};

export default InfoCard;
