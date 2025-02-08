import {View, Text, ScrollView, StyleSheet} from 'react-native';
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
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import QrReaderServices from '../../services/features/QrReader/QrReader.Services';
import {apiResponse} from '../../services/features/api.interface';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import {
  addAction,
  updateAction,
  deleteAction,
} from '../../state/features/QrReader/QrReaderSlice';
import {NetworkInfo} from 'react-native-network-info';
import {showMessage} from 'react-native-flash-message';
import Button from '../../components/core/button/Button.core';
import LoadingComp from './Components/LoadingComp';
interface RadioButtonGroupProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  heading: string;
}
const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  heading,
}) => {
  const {t: trans} = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => onSelect(option)}>
          <View style={styles.radioButton}>
            {selectedValue === option && <View style={styles.selectedDot} />}
          </View>
          <Text style={styles.optionText}>{trans(option)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const AddQRReadersOptional: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string}};
}> = ({
  route: {params: {edit, index, id} = {edit: false, index: -1, id: ''}},
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [ipGateway, setIpGateway] = useState<string>('');
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const {userInfo} = customUseSelector(userStates);

  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const [loadiings, setLoading] = useState(false);
  const values = useRef<{
    guy: any;
    name: string;
    model: string;
    description: string;
    grades: string;
    delay: number;
    deviceSeries: string;
    ipAddress: string;
    ipGateway: string;
    types: string;
    timeZone: string;
    macAddressSetting: {};
  }>({
    guy: userInfo?._id,
    name: '',
    model: '',
    description: '',
    grades: '',
    delay: 0,
    deviceSeries: '',
    ipAddress: '',
    ipGateway: '',
    types: '',
    timeZone: '',
    macAddressSetting: {},
  });
  useEffect(() => {
    NetworkInfo.getIPAddress().then(ip => {
      setIpAddress(ip || '');
      values.current.ipAddress = ip || '';
    });
    NetworkInfo.getGatewayIPAddress().then(gateway => {
      setIpGateway(gateway || '');
      values.current.ipGateway = gateway || '';
    });
  }, []);
  const handleSelect = (value: string) => {
    setSelectedOption(value);
    let macAddressSettings;

    switch (value) {
      case 'Without Configuration':
        macAddressSettings = 'Without Configuration';
        break;
      case 'Random':
        macAddressSettings = 'Random';
        break;
      case 'Fixed/Default':
        macAddressSettings = 'Fixed/Default';
        break;
      default:
        macAddressSettings = '';
    }
    handleChange(macAddressSettings, 'macAddressSetting');
  };
  const handleChange = (value: any, field?: string) => {
    const oldValues = {...values.current};
    values.current = {...oldValues, [field as string]: value};
  };
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      ...values.current,
      macAddressSetting: values.current.macAddressSetting,
    };
    if (checkEmptyValues(payload)) {
      loading.current = true;
      const result = await (edit
        ? QrReaderServices.update(payload, id)
        : QrReaderServices.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Qr-Reader'),
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
        const result = await QrReaderServices.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            guy: userInfo?._id,
            name: body?.name,
            model: body?.model,
            description: body?.description,
            grades: body?.grades,
            delay: body?.delay,
            deviceSeries: body?.deviceSeries,
            ipAddress: body?.ipAddress,
            ipGateway: body?.ipGateway,
            types: body?.types,
            timeZone: body?.timeZone,
            macAddressSetting: body?.macAddressSetting,
          };
          setSelectedOption(body?.macAddressSetting);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, [edit, id, navigation, userInfo?._id]);
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    QrReaderServices.delete(id);
  };
  return (
    <>
      {loadiings && <LoadingComp />}
      <Container>
        <Header
          text={trans('QR Readers')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <CustomSelect
            placeholder={trans('types')}
            label={trans('Type')}
            data={['Entrance', 'Exit']}
            defaultValue={values.current.types}
            onChange={(value: string) => handleChange(value, 'types')}
          />
          <CustomSelect
            placeholder={trans('Model')}
            label={trans('Model')}
            data={['Residentify M1', 'Residentify M2']}
            onChange={value => handleChange(value, 'model')}
            defaultValue={values?.current?.model}
          />
          <LabelInput
            placeholder={trans('Name')}
            label={trans('Name')}
            onChangeText={value => handleChange(value, 'name')}
            defaultValue={values?.current?.name}
          />
          <MultiLineInput
            placeholder={trans('Description')}
            label={trans('Description')}
            onChangeText={value => handleChange(value, 'description')}
            defaultValue={values?.current?.description}
          />
          <LabelInput
            placeholder={trans('Grades')}
            label={trans('Grades')}
            onChangeText={value => handleChange(value, 'grades')}
            defaultValue={values?.current?.grades}
          />
          <LabelInput
            placeholder={trans('Delay (Seconds)')}
            label={trans('Delay (Seconds)')}
            inputProps={{inputMode: 'numeric'}}
            onChangeText={value => handleChange(parseFloat(value), 'delay')}
            defaultValue={
              values.current?.delay ? values.current?.delay.toString() : ''
            }
          />
          <LabelInput
            placeholder={trans('Devices Series')}
            label={trans('Device Series')}
            onChangeText={value => handleChange(value, 'deviceSeries')}
            defaultValue={values?.current?.deviceSeries}
          />
          <LabelInput
            placeholder={trans('IP Address')}
            label={trans('IP Address')}
            defaultValue={
              values?.current?.ipAddress ||
              values?.current?.ipAddress ||
              ipAddress
            }
            onChangeText={value => handleChange(value, 'ipAddress')}
          />
          <LabelInput
            placeholder={trans('IP Gateway')}
            label={trans('IP Gateway')}
            defaultValue={
              values?.current?.ipGateway ||
              values?.current?.ipGateway ||
              ipGateway
            }
            onChangeText={value => handleChange(value, 'ipGateway')}
          />
          <CustomSelect
            placeholder={trans('Timezone')}
            label={trans('Time Zone')}
            data={[
              'America/Mexico_City',
              'America/Ciudad_Jaurez',
              'America/Cancun',
              'America/Chihuahua',
              'America/Tijuana',
              'America/Mazatlan',
            ]}
            onChange={value => handleChange(value, 'timeZone')}
            defaultValue={values?.current?.timeZone}
          />
          <RadioButtonGroup
            options={['Without Configuration', 'Random', 'Fixed/Default']}
            selectedValue={selectedOption}
            onSelect={handleSelect}
            heading={trans('Mac Address Setting')}
          />
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 12,
    height: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    ...typographies(colors).ralewayMedium12,
    color: colors.gray7,
  },
});

export default AddQRReadersOptional;
