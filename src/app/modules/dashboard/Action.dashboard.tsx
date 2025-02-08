import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import HomeShadowIcon from '../../assets/icons/HomeShadow.icon';
import CallShadowIcon from '../../assets/icons/CallShadow.icon';
import SaftyReportIcon from '../../assets/icons/SaftyReports.icon';
import MessageShadowIcon from '../../assets/icons/MessageShadow.icon';
import {dashboardStyles as styles} from './styles/dashboard.styles';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {userStates} from '../../state/allSelector.state';
import {customUseSelector} from '../../packages/redux.package';
import {userRoles} from '../../assets/ts/core.data';
import {colors} from '../../assets/global-styles/color.assets';
const DashboardAction = () => {
  const navigation = useCustomNavigation();
  const {userInfo} = customUseSelector(userStates);
  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  return (
    <View
      style={[
        styles.actionContainer,
        {
        },
      ]}>
      {isAdmin && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.shadow}
          onPress={() => navigation.navigate(screens.residents as never)}>
          <HomeShadowIcon />
        </TouchableOpacity>
      )}
      {!isAdmin && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.shadow}
          onPress={() => navigation.navigate(screens.safetyAlert as never)}>
          <SaftyReportIcon fill={colors.tertiary} width={28} height={28} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.shadow}
        onPress={() => navigation.navigate(screens.emergencyNumber as never)}>
        <CallShadowIcon />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.shadow}
        onPress={() => navigation.navigate(screens.contacts as never)}>
        <MessageShadowIcon />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardAction;
