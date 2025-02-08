import { View, ScrollView, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { globalStyles } from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import ShowDate from '../../components/app/ShowDate.app';
import CustomSelect from '../../components/app/CustomSelect.app';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import annualIncomeService from '../../services/features/annualIncome/annualIncome.service';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
const AnnualIncomeReports = () => {
  const { t: trans } = useTranslation()
  const values = useRef<{
    paymentType: string;
    reportType: string,
    payDay: string,
  }>({
    paymentType: '',
    reportType: '',
    payDay: moment(new Date()).format("YYYY-MM-DD")

  });
  const [showModal, setShowModal] = useState(false)
  const handleChange = (value: any, name?: any) => {
    if(name== "payDay"){
      value = moment(value).format("YYYY-MM-DD")
    }
    values.current = { ...values.current, [name]: value };
  };

  const onPressConfirm = async () => {
    setShowModal(false)
    if (!values.current.paymentType) {
      return Alert.alert("Error", "Select Payment Type!")
    }
    if (!values.current.reportType) {
      return Alert.alert("Error", "Select Report Type!")
    }
    await annualIncomeService.fetch(values?.current,trans)
  }
  // updated language 24 aug
  return (
    <Container>
      <Header text={trans("Annual Income Summary")} />
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
          <View style={[globalStyles.bottomBorder, { paddingBottom: rs(5) }]}>
            <ShowDate onPress={handleChange} name='payDay' />
          </View>
          <CustomSelect
            style={{ marginTop: rs(10) }}
            data={[trans('Share'), trans('Positive Balance'), trans('Amenity')]}
            placeholder={trans("Payment Type")}
            name='paymentType'
            onChange={handleChange}
          />
          <CustomSelect
            style={{ marginTop: rs(10) }}
            data={[
              'Summary by Month',
              'Expense Detail',
            ]}
            placeholder={trans("Report Type")}
            name='reportType'
            onChange={handleChange}
          />
        </View>
        <Button text={trans("Generate Report")} onPress={() => setShowModal(true)} />
      </ScrollView>
      {showModal && <ConfirmationModal
        title={trans('Descargar')}
        para={trans(`Download the annual income from the private company?`)}
        button1Text={trans("Confirm")}
        button2Text={trans("Cancel")}
        onButton1Press={() => onPressConfirm()}
        onButton2Press={() => setShowModal(false)}
        onDismiss={() => setShowModal(false)} />}
    </Container>
  );
};

export default AnnualIncomeReports;
