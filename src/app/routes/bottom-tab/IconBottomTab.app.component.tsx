/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  tabOptionResList,
  tabOptionsList,
  tabOptionVigList,
} from '../../assets/ts/dropdown.data';
import {activityHeight} from '../../utilities/helper';
import BottomTabBarIcon from './BottomTabBarIcon';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../routeName.route';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {userRoles} from '../../assets/ts/core.data';

const BottomTabIcon: React.FC = () => {
  const aH = activityHeight();
  const {colors} = useTheme() as any;
  const navigation = useCustomNavigation();
  const renderTabs = () => {
    const {userInfo} = customUseSelector(userStates);
    var tabList;
    tabOptionsList;
    if (userInfo?.role === userRoles.RESIDENT) {
      tabList = tabOptionResList;
    } else if (userInfo?.role === userRoles.VIGILANT) {
      tabList = tabOptionVigList;
    } else {
      tabList = tabOptionsList;
    }
    return tabList.map((item, index) => {
      if (item.name === screens.drawer) {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate(item.name as never)}
            key={index}>
            <BottomTabBarIcon Icon={item.Icon} focused={true} />
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate(item.name as never)}
          key={index}
          style={{display: item.Icon ? 'flex' : 'none'}}>
          <BottomTabBarIcon Icon={item.Icon} focused={false} />
        </TouchableOpacity>
      );
    });
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopColor: colors.gray3,
        borderTopWidth: 0.5,
        paddingTop: rs(16),
        height: rs(76),
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: rs(aH),
        backgroundColor: colors.white,
      }}>
      {renderTabs()}
    </View>
  );
};
export default BottomTabIcon;
