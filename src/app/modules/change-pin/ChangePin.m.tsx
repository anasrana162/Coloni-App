import {Alert, ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import userService from '../../services/features/users/user.service';
import {apiResponse} from '../../services/features/api.interface';
import {useTranslation} from 'react-i18next';
import authService from '../../services/features/auth/auth.service';
import {useCustomNavigation} from '../../packages/navigation.package';
import ViewHistory from './ViewHistory';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';

const ChangePin = () => {
  const {t: trans} = useTranslation();
  const [pin, setPin] = useState<string>('');
  const [currentPin, setCurrentPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [Data, setData] = useState();
  const navigation = useCustomNavigation();
  const {userInfo} = customUseSelector(userStates);
  const id = userInfo?._id;
  useEffect(() => {
    generateClueAndPin();
    fetchResidentDetails();
  }, []);
  const fetchResidentDetails = async () => {
    var fetchDetails = await userService.ResidentDetails(id);
    const {status, message, body} = fetchDetails as apiResponse;
    console.log('checking body>>>>>>', body);
    if (status) {
      setData(body?.pinHistory);
      console.log('checking data>>>>>>>>', Data);
    } else {
      console.log('Unable to fetch user data');
    }
  };
  const generateClueAndPin = async () => {
    try {
      const fetchData = await authService.generatePinandUser();
      if (fetchData === 'error') {
        return Alert.alert(trans('Error'), '#FUP');
      } else {
        const generatedPin = fetchData?.pin;
        setPin(generatedPin);
        setConfirmPin(generatedPin);
      }
    } catch (error) {
      console.log('Error generating Clue and Pin:', error);
    }
  };
  const onPressConfirm = async () => {
    setShowModal(false);
    //await annualExpenseService.fetch(values?.current)
  };
  const handleSubmit = async () => {
    const payload = {
      pin,
      currentPin,
      confirmPin,
    };

    console.log('checking payloads', payload);

    if (checkEmptyValues(payload)) {
      setLoading(true);
      const result = await userService.ChangePin(payload);
      const {status, body, message} = result as apiResponse;
      console.log('api Response', result);
      if (status) {
        showAlertWithOneAction({
          title: trans('Change Pin'),
          body: trans('Your PIN has been successfully updated.'),
        });
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Change Pin'),
          body: message,
        });
      }
      setLoading(false);
    } else {
      showAlertWithOneAction({
        title: trans('Change-Pin'),
        body: 'Please fill-up correctly!',
      });
    }
  };

  return (
    <Container>
      <Header text={trans('PIN Change')} />
      {showModal && (
        <ViewHistory
          title={trans('History')}
          data={Data}
          // para={trans('Download the annual expense from the private company?')}
          // button1Text={trans('Confirm')}
          button2Text={trans('Ok')}
          onButton1Press={onPressConfirm}
          onButton2Press={() => setShowModal(false)}
          onDismiss={() => setShowModal(false)}
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          ...customPadding(10, 20, 20, 20),
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <View>
          <LabelInput
            placeholder="Current PIN"
            onChangeText={value => setCurrentPin(value)}
            inputProps={{inputMode: 'numeric'}}
            defaultValue={currentPin}
          />
          <LabelInput
            placeholder="New PIN"
            onChangeText={value => setPin(value)}
            inputProps={{inputMode: 'numeric'}}
            defaultValue={pin}
          />
          <LabelInput
            placeholder="Confirm PIN"
            onChangeText={value => setConfirmPin(value)}
            inputProps={{inputMode: 'numeric'}}
            defaultValue={confirmPin}
          />
        </View>
        <View style={globalStyles.flexRow}>
          <Button
            text={trans('View History')}
            bgColor={colors.gray3}
            style={{width: '48.5%'}}
            onPress={() => setShowModal(true)}
          />
          <Button
            text={trans('Change PIN')}
            style={{width: '48.5%'}}
            onPress={handleSubmit}
            //loading={loading}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default ChangePin;
