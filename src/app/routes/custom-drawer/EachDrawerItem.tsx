import React, {FC} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {getHexaOpacityColorCode} from '../../utilities/helper';
interface props {
  onPress?: () => void;
  Icon: any;
  title: string;
  style?: ViewStyle;
  Component?: any;
}

const EachDrawerItem: FC<props> = ({
  Icon,
  title,
  onPress,
  style,
  Component,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, globalStyles.rowBetween, style]}
      onPress={onPress}
      activeOpacity={0.6}>
      <View style={[globalStyles.flexRow, {gap: rs(12)}]}>
        <View>{<Icon fill={colors.white} />}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {Component && <Component />}
    </TouchableOpacity>
  );
};
export default EachDrawerItem;

export const styles = StyleSheet.create({
  container: {
    ...customPadding(8, 12, 8, 9),
    gap: rs(12),
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    borderBottomColor: getHexaOpacityColorCode(colors.white, 0.5),
    borderBottomWidth: 1,
    ...customPadding(10, 10, 10, 10),
    marginHorizontal: 5,
  },
  title: {
    ...typographies(colors).montserratMedium13,
    color: colors.white,
  },
});
