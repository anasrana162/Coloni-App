import {Alert, Platform, ScrollView, ToastAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../../layouts/Container.layout';
import Header from '../../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';

import Button from '../../../components/core/button/Button.core';
import {useTranslation} from 'react-i18next';
import InfoCard from '../../../components/app/InfoCard.m';
import {colors} from '../../../assets/global-styles/color.assets';
import {customMargin} from '../../../assets/global-styles/global.style.asset';
import ActiveOrDisActive from '../../../components/app/ActiveOrDisactive.app';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import CameraSettingServices from '../../../services/features/CameraSettings/CameraSettingServices';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {showMessage} from 'react-native-flash-message';

const CameraSetting = () => {
  const {t: trans} = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigation = useCustomNavigation();
  const [cameraSettings, setCameraSettings] = useState({
    activateWebcam: false,
  });
  useEffect(() => {
    const fetchCameraSettings = async () => {
      try {
        const response = await CameraSettingServices.list();
        if (response && response.body && response.body[0]) {
          setCameraSettings(response.body[0]);
        }
      } catch (error) {
        console.error('Error fetching camera settings: ', error);
      }
    };
    fetchCameraSettings();
  }, []);

  const handleChange = (value, field) => {
    setCameraSettings(prevSettings => ({
      ...prevSettings,
      [field]: value,
    }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await CameraSettingServices.create(cameraSettings);
      {
        Platform.OS === 'android'
          ? ToastAndroid.show(
              'Settings saved successfully!',
              ToastAndroid.SHORT,
            )
          : showMessage({
              message: 'Settings saved successfully!',
            });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(trans('Error'), trans('Failed to save settings.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header text={trans('Camera Settings')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          ...customPadding(10, 20, 20, 20),
          height: '100%',
        }}>
        <InfoCard
          style={{backgroundColor: colors.tertiary}}
          title={trans('information')}
          body={trans(
            'Be careful, in case you have problems taking photos (The application closes when taking the photo), please activate this option. \n \nLog out and log in again after making this change.',
          )}
        />
        <ActiveOrDisActive
          defaultValue={cameraSettings.activateWebcam}
          onChange={value => handleChange(value, 'activateWebcam')}
          label={trans('Activate Web Camera')}
          style={{margin: rs(15)}}
        />
      </ScrollView>

      <Button
        text={trans('Accept')}
        style={{...customMargin(20, 20, 20, 20)}}
        onPress={handleSubmit}
        loading={loading}
      />
    </Container>
  );
};

export default CameraSetting;
