import {createStackNavigator as customCreateStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer as CustomNavigationContainer,
  useNavigation as useCustomNavigation,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

export {
  CustomNavigationContainer,
  customCreateStackNavigator,
  useCustomNavigation,
  createBottomTabNavigator,
};

const Tab = createBottomTabNavigator();
export {Tab};
