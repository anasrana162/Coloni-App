import {View, Text, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import CircleIcon from '../../assets/icons/Circle.icon';
import {dashboardStyles as styles} from './styles/dashboard.styles';
import DashboardHeader from './Header.dashboard';
import DashboardAction from './Action.dashboard';
import DashboardCount from './Count.dashboard';
import OutlineButton from '../../components/core/button/OutlineButton.core';
import {customMargin} from '../../assets/global-styles/global.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {momentTimezone} from '../../packages/momentTimezone.package';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DashboardStats from './Stats.dashboard';
import {STATUS_BAR_HEIGHT} from '../../assets/ts/core.data';
import CustomStatusBar from '../../components/core/CustomStatusBar.core';
import {useTranslation} from 'react-i18next';
import {customUseSelector} from '../../packages/redux.package';
import {themeStates, userStates} from '../../state/allSelector.state';
import {useIsFocused} from '@react-navigation/native';
import dashboardService from '../../services/features/dashboard/dashboard.service';
import {apiResponse} from '../../services/features/api.interface';

const IndexDashboard = () => {
  const currentDate = momentTimezone();
  const {theme} = customUseSelector(themeStates);

  const [key, setKey] = useState<number>(0);
  const [dashData, setDashData] = useState({});

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchDashDetails = async () => {
        const resp = await dashboardService?.list();
        const {body, status} = resp as apiResponse;
        if (status) {
          console.log('Dash Data fetched:', body);
          setDashData(body);
        } else {
          console.log('Unable to fetchData');
        }
      };
      fetchDashDetails();
      setKey(key + 1);
    }
  }, [isFocused]);

  return (
    <Container key={key} showHeader={false} bottomTab={false}>
      <CustomStatusBar
        bgColor={colors.transparent}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={{marginTop: -(STATUS_BAR_HEIGHT ?? 0)}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 50}}>
          <View style={styles.circle}>
            <CircleIcon />
          </View>
          {dashData && (
            <>
              <DashboardHeader data={dashData} />
              <DashboardAction />
              <DashboardCount data={dashData} />
            </>
          )}
          <Text
            style={[
              typographies(colors).ralewaySemibold12,
              {textAlign: `${'center'}`},
            ]}>
            {currentDate.format('MMMM DD YYYY')}
          </Text>
          <DashboardStats />
        </ScrollView>
      </View>
    </Container>
  );
};

export default IndexDashboard;
