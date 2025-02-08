import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {saftyReportStates} from '../../state/allSelector.state';
import {useNavigation, useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/saftyReport/saftyReport.slice';
import saftyReportService from '../../services/features/saftyReport/saftyReport.service';

import FlameIcon from '../../assets/icons/Flame.icon';
import RobberIcon from '../../assets/icons/Robber.icon';
import MedicIcon from '../../assets/icons/Medic.icon';
import SirenIcon from '../../assets/icons/Siren.icon';
import EmergencyType from './EmergencyType';
import {useCustomNavigation} from '../../packages/navigation.package';
import moment from 'moment';
import ClockIcon from '../../assets/icons/Clock.icon';
import {getUniqueId} from 'react-native-device-info';
const {width, height} = Dimensions.get('screen');

const SafetyAlert = () => {
  const {t: trans} = useTranslation();

  const [count, setCount] = useState(3);
  const navigation = useCustomNavigation();
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const {colors} = useTheme() as any;

  const onPressEmerBtn = async () => {
    if (!description) return Alert.alert(trans('Error'), trans('Please fill description'));
    if (count == 0) return;
    if (!emergencyType)
      return Alert.alert(trans('Error'), trans('Please select emergency type'));
    var getDeviceUniqueID = await getUniqueId();
    var payload: any = {
      emergencyType,
      description,
      clickCount: count,
      deviceId: getDeviceUniqueID,
    };
    console.log('Payload', payload);
    var result = await saftyReportService.create(payload);
    console.log('Result:', result);
    setCount(count - 1);
  };

  const emergency: any[] = [
    {
      name: 'Fire',
      icon: () => {
        return <FlameIcon width={40} height={40} />;
      },
    },
    {
      name: 'Robbery',
      icon: () => {
        return <RobberIcon width={45} height={45} fill={colors.black} />;
      },
    },
    {
      name: 'Medical',
      icon: () => {
        return <MedicIcon width={40} height={40} />;
      },
    },
    {
      name: 'Other',
      icon: () => {
        return <SirenIcon width={40} height={40} />;
      },
    },
  ];

  const onSelectEmergencyType = (name: string) => {
    setEmergencyType(name);
    console.log('setEmergencyType', name);
  };

  return (
    <Container>
      <Header text={trans('Safety Alert')} />

      <ScrollView style={{width: '100%'}}>
        <View style={styles.container}>
          <Text
            style={{
              ...styles.notice,
              ...typographies(colors).ralewayBold12,
              color: colors.black,
            }}>
            {trans(
              'Press the following button 3 times, for assistance in an emergency:',
            )}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPressEmerBtn()}
            style={{...styles.bigBtn, backgroundColor: colors.emergencyBtn}}>
            <Text
              style={{
                ...styles.bigNumber,
                ...typographies(colors).ralewayBold18,
                color: colors.black,
                fontSize: 68,
              }}>
              {count}
            </Text>
          </TouchableOpacity>

          <EmergencyType
            data={emergency}
            onPress={(type: string) => onSelectEmergencyType(type)}
            onChangeText={(txt: string) => {
              setDescription(txt);
            }}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default SafetyAlert;

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    // height: height / 2,
    alignSelf: 'center',
  },
  notice: {
    alignSelf: 'center',
    marginTop: 20,
  },
  bigBtn: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigNumber: {
    //fontSize: 68,
    marginTop: -20,
  },
});
