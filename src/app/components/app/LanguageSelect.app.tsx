import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import BottomSheetSelect from '../core/BottomSheetSelect.app.component';
import {customSelectProps} from '../../types/components.interface';
import {useTheme} from '@react-navigation/native';
import {languageOptions} from '../../assets/ts/dropdown.data';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {useTranslation} from 'react-i18next';
import {updateLanguage} from '../../state/features/languageSlice';
import {languageStates} from '../../state/allSelector.state';
const LanguageSelect: React.FC<customSelectProps> = ({
  label,
  placeholder = '',
  onChange,
  style,
}) => {
  const {colors} = useTheme() as any;
  const dispatch = customUseDispatch();
  const {language} = customUseSelector(languageStates);
  const {i18n, t: trans} = useTranslation();
  const handleChange = (item: any) => {
    onChange && onChange(item);
    dispatch(updateLanguage(item.shortName));
    i18n.changeLanguage(item.shortName);
  };
  const foundOption = languageOptions.find(
    option => option.shortName === language,
  );
  const value = foundOption
    ? foundOption.name
    : languageOptions.find(option => option.shortName === 'en')?.name;
  const onPress = () => {
    global.showBottomSheet({
      flag: true,
      component: BottomSheetSelect,
      componentProps: {
        data: languageOptions,
        title: trans('Select Language'),
        titleField: 'name',
        onChange: handleChange,
        selectedValue: value,
      },
    });
  };
  return (
    <View>
      {label && (
        <Text
          style={[
            typographies(colors).montserratSemibold16,
            {color: colors.primary, marginBottom: rs(6), marginLeft: rs(12)},
          ]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[styles(colors).textContainer, style]}
        onPress={onPress}
        activeOpacity={0.6}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            globalStyles.flexShrink1,
            globalStyles.flexGrow1,
            {color: !value ? colors.gray3 : colors.grayDark},
          ]}
          numberOfLines={1}>
          {value || placeholder}
        </Text>
        <DownArrow fill={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelect;

const styles = (colors: any) =>
  StyleSheet.create({
    textContainer: {
      height: rs(50),
      backgroundColor: colors.gray8,
      flexDirection: 'row',
      gap: 8,
      ...customPadding(0, 16, 0, 16),
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.primary,
      borderWidth: rs(1),
      borderRadius: rs(20),
    },
  });
