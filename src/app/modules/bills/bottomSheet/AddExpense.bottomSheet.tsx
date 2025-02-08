import {View, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import ArrowLeftIcon from '../../../assets/icons/ArrowLeft.icon';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import OnlyTextInput from '../../../components/core/text-input/OnlyTextInput.core';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import Button from '../../../components/core/button/Button.core';
import {showMessage} from 'react-native-flash-message';
import expensesService from '../../../services/features/expenses/expenses.service';
import {apiResponse} from '../../../services/features/api.interface';

const AddExpense: React.FC<{onChange: (value: any) => void}> = ({onChange}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const value = useRef<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const handlePress = async () => {
    if (value.current) {
      setLoading(true);
      const result = await expensesService.createType({name: value.current});
      const {body, status} = result as apiResponse;
      if (status) {
        onChange(body);
        global.showBottomSheet({flag: false});
        setLoading(false);
      }
    } else {
      showMessage({message: trans("Type can't Empty")});
    }
  };
  return (
    <View style={{...customPadding(10, 20, 20, 20)}}>
      <View style={globalStyles.flexRow}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            global.showBottomSheet({flag: false});
          }}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[
            typographies(colors).montserratSemibold16,
            globalStyles.flexShrink1,
            {color: colors.black},
          ]}>
          {trans('Add Expense Type')}
        </Text>
      </View>
      <OnlyTextInput
        placeholder={trans('Expense Type')}
        style={{marginVertical: rs(15)}}
        defaultValue={value.current}
        onChangeText={(text: string) => (value.current = text)}
      />
      <Button
        text={trans('Add Expense Type')}
        onPress={handlePress}
        isLoading={loading}
      />
    </View>
  );
};

export default AddExpense;
