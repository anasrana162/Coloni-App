import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import BottomSheetSelect from '../core/BottomSheetSelect.app.component';
import {customSelectProps} from '../../types/components.interface';
import {isEmpty} from '../../utilities/helper';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
const CustomSelect: React.FC<customSelectProps> = ({
  label,
  placeholder = '',
  defaultValue = '',
  data = [],
  onChange,
  style,
  name,
  isDataObject = false,
  mainStyles,
}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const [value, setValue] = useState<string>(defaultValue);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  useEffect(() => {
    if (defaultValue && onChange) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (item: any) => {
    onChange && onChange(item, name ? name?.trim() : '');
    setValue(isDataObject ? item?.name : item);
    setOpenDropDown(false);
  };

  const onPress = () => {
    !isEmpty(data) &&
      global.showBottomSheet({
        flag: true,
        component: BottomSheetSelect,
        componentProps: {
          data,
          selectedValue: value,
          title: label,
          onChange: handleChange,
        },
      });
  };

  const onOpenDropdown = () => {
    setOpenDropDown(!openDropDown);
  };
  const styles = customSelectStyles(colors);
  return (
    <View style={[{marginBottom: rs(13)}, style]}>
      {label && (
        <Text
          style={[
            typographies(colors).ralewayMedium14,
            {color: colors.primary, marginBottom: rs(6), marginLeft: rs(12)},
          ]}>
          {trans(label)}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.textContainer, mainStyles]}
        onPress={isDataObject ? onOpenDropdown : onPress}
        activeOpacity={0.6}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            globalStyles.flexShrink1,
            globalStyles.flexGrow1,
            {
              color: !value
                ? !defaultValue
                  ? colors.gray3
                  : colors.grayDark
                : colors.grayDark,
            },
          ]}
          numberOfLines={1}>
          {!value && !defaultValue
            ? trans(placeholder)
            : trans(value) || trans(defaultValue)}
        </Text>
        <DownArrow />
      </TouchableOpacity>

      {openDropDown && (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 10,
            borderWidth: 1,
            borderColor: colors.gray3,
            borderRadius: 10,
            marginTop: 10,
          }}>
          {data.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleChange(item)}
                style={{padding: 5, marginBottom: 10}}>
                <Text style={typographies(colors).montserratMedium13}>
                  {trans(item?.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CustomSelect;

const customSelectStyles = (colors: any) =>
  StyleSheet.create({
    textContainer: {
      height: rs(42),
      backgroundColor: colors.gray8,
      flexDirection: 'row',
      gap: 8,
      ...customPadding(0, 16, 0, 16),
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
  });
