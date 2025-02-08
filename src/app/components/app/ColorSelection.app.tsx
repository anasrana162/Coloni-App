import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colorsArray} from '../../assets/ts/dropdown.data';
import IconCircle from './IconCircle.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
interface props {
  color?: string;
  onChange?: (color?: string, name?: string) => void;
  name?: string;
}

const ColorSelection: React.FC<props> = ({color, name, onChange}) => {
  console.log('colorss', color);

  const [allColors, setAllColors] = useState<string[]>(colorsArray);
  const [select, setSelect] = useState<string>(color || colorsArray[0]);
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const handleOnChange = (value: string) => {
    onChange && onChange(value, name ? name : undefined);
    setSelect(value);
  };
  useEffect(() => {
    if (color) {
      if (!allColors?.includes(color)) {
        const updateColors = [...allColors];
        updateColors.unshift(color);
        setAllColors(updateColors);
        setSelect(color);
      } else {
        setSelect(color);
      }
    }
  }, [allColors, color]);
  return (
    <View>
      <Text
        style={[
          typographies(colors).ralewayMedium12,
          {color: colors.primary, paddingLeft: rs(10)},
        ]}>
        {trans('Select Color')}
      </Text>
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {flexWrap: `${'wrap'}`, marginTop: rs(20)},
        ]}>
        {allColors.map((item, _index: number) => (
          <IconCircle
            key={_index}
            bgColor={item}
            shadow={false}
            onPress={() => handleOnChange(item)}
            style={{
              borderWidth: select === item ? rs(3) : rs(1),
              borderColor: select === item ? colors.primary : colors.gray3,
              height: rs(38),
              width: rs(38),
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default ColorSelection;
