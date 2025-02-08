import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { fonts } from '../../../assets/global-styles/fonts.style.asset';
import { useTheme } from '@react-navigation/native';
import { formatDate } from '../../../utilities/helper';
import {useTranslation} from 'react-i18next';

const IncomeVsExpense: React.FC<{
  size?: number;
  showPercentage?: boolean;
  middleText?: string;
  bottomText?: string;
  data?: any;
}> = ({ size = rs(207), showPercentage = false, middleText = '', data = {} }) => {
  const { colors } = useTheme() as any;
  const totalIncome = data?.totalIncome || 0;
  const {t: trans} = useTranslation();
  const totalExpense = data?.totalExpense || 0;
  const incomePercentage = data?.incomePercentage || 0;
  const expensePercentage = data?.expensePercentage || 0;
  const finalBalance = data?.finalBalance || 0
  const period = data?.period || ''
  useEffect(() => {
    try {
    } catch (error) {
      Alert.alert(trans('Error'), trans('Failed to load account status'));
    }
  }, [data]);

  const radius = size / 2;
  const pieChartData = [
    {
      color: colors.primary,
      value: incomePercentage,
    },
    {
      color: "red",
      value: expensePercentage,
    },
  ];
  const isDataEmpty = pieChartData.length === 0 || incomePercentage === 0 && expensePercentage === 0;
  return (
    <View
      style={{
        width: '100%',
        height: radius,
        marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {isDataEmpty ? (

        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 5,
            borderColor: colors.gray,
            justifyContent: 'center',
            alignItems: 'center',
          }}>

        </View>
      ) : (
        <PieChart
          data={pieChartData}
          donut
          radius={radius}
          innerRadius={75}
          innerCircleBorderColor="lightgray"
          shadow
        />
      )}
      <View style={{ position: 'absolute', zIndex: 100, alignItems: 'center' }}>

        <Text
          style={{
            fontSize: rs(12),
            fontFamily: fonts.raleway600,
            color: colors.black,
          }}>
          {formatDate(period, 'MMM YYYY')}
        </Text>
        <Text
          style={{
            fontSize: rs(16),
            fontFamily: fonts.raleway600,
            color: colors.active,
          }}>
          {` $${finalBalance}`}
        </Text>
      </View>
    </View>
  );
};

export default IncomeVsExpense;
