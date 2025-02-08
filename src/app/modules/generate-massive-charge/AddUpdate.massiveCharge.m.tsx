import React, {useLayoutEffect, useState} from 'react';
import {View, Text, ScrollView, Alert} from 'react-native';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import Button from '../../components/core/button/Button.core';
import Badge from '../../components/app/Badge.app';
import {screens} from '../../routes/routeName.route';
import {useCustomNavigation} from '../../packages/navigation.package';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import PaymentType from '../bills/bottomSheet/PaymentType.bottomSheet';
import expensesService from '../../services/features/expenses/expenses.service';
import moment from 'moment';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {apiResponse} from '../../services/features/api.interface';
import generateMassiveChargesSlice, {
  addAction,
  updateAction,
} from '../../state/features/massive-charges/generateMassiveCharges.slice';
import {momentTimezone} from '../../packages/momentTimezone.package';
import generateMassiveCharges from '../../services/features/generate-massive-charges/generateMassiveCharges';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import {useTranslation} from 'react-i18next';
import {userStates} from '../../state/allSelector.state';

const AddUpdateMassiveCharge: React.FC<{
  
  route: {params?: {add?: boolean; item?: any; index?: number}};
}> = ({route: {params: {add = false, item = {}, index = -1} = {}}}) => {
  const navigation = useCustomNavigation();
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation(); 
  const [openConfirmModal, setOpenConfirmModal] = useState(false); 
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    paymentTypeId: '',
    paymentDate: moment(new Date()).format('DD-MM-YYYY'),
    amount: '',
    dueDate: moment(new Date()).format('DD-MM-YYYY'),
    status: 'Pending',
    includeInactive: false,
    skipExisting: false,
    note: '',
    overdue: false,
    resident: userInfo._id,
  });
  
  useLayoutEffect(() => {
    setFormData({
      paymentTypeId: item?.paymentType?._id,
      paymentDate: item?.paymentDate,
      amount: item?.amount,
      dueDate: item?.dueDate, 
      status: item?.status,
      includeInactive: item?.includeInactive,
      skipExisting: item?.skipExisting,
      note: item?.note,
      overdue: item?.overdue,
      resident: userInfo._id,
    });
  }, []);

  const handleInputChange = (name: string, value: any) => {
    if (name === 'paymentTypeId' && typeof value === 'object') {
      value = value._id; // Serialize the ID only
    }
    if (name === 'dueDate' || name === 'paymentDate') {
      // Format date as "YYYY-MM-DD"
      const formattedDate = new Date(value).toISOString().split('T')[0];
      value = formattedDate;
    }
    setFormData({...formData, [name]: value});
  };
  const dispatch = customUseDispatch(); 
  const handleSubmit = async () => {
    // Check if any of the required fields are empty
    
    if (!formData.paymentTypeId) {
      Alert.alert('Validation Error', 'Please select payment type!.');
      return; // Prevent the form submission
    }
    if (!formData.paymentDate) {
      Alert.alert('Validation Error', 'Please select date!.');
      return; // Prevent the form submission
    }
    if (!formData.amount) {
      Alert.alert('Validation Error', 'Please fill amount feild !.');
      return; // Prevent the form submission
    }
    if (!formData.dueDate) {
      Alert.alert('Validation Error', 'Please select expiration date !.');
      return; // Prevent the form submission
    }
    if (!formData.note) {
      Alert.alert('Validation Error', 'Please select expiration date !.');
      return; // Prevent the form submission
    }

    try {
      const formattedData = {
        ...formData,
        paymentTypeId: formData.paymentTypeId, // Extract ID only
        dueDate: formData.dueDate,
        paymentDate: formData.paymentDate || '', // Ensure date is a string
      };


      const resp = await (add
        ? generateMassiveCharges.update(formattedData, item?._id)
        : generateMassiveCharges.createMassiveCharges(formattedData));
      const {status, body, message} = resp as apiResponse;
      if (status) {
        add
          ? dispatch(updateAction({item: body, index, id: item?._id}))
          : dispatch(addAction(body));
        setFormData({
          paymentTypeId: '',
          paymentDate: '',
          amount: '',
          dueDate: '',
          status: 'Pending',
          includeInactive: false,
          skipExisting: false,
          note: '',
          overdue: false,
          resident: userInfo._id,
        });
        add
          ? Alert.alert(trans('Successfull!!!'), trans('Massive charge updated'))
          : Alert.alert(trans('Successfull!!!'), trans('Massive charge added'));
        navigation.goBack();
      } else {
        add
          ? Alert.alert(trans('Error!!!'), trans('Failed to update charges'))
          : Alert.alert(trans('Error!!!'), trans('Failed to add charges'));
      }
    } catch (error) {
      console.log('Error in API request:', error);
    }
  };

  const deleteCharges = async () => {
    console.log('Reachin delete');
    try {
      let deleteCharge = await generateMassiveCharges.delete(item?._id);
      console.log('deleteCharge response', deleteCharge);
      var {status, message} = deleteCharge;
      if (status) {
        Alert.alert(trans('Success'), message);
        navigation.goBack();
      } else {
        Alert.alert(trans('Error'), trans('Failed to delete'));
      }
    } catch (error) {}
  };

  return (
    <Container>
      <Header
        text="Massive Charges"
        rightIcon={add ? null : <ImagePreview source={imageLink.saveIcon} />} 
        rightControl={add ? () => {} : handleSubmit} 
      />
      <ScrollView
        style={{...customPadding(10)}}
        contentContainerStyle={{...customPadding(0, 20, 20, 20)}}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <PaymentType
          label={trans('Payment Type')}
          disabled={add ? true : false}
          defaultValue={item?.paymentType}
          ScreenName={'massive'}
          onChange={value => handleInputChange('paymentTypeId', value)}
        />
        <DateTimeInput
          label={trans('Date')}
          placeholder=""
          disabled={add ? true : false}
          defaultValue={
            new Date(moment(formData?.paymentDate).format('YYYY-MM-DD'))
          } 
          onChange={value => handleInputChange('paymentDate', value)}
        />
        <DateTimeInput
          label={trans('Expiration Date')}
          placeholder=""
          defaultValue={
            new Date(moment(formData?.dueDate).format('YYYY-MM-DD'))
          } 
          onChange={value => handleInputChange('dueDate', value)}
        />
        <LabelInput
          label={trans('Amount')}
          inputProps={{inputMode: 'numeric'}}
          placeholder=""
          defaultValue={formData?.amount} 
          onChangeText={value => handleInputChange('amount', value)}
        />
        <LabelInput
          label={trans('Note')}
          defaultValue={formData?.note} 
          onChangeText={value => handleInputChange('note', value)}
        />
        <ActiveOrDisActive
          label={trans('Include inactive')}
          style={{...customPadding(11, 0, 20)}}
          defaultValue={formData?.includeInactive} 
          onChange={value => handleInputChange('includeInactive', value)}
        />
        <ActiveOrDisActive
          label={trans('Skip existing')}
          style={{...customPadding(11, 0)}}
          defaultValue={formData?.skipExisting} 
          onChange={value => handleInputChange('skipExisting', value)}
        />
        <View style={{...customPadding(18)}}>
          {add ? (
            <>
              <Text
                style={[
                  typographies(colors).ralewayMedium10,
                  {color: colors.gray3, marginBottom: rs(10)},
                ]}>
                {trans(
                  `A charge of the Fee or Balance in Favor type will not be generated if the resident already has the charge registered in the month of ${momentTimezone(
                    new Date(),
                  ).format('MMMM')}`,
                )}
              </Text>
              <View style={[globalStyles.flexRow, {marginTop: rs(20)}]}>
                <Badge
                  onPress={handleSubmit} 
                  text={trans('Update')}
                  style={{
                    borderRadius: rs(10),
                    flexGrow: 1 / 2,
                    width: '48%',
                  }}
                  bgColor={colors.secondary}
                />
                <Badge
                  text={trans('Surcharges')}
                  style={{
                    borderRadius: rs(10),
                    flexGrow: 1 / 2,
                    width: '48%',
                  }}
                  onPress={() => {
                    navigation.navigate(
                      screens.surchargesMassiveCharges as never,
                      {id: item?._id, resident: item?.resident},
                    );
                  }}
                  bgColor={colors.secondary}
                />
              </View>
              <View
                style={[
                  globalStyles.flexRow,
                  {marginTop: rs(10), alignSelf: 'center'},
                ]}>
                <Badge
                  text={trans('Eliminate')}
                  style={{
                    borderRadius: rs(10),
                    flexGrow: 1 / 2,
                    width: '48%',
                  }}
                  onPress={() => setOpenConfirmDeleteModal(true)}
                  bgColor={colors.eliminateBtn}
                />
              </View>
            </>
          ) : (
            <>
              <Text
                style={[
                  typographies(colors).ralewayMedium10,
                  {color: colors.gray3, marginBottom: rs(10)},
                ]}>
                {trans('Charges will be generated for inactive residents')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewayMedium10,
                  {color: colors.gray3, marginBottom: rs(10)},
                ]}>
                {trans('Skip existing')}
              </Text>
            </>
          )}
        </View>
      </ScrollView>
      {openConfirmModal && (
        <ConfirmationModal
          onDismiss={() => {
            setOpenConfirmModal(false);
          }}
          title={trans('Charges')}
          para={trans(
            'Validate charges pending to be generated in this Mass Charge?',
          )}
          button2Text={trans('No')}
          onButton2Press={() => {
            setOpenConfirmModal(false);
          }}
          button1Text={trans('Confirm')}
          onButton1Press={() => {
            navigation.goBack();
            setOpenConfirmModal(false);
          }}
        />
      )}
      {openConfirmDeleteModal && (
        <ConfirmationModal
          onDismiss={() => {
            setOpenConfirmDeleteModal(false);
          }}
          title={trans('Charges')}
          para={trans('Are you sure you want to delete this charge?')}
          button2Text={trans('No')}
          onButton2Press={() => {
            setOpenConfirmDeleteModal(false);
          }}
          button1Text={trans('Confirm')}
          onButton1Press={() => {
            deleteCharges();
            setOpenConfirmDeleteModal(false);
          }}
        />
      )}
    </Container>
  );
};

export default AddUpdateMassiveCharge;
