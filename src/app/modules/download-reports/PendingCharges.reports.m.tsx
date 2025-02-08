/* eslint-disable react-native/no-inline-styles */
import {View, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import LabelInput from '../../components/app/LabelInput.app';
import CustomSelect from '../../components/app/CustomSelect.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {useTranslation} from 'react-i18next';
import {config} from '../../../Config';
import pendingChargesServices from '../../services/features/pendingCharges/pendingCharges.services';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import moment from 'moment';

const PendingChargesReports = () => {
  const {t: trans} = useTranslation();
  const values = useRef<{
    date: Date;
    reportType: string;
  }>({
    date: new Date(),
    reportType: '',
  });
  const [showModal, setShowModal] = useState(false);
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };

  const getCharges = async () => {
    await pendingChargesServices?.fetch(values.current, trans);
  };
  const onPressConfirm = () => {
    setShowModal(false);
    getCharges();
  };

  return (
    <Container>
      <Header text={trans('Pending Charges')} />
      <ScrollView
        contentContainerStyle={[
          globalStyles.flexRow,
          {
            paddingHorizontal: rs(20),
            flexDirection: 'column',
            height: '100%',
            paddingBottom: rs(20),
            alignItems: 'stretch',
            justifyContent: 'space-between',
          },
        ]}>
        <View>
          <CustomSelect
            style={{marginTop: rs(10)}}
            data={['income', 'outcome']}
            onChange={handleChange}
            name="reportType"
            placeholder={trans('Report Type')}
          />
          <DateTimeInput
            placeholder={trans('Day')}
            defaultValue={values.current.date}
            name="date"
            onChange={handleChange}
          />
        </View>
        <Button
          text={trans('Get Charges')}
          onPress={() => setShowModal(true)}
        />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title={trans('Descargar')}
          para={trans(
            `Download the ${moment(values.current.date || '').format(
              'DD-MM-YYYY',
            )} income from the private company?`,
          )}
          button1Text={trans('Confirm')}
          button2Text={trans('Cancel')}
          onButton1Press={() => onPressConfirm()}
          onButton2Press={() => setShowModal(false)}
          onDismiss={() => setShowModal(false)}
        />
      )}
    </Container>
  );
};

export default PendingChargesReports;
