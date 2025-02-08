import {ScrollView} from 'react-native';
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
import {userStates} from '../../state/allSelector.state';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {getLocalData} from '../../packages/asyncStorage/storageHandle';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import AccessControlServices from '../../services/features/AccessControllers/AccessControl.services';
import {
  addAction,
  updateAction,
  deleteAction,
} from '../../state/features/AccessControl/AccessControl.slice';
import {apiResponse} from '../../services/features/api.interface';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import IconWithInput from '../../components/core/text-input/IconWithInput.core';
import EmailIcon from '../../assets/icons/Email.icon';
import Ip_AdressFeild from './Components/ip_AdressField';
import IpIcon from '../../assets/icons/IP.icon';
import {showMessage} from 'react-native-flash-message';
import Button from '../../components/core/button/Button.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import PasswordInput from '../../components/core/text-input/PasswordInput.core';
import PasswordField from './Components/Passwordfield';
import LoadingComp from './Components/LoadingComp';
const AddAccessControllersOptional: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string}};
}> = ({
  route: {params: {edit, index, id} = {edit: false, index: -1, id: ''}},
}) => {
  const {userInfo} = customUseSelector(userStates);
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();
  const token = getLocalData.getApiToken();
  const [ipAddress, setIpAddress] = useState('');
  const [fetching, setFetching] = useState(false);

  const loading = useRef(false);
  const values = useRef<{
    name: string;
    brand: string;
    description: string;
    password: string;
    port: string;
    ip_address: string;
    user: string;
  }>({
    name: '',
    brand: '',
    description: '',
    password: '',
    port: '',
    ip_address: '',
    user: '',
  });
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setIpAddress(data.ip);
        values.current = {...values.current, ip_address: data.ip};
      })
      .catch(error => console.error('Error fetching IP address:', error));
  }, []);
  const handleIconPress = () => {
    setIpAddress(ipAddress);
  };
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
    if (name === 'ip_address') {
      setIpAddress(value);
    }
  };
  const [loadings, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      residentId: userInfo?._id,
    };

    if (checkEmptyValues(payload)) {
      loading.current = true;

      const result = await (edit
        ? AccessControlServices.update({...payload}, id)
        : AccessControlServices.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Controllers'),
          body: message,
        });
      }

      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Invalid'),
        body: trans('Please fill-up correctly'),
      });
    }
    setLoading(false);
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await AccessControlServices.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            name: body?.name,
            brand: body?.brand,
            description: body?.description,
            password: body?.password,
            port: body?.port,
            ip_address: body?.ip_address,
            user: body?.user,
          };
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
    AccessControlServices.delete(id);
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Controllers')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <CustomSelect
            placeholder={trans('Brand')}
            data={['HikVision', 'Zkteco']}
            name={trans('Brand')}
            onChange={value => handleChange(value, 'brand')}
            defaultValue={values?.current?.brand}
          />
          <LabelInput
            placeholder={trans('Name')}
            name="name"
            onChangeText={value => handleChange(value, 'name')}
            defaultValue={values?.current?.name}
          />

          <LabelInput
            placeholder={trans('Description')}
            name="description"
            onChangeText={value => handleChange(value, 'description')}
            defaultValue={values?.current?.description}
          />
          <Ip_AdressFeild
            icon={<IpIcon />}
            onChangeText={value => handleChange(value, 'ip_address')}
            placeholder={trans('ip_Address')}
            style={{...customMargin(0, 0, 10, 0)}}
            value={ipAddress}
            onIconPress={handleIconPress}
            defaultValue={values?.current?.ip_address}
          />
          <LabelInput
            placeholder={trans('Port')}
            name="port"
            onChangeText={value => handleChange(value, 'port')}
            defaultValue={values?.current?.port}
          />
          <LabelInput
            placeholder={trans('User')}
            name="user"
            onChangeText={value => handleChange(value, 'user')}
            defaultValue={values?.current?.user}
          />
          <PasswordField
            placeholder={trans('Password')}
            onChangeText={value => handleChange(value, 'password')}
            name="password"
            defaultValue={values?.current?.password}
          />
          {edit ? (
            <Button
              text="Eliminate"
              style={{marginTop: rs(20), backgroundColor: colors.eliminateBtn}}
              textColor={colors.white}
              onPress={handleDelete}
            />
          ) : null}
        </ScrollView>
      </Container>
    </>
  );
};

export default AddAccessControllersOptional;
