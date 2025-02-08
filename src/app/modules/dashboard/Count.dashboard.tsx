import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AnimatedCircle from '../../components/app/AnimatedCircle.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import OutlineButton from '../../components/core/button/OutlineButton.core';
import {customMargin} from '../../assets/global-styles/global.style.asset';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {config} from '../../../Config';
import {userRoles} from '../../assets/ts/core.data';
const DashboardCount: React.FC<{
  
  data?: any;
}> = ({data = {}}) => {
  const {colors} = useTheme() as any;
  const {userInfo} = customUseSelector(userStates);

  const [key, setKey] = useState(0);
  console.log('config.role', userInfo);

  useEffect(() => {
    setKey(key + 1);
  }, [data]);
  return (
    <>
      <View style={{alignItems: `${'center'}`, marginTop: rs(68)}}>
        <Text
          style={[
            typographies(colors).ralewaySemibold12,
            {
              color: colors.secondary,
              marginBottom: rs(12),
              textAlign: `${'center'}`,
            },
          ]}>
          {userInfo?.role == userRoles.RESIDENT
            ? data?.userName
            : data?.paymentData}
        </Text>

        <AnimatedCircle
          key={key}
          showPercentage={true}
          middleText="Collection"
          bottomText="Collection"
          data={data}
        />
      </View>
      <OutlineButton
        text={
          userInfo?.role == userRoles?.RESIDENT
            ? data.street + ' ' + data.home
            : userInfo?.role
        }
        textColor={colors.active}
        activeOpacity={1}
        borderColor={colors.active}
        onPress={() => {
        }}
        style={{...customMargin(22, 20, 13, 20)}}
      />
    </>
  );
};

export default DashboardCount;
