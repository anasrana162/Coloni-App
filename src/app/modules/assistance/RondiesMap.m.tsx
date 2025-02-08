import React, {useLayoutEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Container from '../../layouts/Container.layout';
import LeftArrowIcon from '../../assets/icons/LeftArrow.icon';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTheme, useRoute} from '@react-navigation/native';
import {
  customPadding,
  customMargin,
} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import noteBottomSheet from './components/noteBottomSheet';
import imageLink from '../../assets/images/imageLink';
import {colors} from '../../assets/global-styles/color.assets';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import assistanceService from '../../services/features/assistance/assistance.service';
import {apiResponse} from '../../services/features/api.interface';
import {useTranslation} from 'react-i18next';
import {
  addAction,
  updateAction,
} from '../../state/features/Assistance/Assistance.slice';
import {screens} from '../../routes/routeName.route';
import {showMessage} from 'react-native-flash-message';
const RoundiesMap: React.FC<{
  route: {params?: {index?: number; edit?: boolean; id?: any}};
}> = ({
  route: {
    params: {index, id, edit} = {
      index: -1,
      id: '',
      edit: false,
    },
  },
}) => {
  const navigation = useCustomNavigation();
  const {colors} = useTheme() as any;
  const route = useRoute();
  const {name, toursType} = route.params as {name: string; toursType: string};

  const [note, setNote] = useState('');
  const {userInfo} = customUseSelector(userStates);
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const values = useRef({
    visitorName: name,
    note: note,
    residentId: userInfo?._id,
    toursType: toursType,
    endingPoint: {
      latitude: 0,
      longitude: 0,
    },
    startingPoint: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [endPoint, setEndPoint] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleChange = (value: any, name: string) => {
    values.current = {...values.current, [name]: value};
  };
  const handleMapPress = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;

    setRegion(prevRegion => ({
      ...prevRegion,
      latitude,
      longitude,
    }));

    setEndPoint({latitude, longitude});

    if (!values.current.startingPoint.latitude) {
      handleChange({latitude, longitude}, 'startingPoint');
    } else {
      handleChange({latitude, longitude}, 'endingPoint');
    }
  };

  const handleConfirm = (note: string) => {
    handleChange(note, 'note');
    setNote(note);
  };
  type Coordinates = {
    latitude: number;
    longitude: number;
  };

  type Payload = {
    note: string;
    visitorName: string;
    residentId: string | number;
    endingPoint: Coordinates;
    startingPoint: Coordinates;
  };
  const handleSubmit = async () => {
    const payload: Payload = {
      ...values.current,
    };

    const emptyField = Object.keys(payload).find(key => {
      const typedKey = key as keyof Payload;
      const field = payload[typedKey];
      return (
        field === '' ||
        field === null ||
        (typeof field === 'object' && field.latitude === 0)
      );
    });

    // if (!emptyField) {
    loading.current = true;
    const result = await (edit
      ? assistanceService.update({...payload}, id)
      : assistanceService.create(payload));
    const {status, body, message} = result as apiResponse;
    if (status) {
      edit
        ? dispatch(updateAction({item: body, index, id}))
        : dispatch(addAction(body));
      navigation.navigate(screens.assistance as never);
    } else {
      showAlertWithOneAction({
        title: trans('tour/Assistance'),
        body: message,
      });
    }
    loading.current = false;
    // } else {
    //   showAlertWithOneAction({
    //     title: trans('tour/Assistance'),
    //     body: `Please fill up the ${emptyField} field correctly!`,
    //   });
    // }
  };

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await assistanceService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking body,', body);
        if (status) {
          values.current = {
            visitorName: name,
            note: body?.note || '',
            residentId: userInfo?._id,
            toursType: toursType,
            startingPoint: body.startingPoint || {latitude: 0, longitude: 0},
            endingPoint: body.endingPoint || {latitude: 0, longitude: 0},
          };
          setRegion({
            latitude: body.startingPoint?.latitude || 37.78825,
            longitude: body.startingPoint?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setNote(body?.note);
          if (body.endingPoint) {
            setEndPoint({
              latitude: body.endingPoint.latitude,
              longitude: body.endingPoint.longitude,
            });
          }
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);

  return (
    <Container showHeader={false}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <LeftArrowIcon />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            global.showBottomSheet({
              flag: true,
              component: noteBottomSheet,
              componentProps: {
                onConfirm: handleConfirm,
                onCancel: () => {
                  console.log('Action cancelled');
                },
                note,
                setNote,
              },
            })
          }>
          <View style={styles.imageContainer}>
            <Image source={imageLink.pinImage} style={styles.imgStyle} />
          </View>
        </TouchableOpacity>
      </View>
      <MapView
        initialRegion={region}
        style={{flex: 1}}
        onPress={handleMapPress}>
        <Marker coordinate={values.current.startingPoint} title="Start Point" />
        {endPoint && <Marker coordinate={endPoint} title="End Point" />}
      </MapView>
      <Button
        style={styles.buttonStyle}
        text={trans('Finish')}
        onPress={handleSubmit}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    zIndex: 1,
    ...customMargin(20, 10, 20, 10),
  },
  imageContainer: {
    marginHorizontal: 20,
    ...customPadding(10, 10, 10, 10),
    backgroundColor: colors.gray3,
    borderRadius: 50,
  },
  imgStyle: {
    width: 40,
    height: 40,
  },
  buttonStyle: {
    ...customMargin(12, 12, 12, 12),
  },
});

export default RoundiesMap;
