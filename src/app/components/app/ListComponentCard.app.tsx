import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import {colors} from '../../assets/global-styles/color.assets';
import {useCustomNavigation} from '../../packages/navigation.package';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import { useTranslation } from 'react-i18next';

interface props {
  item: {
    title: string;
    description?: string;
    name: string;
  };
}
const ListComponentCard: React.FC<props> = ({
  item: {title, description, name} = {title: '', description: '', name: ''},
}) => {
  const navigation = useCustomNavigation();
  const { t: trans } = useTranslation();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate(name as never)}
      style={[
        globalStyles.rowBetween,
        shadow(colors).bottomBorder,
        {marginHorizontal: rs(5), ...customPadding(10, 10, 8, 10)},
      ]}>
      <View style={globalStyles.flexShrink1}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            {color: colors.primary},
          ]}>
            {trans(title)}
        </Text>
        {description && (
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.gray3, marginTop: rs(5)},
            ]}>
            {description}
          </Text>
        )}
      </View>
      <View style={{transform: [{rotate: '-90deg'}]}}>
        <DownArrow />
      </View>
    </TouchableOpacity>
  );
};

export default ListComponentCard;
