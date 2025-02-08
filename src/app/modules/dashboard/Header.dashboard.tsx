import { View } from 'react-native';
import React from 'react';
import TwoColorText from '../../components/core/TwoColorText.core.m';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { dashboardStyles as styles } from './styles/dashboard.styles';
import { useTheme } from '@react-navigation/native';
import { customUseSelector } from '../../packages/redux.package';
import { userStates } from '../../state/allSelector.state';
import { useTranslation } from 'react-i18next';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { globalStyles } from '../../assets/global-styles/global.style.asset';
import AlertIcon from '../../assets/images/svg/alertIcon.svg';
import { userRoles } from '../../assets/ts/core.data';
const DashboardHeader: React.FC<{
  data?: any;
}> = ({ data = {} }) => {
  const { colors } = useTheme() as any;
  const navigation = useCustomNavigation();

  const { userInfo } = customUseSelector(userStates);
  // const {userInfo} = props;
  const { t: trans } = useTranslation();
  console.log("Profile:", data)
  return (
    <View style={[styles.header, {
      marginTop: 40 }]}>
      <TwoColorText
        text1={trans('Hey,')}
        text2={userInfo.role == userRoles.RESIDENT ? data?.street + ' ' + data?.home : userInfo?.role}
        light={true}
        color1={colors.grayDark}
        color2={colors.grayDark}
      />
      <View style={{ ...globalStyles.flexRow }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(screens.NotificationDashboard as never)
          }>
          <View
            style={[
              globalStyles.justifyAlignCenter,
              {
                backgroundColor: colors.primary,
                height: rs(50),
                width: rs(50),
                borderRadius: rs(50),
              },
            ]}>
            <AlertIcon />
          </View>
        </TouchableOpacity>
        {userInfo.role !== userRoles.RESIDENT && <TouchableOpacity
          onPress={() => navigation.navigate(screens.myPrivate as never)}>
          <ImagePreview
            source={{ uri: userInfo?.images[0] }}
            styles={{ height: rs(50), width: rs(50), borderRadius: rs(50) }}
            borderRadius={50}
          />
        </TouchableOpacity>}
      </View>
    </View>
  );
};

export default DashboardHeader;
