import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {useTranslation} from 'react-i18next';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {userStates} from '../../state/allSelector.state';
import {userRoles} from '../../assets/ts/core.data';
import imageLink from '../../assets/images/imageLink';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import {screens} from '../../routes/routeName.route';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {config} from '../../../Config';
import generateMassiveCharges from '../../services/features/generate-massive-charges/generateMassiveCharges';
import {colors} from '../../assets/global-styles/color.assets';
import moment from 'moment';
import {momentTimezone} from '../../packages/momentTimezone.package';
import CustomSelect from '../../components/app/CustomSelect.app';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import {checkEmptyValues} from '../../utilities/helper';
const {width, height} = Dimensions.get('screen');

const AddSurchargeMassiveCharges: React.FC<{
  route: {params?: {id?: string; resident: string}};
}> = ({route: {params: {id = '', resident = ''} = {}}}) => {
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  const loading = useRef(false);
  const {userInfo} = customUseSelector(userStates);
  const [formData, setFormData] = useState({
    increamentType: '',
    valor: 0,
    note: 'new document',
    separateSurcharges: false,
    includeApproved: false,
    massiveCharge: id,
    resident: resident,
  });
  console.log('Item resident', id, 'resident:', resident);

  const handleChange = (value: any, name?: any) => {
    setFormData((prev: any) => ({...prev, [name]: value}));
  };

  const handleSubmit = async () => {
    let {valor, increamentType, note, massiveCharge, resident} = formData;
    console.log('formdata', formData, ' Token: ', config.token);
    if (increamentType == 'percentage' && valor > 100) {
      return Alert.alert(trans('Error'), trans('Enter valid Percentage!'));
    }
    if (valor == 0) {
      return Alert.alert(trans('Error'), trans('Enter valid amount!'));
    }
    if (note.length == 0) {
      return Alert.alert(trans('Error'), trans('Please provide a note!'));
    }
    if (increamentType.length == 0) {
      return Alert.alert(trans('Error'), trans('Please select a Increment type!'));
    }
    if (massiveCharge.length == 0) {
      return Alert.alert(trans('Error'), trans('Missing a feild'));
    }
    if (resident.length == 0) {
      return Alert.alert(trans('Error'), trans('Missing a feild'));
    }
    try {
      let createCharge = await generateMassiveCharges.createSurcharge(formData);
      console.log('Response when creating Surcharge', createCharge);
      var {body, status, message} = createCharge;
      if (status) {
        Alert.alert(trans('Success'), trans('Created Successfully!'));
        navigation.goBack();
      } else {
        Alert.alert(trans('Error'), trans('Failed to create'));
      }
    } catch (error) {
      console.log('Error creating surcharge!', error);
      Alert.alert(trans('Error'), trans('Failed to create'));
    }
  };

  return (
    <Container>
      <Header
        text={`Fee ${momentTimezone().format(' MMM YYYY')}`}
        rightIcon={
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN ? (
            <ImagePreview source={imageLink.saveIcon} />
          ) : undefined
        }
        rightControl={
          () => handleSubmit() // navigation.navigate(screens.ChargesMonthCharge as never)
        }
      />
      <ScrollView style={{width: width - 40, alignSelf: 'center'}}>
        <CustomSelect
          data={[trans('Percentage'), trans('Amount')]}
          label={trans('Increment Type')}
          defaultValue={formData.increamentType}
          placeholder={trans('Status')}
          onChange={(value: string) =>
            handleChange(value.toLowerCase(), 'increamentType')
          }
        />
        {formData?.increamentType == 'amount' && (
          <LabelInput
            label={trans('Amount')}
            defaultValue={
              formData.valor == 0 || isNaN(formData.valor)
                ? ''
                : `${formData?.valor}`
            }
            placeholder={trans('Amount')}
            name="valor"
            onChangeText={(num, name) => handleChange(parseInt(num), name)}
            inputProps={{inputMode: 'decimal'}}
          />
        )}
        {formData?.increamentType == 'percentage' && (
          <LabelInput
            label={trans('Valor (0-100)%')}
            defaultValue={
              formData.valor == 0 || isNaN(formData.valor)
                ? ''
                : `${formData?.valor}`
            }
            placeholder={trans('Percentage')}
            name="valor"
            onChangeText={(num, name) => handleChange(parseInt(num), name)}
          />
        )}
        <MultiLineInput
          label={trans('Note')}
          placeholder={trans('Note')}
          name="note"
          onChangeText={handleChange}
        />
        <ActiveOrDisActive
          label={trans('Separate Surcharges')}
          style={{...customPadding(11, 0, 20)}}
          defaultValue={formData?.separateSurcharges}
          onChange={value => handleChange(value, 'separateSurcharges')}
        />
        <ActiveOrDisActive
          label="Include Approved"
          style={{...customPadding(11, 0)}}
          defaultValue={formData?.includeApproved}
          onChange={value => handleChange(value, 'includeApproved')}
        />
        <Text
          style={{
            ...typographies(colors).montserratMedium13,
            color: colors.primary,
            marginTop: 15,
          }}>
          {trans(
            'This process will affect the pending and to be approved installments with the specified amount. Make sure you have approved all applicable fees before running this process.',
          )}
        </Text>
      </ScrollView>
    </Container>
  );
};

export default AddSurchargeMassiveCharges;

const styles = StyleSheet.create({});
