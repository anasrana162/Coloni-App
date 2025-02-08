import {View, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import ShowDate from '../../components/app/ShowDate.app';
import CustomSelect from '../../components/app/CustomSelect.app';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import annualExpenseService from '../../services/features/annualExpense/annualExpense.service';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
const AnnualExpensesReports = () => {
  const values = useRef<{
    reportType: string;
    date: string;
  }>({
    reportType: '',
    date: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [showModal, setShowModal] = useState(false);
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };

  const onPressConfirm = async () => {
    setShowModal(false);
    await annualExpenseService.fetch(values?.current, trans);
  };
  const {t: trans} = useTranslation();
  return (
    <Container>
      <Header text={trans('Annual Expense Summary')} />
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
          <View style={[globalStyles.bottomBorder, {paddingBottom: rs(5)}]}>
            <ShowDate onPress={handleChange} name="date" />
          </View>
          <CustomSelect
            style={{marginTop: rs(10)}}
            data={['Summary by Month', 'Expense Detail']}
            placeholder={trans('Report Type')}
            onChange={handleChange}
            name={trans('reportType')}
          />
        </View>
        <Button
          text={trans('Generate Report')}
          onPress={() => setShowModal(true)}
        />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title={trans('Descargar')}
          para={trans(`Download the annual expense from the private company?`)}
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

export default AnnualExpensesReports;
