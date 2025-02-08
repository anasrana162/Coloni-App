import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import DownArrow from '../../../assets/images/svg/downArrow.svg';
import BottomSheetSelect from '../../../components/core/BottomSheetSelect.app.component';
import colonySuperAdminServices from '../../../services/features/SuperAdminColony/colonySuperAdmin.services';

const AdminlistField: React.FC<{
  defaultValue?: string;
  onChange?: (value: any, name: string) => void;
  label?: string;
}> = ({defaultValue, onChange,label}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const styles = customSelectStyles(colors);
  const [value, setValue] = useState<any>(defaultValue || '');
console.log("checking default value",defaultValue);
  const handleChange = (item: any) => {
    onChange && onChange(item, 'AdminList');
    setValue(item);
  };

  const getDataHandler = async (query: any, success: any) => {
    const result = await colonySuperAdminServices.AdminList();
    success(result);
  };

  const onPress = () => {
    global.showBottomSheet({
      flag: true,
      component: BottomSheetSelect,
      componentProps: {
        selectedValue: value?.name,
        title: trans('Admin List'),
        onChange: handleChange,
        titleField: 'name',
        getDataHandler,
      },
    });
  };

  return (
    <View style={[{marginBottom: rs(13)}]}>
            {label && (
        <Text
          style={[
            typographies(colors).ralewayMedium14,
            {color: colors.primary, marginBottom: rs(6), marginLeft: rs(12)},
          ]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={styles.textContainer}
        onPress={onPress}
        activeOpacity={0.6}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            globalStyles.flexShrink1,
            globalStyles.flexGrow1,
            { color: !defaultValue && !value?.name? colors.gray3 : colors.grayDark },
          ]}
          numberOfLines={1}>
         {value?.name ||defaultValue || trans('Administrator')}
        </Text>
        <DownArrow />
      </TouchableOpacity>
    </View>
  );
};

export default AdminlistField;

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
