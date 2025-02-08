import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';

const BottomTabBarIcon: React.FC<{
  Icon: any;
  focused: boolean;
  showName: string;
}> = ({Icon, focused, showName}) => {
  return (
    <View style={styles.container}>
      {typeof Icon !== 'undefined' && (
        <View
          style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
          <Icon fill={focused ? colors.active : colors.gray3} />

          <Text
            style={{
              ...typographies(colors).montserratMedium13,
              fontSize: 10,
              fontWeight: '700',
              color: focused ? colors.active : colors.gray3,
              marginTop: 5,
            }}>
            {showName}
          </Text>

        </View>
      )}
    </View>
  );
};

export default BottomTabBarIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: rs(5),
    width: rs(5),
    borderRadius: 10,
    backgroundColor: colors.active,
    marginTop: 5,
  },
});
