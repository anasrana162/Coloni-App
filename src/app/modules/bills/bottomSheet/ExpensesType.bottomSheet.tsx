import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import DownArrow from '../../../assets/images/svg/downArrow.svg';
import BottomSheetSelect from '../../../components/core/BottomSheetSelect.app.component';
import expenseTemplateService from '../../../services/features/expenseTemplate/expenseTemplate.service';
import expensesService from '../../../services/features/expenses/expenses.service';
const ExpensesType: React.FC<{
  defaultValue?: string;
  onChange: (value: any, name: string) => void;
  url?: boolean;
}> = ({ defaultValue, onChange, url = false }) => {
  const { t: trans } = useTranslation();
  const { colors } = useTheme() as any;
  const styles = customSelectStyles(colors);
  const [value, setValue] = useState<any>(defaultValue || '');
  const handleChange = (item: any) => {
    onChange && onChange(item, 'expenseType');
    setValue(item);
  };
  const getDataHandler = async (query: any, success: any) => {
    const result = await (url
      ? expensesService.list()
      : expenseTemplateService.list());
    success(result);
  };
  const onPress = () => {
    global.showBottomSheet({
      flag: true,
      component: BottomSheetSelect,
      componentProps: {
        selectedValue: url ? value?.expenseAmount : value?.expenseType,
        title: url ? trans('Expenses') : trans('Expenses Type'),
        onChange: handleChange,
        titleField: url ? 'expenseAmount' : 'expenseType',
        getDataHandler,
      },
    });
  };
  return (
    <View style={[{ marginBottom: rs(13) }]}>
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
              color: !value ? colors.gray3 : colors.grayDark,
            },
          ]}
          numberOfLines={1}>
          {value?.expenseAmount ||
            value?.expenseType ||
            (url ? trans('Expense') : trans('Expense Type'))}
        </Text>
        <DownArrow />
      </TouchableOpacity>
    </View>
  );
};

export default ExpensesType;

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
