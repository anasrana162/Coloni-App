import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customMargin,
  customPadding,
} from '../../assets/global-styles/global.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import VirtualphoneServices from '../../services/features/VirtualPhone/Virtualphone.Services';
import {apiResponse} from '../../services/features/api.interface';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/VirtualPhone/VirtualPhoneSlice';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {showMessage} from 'react-native-flash-message';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import LoadingComp from './Components/LoadingComp';
const AddVirtualInterphoneOptional: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string; item: any}};
}> = ({
  route: {params: {edit, index, id, item} = {edit: false, index: -1, id: ''}},
}) => {
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const values = useRef<{
    guy: string;
    sipUser: any;
    openingKey: any;
    accessPin: any;
    name: string;
    useAccessPin: boolean;
    useVisitPin: boolean;
  }>({
    guy: '',
    sipUser: '',
    accessPin: '',
    openingKey: '',
    name: '',
    useAccessPin: false,
    useVisitPin: false,
  });
  const [useAccessPin, setUseAccessPin] = useState(values.current.useAccessPin);
  const [useVisitPin, setUseVisitPin] = useState(values.current.useVisitPin);
  const [accessPin, setAccessPin] = useState();
  const [openingKey, setOpeningKey] = useState();
  const [loadings, setLoading] = useState(false);

  useEffect(() => {
    setAccessPin(accessPin);
    setOpeningKey(openingKey);
  }, []);
  const handleChange = (value: any, field?: string) => {
    const oldValues = {...values.current};
    values.current = {...oldValues, [field as string]: value};
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };
    if (checkEmptyValues(payload)) {
      loading.current = true;
      const result = await (edit
        ? VirtualphoneServices.update(payload, id)
        : VirtualphoneServices.create(payload));
      const {status, body, message} = result as apiResponse;

      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Virtual Interphone'),
          body: message,
        });
      }
      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Virtual Interphone'),
        body: 'Please fill-up correctly!',
      });
    }
    setLoading(false);
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await VirtualphoneServices.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            guy: body?.guy,
            sipUser: body?.sipUser,
            accessPin: body?.accessPin,
            openingKey: body?.openingKey,
            name: body?.name,
            useAccessPin: body?.useAccessPin,
            useVisitPin: body?.useVisitPin,
          };
          setUseAccessPin(body?.useAccessPin);
          setUseVisitPin(body?.useVisitPin);
          setAccessPin(body?.accessPin);
          setOpeningKey(body?.openingKey);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    VirtualphoneServices.delete(id);
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Virtual Interphone')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <CustomSelect
            placeholder={trans('Type')}
            label={trans('Type')}
            data={['Entrance', 'Exit']}
            onChange={value => handleChange(value, 'guy')}
            defaultValue={values.current.guy}
          />

          <LabelInput
            placeholder={trans('Name')}
            label={trans('Name')}
            onChangeText={value => handleChange(value, 'name')}
            defaultValue={values.current.name}
          />
          <LabelInput
            placeholder={trans('SIP User')}
            label={trans('SIP User')}
            onChangeText={value => handleChange(value, 'sipUser')}
            defaultValue={values.current.sipUser}
          />
          <ActiveOrDisActive
            label={trans('Use Access PIN')}
            onChange={value => {
              handleChange(value, 'useAccessPin');
              setUseAccessPin(value);
            }}
            defaultValue={useAccessPin}
          />
          {useAccessPin && (
            <LabelInput
              style={{marginTop: rs(10)}}
              placeholder={trans('Access PIN (6 Digits)')}
              //label={trans('Access PIN')}
              onChangeText={value => handleChange(value, 'accessPin')}
              defaultValue={accessPin}
            />
          )}

          <ActiveOrDisActive
            label={trans('Use Visit PIN')}
            style={{marginTop: rs(10)}}
            onChange={value => {
              handleChange(value, 'useVisitPin');
              setUseVisitPin(value);
            }}
            defaultValue={useVisitPin}
          />
          {useVisitPin && (
            <>
              <Text
                style={{
                  ...typographies(colors).ralewayMedium12,
                  color: colors.gray7,
                  ...customMargin(10, 10, 0, 10),
                }}>
                {trans(
                  'Allow your visitors access by entering a PIN. Ask your dealer to activate this service. The use of this service consumes 0.25 minutes per event (4 openings are equivalent to one call) \n It is necessary to register a QR Reader to relate it to the Interfon.',
                )}
              </Text>
              <LabelInput
                placeholder={trans('Opening Key')}
                style={{marginTop: rs(10)}}
                defaultValue={openingKey}
                //label={trans('Visit PIN')}
                onChangeText={value => handleChange(value, 'openingKey')}
              />
            </>
          )}
        </ScrollView>
        {edit ? (
          <Button
            text={trans('Eliminate')}
            style={{
              backgroundColor: colors.eliminateBtn,
              ...customMargin(10, 20, 20, 20),
            }}
            textColor={colors.white}
            onPress={handleDelete}
          />
        ) : null}
      </Container>
    </>
  );
};

export default AddVirtualInterphoneOptional;
