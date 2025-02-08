import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, View, Text } from 'react-native';

import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { fonts } from '../../assets/global-styles/fonts.style.asset';
import { useTheme } from '@react-navigation/native';
import dashboardService from '../../services/features/dashboard/dashboard.service';
import { PieChart } from 'react-native-gifted-charts';
import { apiResponse } from '../../services/features/api.interface';
import { customUseSelector } from '../../packages/redux.package';
import { userStates } from '../../state/allSelector.state';
import { userRoles } from '../../assets/ts/core.data';
import { useTranslation } from 'react-i18next';


const AnimatedCircle: React.FC<{
  size?: number;
  showPercentage?: boolean;
  middleText?: string;
  bottomText?: string;
  data?: any;
}> = ({ size = rs(207), showPercentage = false, middleText = '', data = {} }) => {
  const [approveRate, setApproveRate] = useState(0);
  const [totalApprove, setTotalApprove] = useState(0);
  const [expiryRate, setExpiryRate] = useState(0);
  const [pendingRate, setpendingRate] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalPendingCount, setTotalPendingCount] = useState(0);
  const { userInfo } = customUseSelector(userStates);
  const { colors } = useTheme() as any;

  useEffect(() => {
    try {
      setApproveRate(data.approveRate || 0);
      setTotalApprove(data.totalApprove || 0);
      setExpiryRate(data.expiryRate || 0);
      setpendingRate(data.pendingRate || 0);
      setTotalEarning(data.totalEarning || 0);
      setTotalPendingCount(data?.totalPendingCount || 0);
    } catch (error) {
      console.log('error', error);
      Alert.alert(trans('Error'), trans('Failed to load dashboard stats'));
    }
  }, []);
  const validExpiryRate = Math.min(100, Math.max(0, expiryRate));
  const clampedApproveRate = Math.min(100, Math.max(0, approveRate));
  const validApproveRate = Math.round(clampedApproveRate);
  const validPendingRate = Math.min(100, Math.max(0, pendingRate));
  const { t: trans } = useTranslation();
  const updatedList = [
    {
      color: colors.tertiary, //getFillColor(validApproveRate),
      value: validApproveRate,
    },
    {
      color: colors.error1, //getFillColor(validExpiryRate),
      value: validExpiryRate,
    },
    {
      color: colors.gray5, //getFillColor(validPendingRate),
      value: validPendingRate,
    },
  ];
  const zero = [
    {
      color: 'white', //getFillColor(validApproveRate),
      value: 100,
    },
  ];

  const radius = size / 2;
  const strokeWidth = 30;
  const sumOfValues = updatedList.reduce((accumulator, current) => {
    return accumulator + current.value;
  }, 0);

  return (
    <View
      style={{
        width: '100%',
        height: radius + 50,
        marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <PieChart
        data={sumOfValues == 0 ? zero : updatedList}
        donut
        radius={radius}
        innerRadius={85}
        innerCircleBorderColor="lightgray"
        shadow
      />
      <View
        style={{
          position: 'absolute',
          zIndex: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {showPercentage && (
          <Text
            style={{
              fontSize: rs(50),
              fontFamily: fonts.montserrat600,
              color: colors.active,
            }}>
            {userInfo?.role == userRoles.RESIDENT
              ? `${Math.round(totalPendingCount)}`
              : `${Math.round(approveRate)}%`}
          </Text>
        )}
        {userInfo?.role !== userRoles.RESIDENT && (
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.raleway600,
              alignSelf: 'center',
              color: colors.active,
            }}>{`$${totalApprove}`}</Text>
        )}
        <Text
          numberOfLines={3}
          style={{
            fontSize: rs(12),
            fontFamily: fonts.raleway600,
            color: colors.black,
            alignSelf: 'center',
            width: '80%',
            textAlign: 'center',
          }}>
          {userInfo?.role == userRoles.RESIDENT
            ? `${totalPendingCount} ${trans(
              'maintanence fee (Due',
            )} ${totalPendingCount})`
            : middleText}
        </Text>
      </View>
    </View>
  );

};


export default AnimatedCircle;
