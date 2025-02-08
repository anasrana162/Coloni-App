import {View, Text, ActivityIndicator, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import GraphIcon from '../../assets/icons/Graph.icon';
import CheckIcon from '../../assets/icons/Check.icon';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {dashboardStyles as styles} from './styles/dashboard.styles';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {screens} from '../../routes/routeName.route';
import {useCustomNavigation} from '../../packages/navigation.package';
import {getLocalData} from '../../packages/asyncStorage/storageHandle';
import dashboardService from '../../services/features/dashboard/dashboard.service';
import {useTranslation} from 'react-i18next';

const DashboardStats = () => {
  const navigation = useCustomNavigation();
  const [totalEarning, setTotalEarning] = useState(0);
  // const [totalApprove, setTotalApprove] = useState(0);
  const [totalToBeApprove, setTotalToBeApprove] = useState(0); 
  const [loading, setLoading] = useState<boolean>(true);
  const {t: trans} = useTranslation();
  const fetchDashboardStats = async () => {
    try {
      const resp = await dashboardService.list();

      const {body} = resp;
      if (body !== null) {
        setTotalEarning(body?.totalEarning);
        // setTotalApprove(body?.totalApprove);
        setTotalToBeApprove(body?.totalToBeApprove); 
      } else {
        console.log('No data found in response body');
      }
      setLoading(false);
    } catch (error) {
      console.log('error', error);
      Alert.alert(trans('Error'), trans('Failed to load dashboard stats'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate(screens.monthCharge as never)}
        style={styles.statItem}>
        <View style={[styles.shadow, styles.statIcon]}>
          <GraphIcon />
        </View>
        <Text
          style={[
            typographies(colors).ralewaySemibold14,
            {color: colors.white, marginTop: rs(8), textAlign: 'center'},
          ]}>
          {trans('Earning')}
        </Text>
        <Text
          style={[
            typographies(colors).ralewaySemibold20,
            {
              color: colors.white,
              textAlign: 'center',
            },
          ]}>
          {totalEarning}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.statItem}
        onPress={() => navigation.navigate(screens.income as never)}>
        <View style={[styles.shadow, styles.statIcon]}>
          <CheckIcon />
        </View>
        <Text
          style={[
            typographies(colors).ralewaySemibold14,
            {color: colors.white, marginTop: rs(8), textAlign: 'center'},
          ]}>
          {trans('Approve')}
        </Text>
        <Text
          style={[
            typographies(colors).ralewaySemibold20,
            {
              color: colors.white,
              textAlign: 'center',
            },
          ]}>
          {totalToBeApprove}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardStats;
