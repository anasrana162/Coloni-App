import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTheme} from '@react-navigation/native';
import {config} from '../../../Config';
import {screens} from '../routeName.route';

const CustomBottomTabBar = ({state, descriptors}: any) => {
  const navigation = useCustomNavigation();
  const {colors} = useTheme() as any;
  const styles = bottomTabStyles(colors);
  const renderTabs = (_item: any, _index: any) => {
    return (
      <View key={_index}>
        {_item.tabBarIcon(state.index === _index)}
        <Text>
          {_item.title} {_item.name}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];

        {
        }
        if (
          (config.role === 'Super Administrator' &&
            route.name === screens.dashboard) ||
          (config.role === 'Administrator' &&
            route.name === screens.ColoniesSuperAdmin)
        ) {
          return null;
        }
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => navigation.navigate(route.name as never)}
            style={[globalStyles.flex1, {...options.tabBarItemStyle}]}>
            {renderTabs(options, index)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomBottomTabBar;

const bottomTabStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderTopColor: colors.sameGray3,
      borderTopWidth: 0.5,
      paddingTop: rs(16),
      height: rs(70),
      backgroundColor: colors.white,
      elevation: 10,
    },
  });
