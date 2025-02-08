import {Alert, ScrollView, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import LabelInput from '../../components/app/LabelInput.app';
import CustomSelect from '../../components/app/CustomSelect.app';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import StreetType from './bottomsheet/StreetType.bottomSheet';
import ColonyType from './bottomsheet/ColonyType.bottomSheet';
import {userRoles} from '../../assets/ts/core.data';
import {useTranslation} from 'react-i18next';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import userService from '../../services/features/users/user.service';
import Badge from '../../components/app/Badge.app';
import {screens} from '../../routes/routeName.route';
import {colors} from '../../assets/global-styles/color.assets';
import Button from '../../components/core/button/Button.core';
import DevicesIcon from '../../assets/images/svg/devicesIcon.svg';
import EliminateIcon from '../../assets/images/svg/eliminateIcon.svg';
import authService from '../../services/features/auth/auth.service';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {config} from '../../../Config';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import ChangePinModal from '../../components/app/ChangePinModal';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const AddUpdateResident: React.FC<{
  route: {
    params?: {
      index?: number;
      active?: boolean;
      id: string;
      createNew?: boolean;
    };
  };
}> = ({
  route: {
    params: {index, id, active, createNew} = {
      index: -1,
      id: '',
      active: false,
      createNew: false,
    },
  },
}) => {
  const {t: trans} = useTranslation();
  const navigation: any = useCustomNavigation();
  const loading = useRef(false);
  const [rerender, setrerender] = useState('');
  const {userInfo} = customUseSelector(userStates);
  const [showSide, setShowSide] = useState<any>(false);
  const [key, setKey] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openCorrectNameModal, setOpenCorrectNameModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [openCorrectChargesNameModal, setOpenCorrectNameChargesModal] =
    useState(false);
  const [loadings, setLoading] = useState(false);

  const [values, setValues] = useState<any>({
    home: '',
    name: '',
    pin: '',
    clue: '',
    colonyId: '',
    role: '',
    streetId: '',
    maxDevices: 9,
    receiveCalls: false,
    receiveChats: false,
    asset: false,
    paymentData: '',
    paymentReference: '',
  });

  const [values1, setValues1] = useState<any>({
    home: '',
    name: '',
    pin: '',
    clue: '',
    colonyId: '',
    role: '',
    streetId: '',
    maxDevices: 9,
    asset: false,
    paymentData: '',
    paymentReference: '',
    defaulter: false,
    receiveCalls: false,
    receiveChats: false,
    frequentBlock: false,
    reservationBlock: false,
    surveyBlock: false,
    communicationBlock: false,
    quotaAgreement: false,
  });

  const handleChange = (value: any, name: string) => {
    if (createNew) {
      setValues((prev: any) => ({...prev, [name]: value}));
    } else {
      setValues1((prev: any) => ({...prev, [name]: value}));
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values,
      streetId: values.streetId?._id,
      colonyId: userInfo?.colony,
    };

    console.log('Payload:', payload); // Debugging line

    loading.current = true;

    try {
      const result = await userService.register(payload);
      console.log('API Response:', result); // Debugging line

      const {status, message} = result as apiResponse;
      if (status) {
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Resident'),
          body: message,
        });
      }
    } catch (error) {
      console.error('Error during registration:', error); // Debugging line
      showAlertWithOneAction({
        title: trans('Resident'),
        body: trans('An error occurred while saving.'),
      });
    } finally {
      loading.current = false;
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);

    const payload = {
      ...values1,
      streetId: values1.streetId?._id,
      colonyId: userInfo?.colony,
    };
    loading.current = true;

    delete payload.pin;
    delete payload.clue;
    try {
      const result = await userService.update(payload, id);

      const {status, message} = result as apiResponse;
      if (status) {
        Alert.alert(trans('Success'), trans('Update Successfully!'));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Resident'),
          body: message,
        });
      }
    } catch (error) {
      console.error('Error during Update:', error); // Debugging line
      showAlertWithOneAction({
        title: trans('Resident'),
        body: trans('An error occurred while saving.'),
      });
    } finally {
      loading.current = false;
    }
    setLoading(false);
  };
  const handleDelete = async () => {
    console.log('User Id to delete:', id);
    var result = await userService.DeleteResident(id);
    console.log('User Deleted', result?.response?.data);
    navigation.goBack();
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (rerender == '' && createNew) {
        await generateClueAndPin();
      } else {
        if (rerender == '') {
          await fetchResidentDetails();
        }
      }
    };

    fetchData();
  }, [values, values1, showSide]);

  useEffect(() => {
    setShowSide(active);
  }, []);

  const fetchResidentDetails = async () => {
    var fetchDetails = await userService.ResidentDetails(id);
    const {status, message, body} = fetchDetails as apiResponse;
    console.log('Body fetched:', body);
    if (status) {
      await fillUserData(body);
    } else {
      console.log('Unable to fetch user data');
    }
  };

  const fillUserData = async (data: any) => {
    setValues1({
      home: data.home,
      name: data.name,
      pin: data.pin,
      clue: data.clue,
      colonyId: data.colony,
      role: data.role,
      streetId: data.street,
      maxDevices: data.maxDevices,
      paymentData: data.paymentData,
      paymentReference: data.paymentReference,
      defaulter: data.defaulter,
      receiveCalls: data?.receiveCalls,
      receiveChats: data?.receiveChats,
      frequentBlock: data.frequentBlock,
      reservationBlock: data.reservationBlock,
      surveyBlock: data.surveyBlock,
      communicationBlock: data.communicationBlock,
      quotaAgreement: data.quotaAgreement,
      asset: data.asset,
    });
    setTimeout(() => {
      return setrerender('render');
    }, 500);
  };

  const generateClueAndPin = async () => {
    try {
      var fetchData = await authService.generatePinandUser();
      if (fetchData == 'error') {
        return Alert.alert(trans('Error'), '#FUP');
      } else {
        setrerender('render');
        handleChange(fetchData?.username, 'clue');
        handleChange(fetchData?.pin, 'pin');
      }
    } catch (error) {
      console.log('error generateClueAndPin: ', error);
    }
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container bottomTab={false}>
        <Header
          text={trans('Resident')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={createNew ? handleSubmit : handleUpdate}
        />
        <ScrollView
          contentContainerStyle={{...customPadding(0, 20, 20, 20)}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <CustomSelect
            data={Object.values(userRoles).filter(
              role => role !== 'Super Administrator',
            )}
            label={trans('Resident Type')}
            placeholder={trans('Select resident type')}
            defaultValue={createNew ? values?.role : values1?.role}
            onChange={(value: any) => {
              handleChange(value, 'role');
              if (value == 'Administrator' || value == 'Vigilant') {
                setShowSide(true);
              } else {
                setShowSide(false);
              }
            }}
          />
          <LabelInput
            key={rerender}
            label={trans('Clue')}
            defaultValue={createNew ? values?.clue : values1?.clue}
            name="clue"
            editable={createNew ? true : false}
            onChangeText={(value: any) => handleChange(value, 'clue')}
            placeholder="BRV86Z"
          />

          {createNew && (
            <LabelInput
              label={trans('Pin')}
              defaultValue={createNew ? values?.pin : values1?.pin}
              name="pin"
              editable={createNew ? true : false}
              onChangeText={(value: any) => handleChange(value, 'clue')}
              placeholder="0000"
            />
          )}

          <LabelInput
            label={trans('Home')}
            defaultValue={createNew ? values?.home : values1.home}
            name="home"
            onChangeText={(value: any) => handleChange(value, 'home')}
            placeholder=""
          />
          <StreetType
            onChange={(item, name) => handleChange(item, name)}
            defaultValue={
              createNew ? values?.streetId?.name : values1?.streetId?.name
            }
          />
          <LabelInput
            label={trans('Name')}
            defaultValue={createNew ? values?.name : values1.name}
            name="name"
            onChangeText={(value: any) => handleChange(value, 'name')}
            placeholder=""
          />
          {!showSide && !createNew && (
            <LabelInput
              label={trans('Payment Data Displayed to the resident')}
              defaultValue={
                createNew ? values.paymentData : values1.paymentData
              }
              name="paymentData"
              onChangeText={(value: any) => handleChange(value, 'paymentData')}
            />
          )}
          {!showSide && !createNew && (
            <LabelInput
              label={trans('Payment Reference Approval by file')}
              defaultValue={
                createNew ? values.paymentReference : values1.paymentReference
              }
              placeholder=""
              name="paymentReference"
              onChangeText={(value: any) => handleChange(value, 'paymentRef')}
            />
          )}
          <LabelInput
            label={trans('Maximum Devices')}
            defaultValue={createNew ? values?.maxDevices : values1.maxDevices}
            name="maxDevices"
            onChangeText={(value: any) => handleChange(value, 'maxDevices')}
            placeholder="9"
          />
          {!createNew && !showSide && (
            <>
              <ActiveOrDisActive
                label={trans('Defaulter (Block visits)')}
                style={{marginTop: rs(7)}}
                defaultValue={values1.defaulter}
                name="defaulter"
                onChange={handleChange}
              />
              <ActiveOrDisActive
                label={trans('Frequent Block')}
                defaultValue={values1.frequentBlock}
                name="frequentBlock"
                onChange={handleChange}
                style={{marginTop: rs(7)}}
              />
              <ActiveOrDisActive
                label={trans('Reservations Block')}
                style={{marginTop: rs(13)}}
                defaultValue={values1.reservationBlock}
                name="reservationBlock"
                onChange={handleChange}
              />
              <ActiveOrDisActive
                label={trans('Survey Block')}
                style={{marginTop: rs(13)}}
                defaultValue={values1.surveyBlock}
                name="reservationBlock"
                onChange={handleChange}
              />
              <ActiveOrDisActive
                label={trans('Communication Block')}
                defaultValue={values1.communicationBlock}
                name="communicationBlock"
                onChange={handleChange}
                style={{marginTop: rs(13)}}
              />
              <ActiveOrDisActive
                label={trans('Quota of Agreement')}
                defaultValue={values1.quotaAgreement}
                name="quotaAgreement"
                onChange={handleChange}
                style={{marginTop: rs(13)}}
              />
            </>
          )}
          <ActiveOrDisActive
            label={trans('Assets')}
            defaultValue={createNew ? values?.asset : values1.asset}
            name="asset"
            onChange={handleChange}
            style={{marginTop: rs(13)}}
          />
          <ActiveOrDisActive
            label={trans('You can receive Chats')}
            defaultValue={
              createNew ? values.receiveChats : values1.receiveChats
            }
            name="receiveChat"
            onChange={handleChange}
            style={{marginTop: rs(13)}}
          />
          {!createNew ? (
            <>
              {!showSide && (
                <>
                  <View style={[globalStyles.flexRow, {marginTop: rs(20)}]}>
                    <Badge
                      text={trans('See Charges')}
                      onPress={() =>
                        navigation.navigate(screens.chargesResident as never, {
                          ResidentName:
                            values1.streetId?.name + ' ' + values1.home,
                          resident_id: id,
                        })
                      }
                      style={{
                        borderRadius: rs(10),
                        flexGrow: 1 / 2,
                        width: `${'48%'}`,
                      }}
                      bgColor={colors.secondary}
                    />
                    <Badge
                      text={trans('View Documents')}
                      onPress={() =>
                        navigation.navigate(
                          screens.documentsResident as never,
                          {
                            ResidentName:
                              values1.streetId?.name + ' ' + values1.home,
                            resident_id: id,
                          },
                        )
                      }
                      style={{
                        borderRadius: rs(10),
                        flexGrow: 1 / 2,
                        width: `${'48%'}`,
                      }}
                      bgColor={colors.secondary}
                    />
                  </View>
                  <View style={[globalStyles.flexRow, {marginTop: rs(10)}]}>
                    <Badge
                      text={trans('See Devices')}
                      style={{
                        borderRadius: rs(10),
                        flexGrow: 1 / 2,
                        width: `${'48%'}`,
                      }}
                      onPress={() =>
                        navigation.navigate(screens.residentDevices as never, {
                          resident_Id: id,
                        })
                      }
                      bgColor={colors.secondary}
                    />
                    <Badge
                      text={trans('Eliminate')}
                      style={{
                        borderRadius: rs(10),
                        flexGrow: 1 / 2,
                        width: `${'48%'}`,
                      }}
                      bgColor={colors.error1}
                      // onPress={() => handleDelete()}
                      onPress={() => setShowDeleteModal(true)}
                    />
                  </View>

                  <Badge
                    text={trans('Change Pin')}
                    style={{
                      borderRadius: rs(10),
                      flexGrow: 1 / 2,
                      width: `${'48%'}`,
                      marginTop: 10,
                    }}
                    bgColor={colors.secondary}
                    // onPress={() => handleDelete()}
                    onPress={() => setShowPinModal(true)}
                  />
                </>
              )}
              {showSide ? (
                <>
                  <Button
                    text={trans('See Devices')}
                    style={{marginTop: rs(20)}}
                    icon={<DevicesIcon fill={colors.black} />}
                    onPress={() =>
                      navigation.navigate(screens.residentDevices as never)
                    }
                  />
                  <Button
                    text={trans('Change Pin')}
                    textColor={colors.white}
                    style={{marginTop: rs(9)}}
                    bgColor={colors.secondary}
                    icon={<EliminateIcon />}
                    // onPress={() => handleDelete()}
                    onPress={() => setShowPinModal(true)}
                  />
                  <Button
                    text={trans('Eliminate')}
                    textColor={colors.white}
                    style={{marginTop: rs(9)}}
                    bgColor={colors.error1}
                    icon={<EliminateIcon />}
                    // onPress={() => handleDelete()}
                    onPress={() => setShowDeleteModal(true)}
                  />
                </>
              ) : (
                <Button
                  text={trans('Correct Name in Positions')}
                  style={{marginTop: rs(9)}}
                  textStyle={{color: colors.white}}
                  onPress={() => setOpenCorrectNameModal(true)}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </ScrollView>
        {showPinModal && (
          <ChangePinModal
            title={trans('Resident')}
            onDismiss={() => setShowPinModal(false)}
            onChange={() => {}}
            _id={id}
          />
        )}
        {showDeleteModal && (
          <ConfirmationModal
            title={trans('Resident')}
            para={`${trans('Eliminate resident')} ${values1?.name}?`}
            button2Text={trans('No')}
            button1Text={trans('Confirm')}
            onButton2Press={() => setShowDeleteModal(false)}
            onButton1Press={() => handleDelete()}
            onDismiss={() => setShowDeleteModal(false)}
          />
        )}
        {openCorrectNameModal && (
          <ConfirmationModal
            title={trans('Resident')}
            para={trans(`Update name/address on all Resident positions?`)}
            button2Text={trans('No')}
            button1Text={trans('Confirm')}
            onButton2Press={() => setOpenCorrectNameModal(false)}
            onButton1Press={() => {
              setOpenCorrectNameModal(false);
              setTimeout(() => {
                setOpenCorrectNameChargesModal(true);
              }, 500);
            }}
            onDismiss={() => setOpenCorrectNameModal(false)}
          />
        )}
        {openCorrectChargesNameModal && (
          <ConfirmationModal
            title={trans('Resident')}
            para={trans(`Update 0 charges?`)}
            button2Text={trans('No')}
            button1Text={trans('Confirm')}
            onButton2Press={() => setOpenCorrectNameChargesModal(false)}
            onButton1Press={() => {
              handleUpdate();
              setOpenCorrectNameChargesModal(false);
            }}
            onDismiss={() => setOpenCorrectNameChargesModal(false)}
          />
        )}
      </Container>
    </>
  );
};

export default AddUpdateResident;
