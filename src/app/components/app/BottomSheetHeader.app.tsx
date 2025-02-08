import {View, Text} from 'react-native';
import React from 'react';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
interface props {
  title: string;
}
const BottomSheetHeader: React.FC<props> = ({title}) => {
  const {colors} = useTheme() as any;
  return (
    <View
      style={[globalStyles.flexGrow1, {width: '100%', alignItems: 'center'}]}>
      <Text
        style={[
          typographies(colors).ralewayBold12,
          {color: colors.light, marginBottom: rs(5)},
        ]}>
        {title}
      </Text>
      <View
        style={{
          borderBottomColor: colors.active,
          borderBottomWidth: rs(1),
          width: '95%',
        }}
      />
    </View>
  );
};

export default BottomSheetHeader;
