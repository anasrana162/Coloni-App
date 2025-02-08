/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  tabOptions,
  tabOptionsRes,
  tabOptionsVigilant,
} from '../../assets/ts/dropdown.data';
import {Tab} from '../../packages/navigation.package';
import {screens} from '../routeName.route';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {activityHeight} from '../../utilities/helper';
import CustomBottomTabBar from './CustomBottomTabBar';
import BottomTabBarIcon from './BottomTabBarIcon';
import {config} from '../../../Config';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {userRoles} from '../../assets/ts/core.data';
import {useTranslation} from 'react-i18next';

const BottomTab: React.FC = () => {
  const {t: trans} = useTranslation();
  const aH = activityHeight();
  const initialRouteName =
    config?.role === 'Super Administrator'
      ? screens.ColoniesSuperAdmin
      : screens.dashboard;
  const renderTabs = () => {
    const view: any = [];
    const {userInfo} = customUseSelector(userStates);
    var tabList;
    // userInfo?.role == userRoles.RESIDENT ? tabOptionsRes : tabOptions;
    tabOptions;
    if (userInfo?.role === userRoles.RESIDENT) {
      tabList = tabOptionsRes;
    } else if (userInfo?.role === userRoles.VIGILANT) {
      tabList = tabOptionsVigilant;
    } else {
      tabList = tabOptions;
    }
    tabList.map((item, index: number) => {
      let extra: any = {};
      if (!item?.Icon) {
        extra.tabBarItemStyle = {display: 'none'};
        extra.detachInactiveScreens = true;
      }
      view.push(
        <Tab.Screen
          key={index}
          options={{
            tabBarIcon: (focused: any) => {
              return (
                <BottomTabBarIcon
                  Icon={item.Icon}
                  focused={focused}
                  showName={trans(item.show)}
                />
              );
            },
            lazy: true,
            ...extra,
          }}
          name={item.name}
          component={item.Component}
        />,
      );
    });
    return view;
  };
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray3,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          borderTopColor: colors.gray3,
          borderTopWidth: 0.5,
          paddingTop: rs(16),
          height: rs(90 + aH),
          paddingBottom: rs(aH),
          backgroundColor: colors.error1,
        },
      }}
      tabBar={props => <CustomBottomTabBar {...props} />}>
      {renderTabs()}
    </Tab.Navigator>
  );
};
export default BottomTab;
