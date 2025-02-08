import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {userRoles} from '../../../assets/ts/core.data';
import {useSelector} from 'react-redux';
import {userStates} from '../../../state/allSelector.state';
import AddColony from './AddColony.bottomSheet';
import streetService from '../../../services/features/street/street.service';
const StreetType: React.FC<{
  defaultValue?: string;
  onChange?: (value: any, name: string) => void;
}> = ({defaultValue, onChange}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const styles = customSelectStyles(colors);
  const [value, setValue] = useState<any>(defaultValue || '');
  const {userInfo} = useSelector(userStates);
  const handleChange = (item: any) => {
    onChange && onChange(item, 'streetId');
    setValue(item);
  };
  const handleOpenAddExpense = () => {
    global.showBottomSheet({
      flag: true,
      component: AddColony,
      componentProps: {onChange: handleChange},
    });
  };
  const getDataHandler = async (query: any, success: any) => {
    const result = await streetService.list();
    console.log('Result street:', result);
    success(result);
  };
  // useEffect(() => {
  //   setValue(defaultValue);
  // }, [defaultValue]);
  const onPress = () => {
    global.showBottomSheet({
      flag: true,
      component: BottomSheetSelect,
      componentProps: {
        selectedValue: value?.name,
        title: trans('Street'),
        onChange: handleChange,
        titleField: 'name',

        getDataHandler,
      },
    });
  };
  return (
    <View style={[{marginBottom: rs(13)}]}>
      <Text
        style={[
          typographies(colors).ralewayMedium14,
          {color: colors.primary, marginBottom: rs(6), marginLeft: rs(12)},
        ]}>
        {trans('Street')}
      </Text>
      <TouchableOpacity
        style={styles.textContainer}
        onPress={onPress}
        activeOpacity={0.6}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            globalStyles.flexShrink1,
            globalStyles.flexGrow1,
            {
              color: !value?.name
                ? !defaultValue
                  ? colors.gray3
                  : colors.grayDark
                : colors.grayDark,
            },
          ]}
          numberOfLines={1}>
          {!value?.name
            ? defaultValue
              ? defaultValue
              : trans('Select Street')
            : value?.name || trans('Street')}
        </Text>
        <DownArrow />
      </TouchableOpacity>
    </View>
  );
};

export default StreetType;

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
