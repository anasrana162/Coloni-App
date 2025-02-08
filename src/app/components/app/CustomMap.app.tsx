import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, {MapEvent, Marker} from 'react-native-maps';
import Container from '../../layouts/Container.layout';
import LeftArrowIcon from '../../assets/icons/LeftArrow.icon';
import {useCustomNavigation} from '../../packages/navigation.package';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import Geolocation from 'react-native-geolocation-service';
import Geocoding from 'react-native-geocoding';
import {useTranslation} from 'react-i18next';
import {colors} from '../../assets/global-styles/color.assets';
import {screens} from '../../routes/routeName.route';

const CustomMap = () => {
  Geocoding.init('AIzaSyDWWWUV6ctUY5WAdzFVi1c3q05wR_grJTc'); // Use your actual API key
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();

  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [address, setAddress] = useState<string>('');

  const handleMapPress = (event: MapEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({latitude, longitude});
    reverseGeocode(latitude, longitude);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    await Geolocation.requestAuthorization('whenInUse');
    return true;
  };

  const onSave = () => {
    navigation.navigate(screens.myPrivate, {
      lattitude: location?.lattitude,
      longitude: location?.longitude,
    });
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    console.log('hasPermission', hasPermission);
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log('Fetched coordinates:', {latitude, longitude});
          setLocation({latitude, longitude});
          reverseGeocode(latitude, longitude);
        },
        error => {
          console.error('Error getting location:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  const reverseGeocode = (latitude, longitude) => {
    Geocoding.from(latitude, longitude)
      .then(json => {
        console.log('Geocoding response:', json);
        const addressFormatted =
          json.results[0]?.formatted_address ?? 'Address not found';
        console.log('Fetched address:', address);
        setAddress(addressFormatted);
      })
      .catch(error => {
        console.error('Geocoding error:', error);
      });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Container bottomTab={false}>
      <View
        style={{
          backgroundColor: colors.gray2,
          width: '100%',
          height: 60,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            padding: 10,
            backgroundColor: colors.gray1,
            borderRadius: 30,
            position: 'absolute',
            left: 10,
          }}
          onPress={() => navigation.goBack()}>
          <LeftArrowIcon />
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={[
            typographies(colors).montserratSemibold,
            {flexGrow: 1, textAlign: 'center'},
          ]}>
          {'Map'}
        </Text>
      </View>
      {location?.latitude ? (
        <MapView
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{flex: 1}}
          onPress={handleMapPress}>
          <Marker coordinate={location} title={'My Location'} />
        </MapView>
      ) : (
        <ActivityIndicator size={'large'} color={colors.tertiary} />
      )}
      <View
        style={{
          width: '100%',
          height: 230,
          backgroundColor: colors.white,
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 0,
          alignSelf: 'center',
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={[typographies(colors).montserratMedium17, {marginBottom: 10}]}>
          {trans('Address')}
        </Text>
        {address && (
          <>
            <Text
              style={{
                ...typographies(colors).montserratMedium13,
                color: colors.black,
              }}>
              {address ?? trans('Fetching address...')}
            </Text>

            <TouchableOpacity
              onPress={onSave}
              style={{
                width: '70%',
                height: 40,
                backgroundColor: colors.tertiary,
                marginTop: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...typographies(colors).montserratMedium17,
                  fontSize: 16,
                  color: colors.white,
                }}>
                {trans('Save')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Container>
  );
};

export default CustomMap;
