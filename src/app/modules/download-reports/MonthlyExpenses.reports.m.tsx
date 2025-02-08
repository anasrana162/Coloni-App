import {View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import ShowDate from '../../components/app/ShowDate.app';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import moment from 'moment';
import monthlyExpenseService from '../../services/features/monthlyExpense/monthlyExpense.service';
import {useTranslation} from 'react-i18next';

const MonthlyExpensesReports = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {t: trans} = useTranslation();

  const onPressConfirm = async () => {
    setShowModal(false);
    await monthlyExpenseService.fetch(
      moment(selectedDate).format('YYYY-MM-DD'),
      trans,
    );
  };
  // updated language 23 aug
  return (
    <Container>
      <Header text={trans('Monthly Expenses')} />
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
        <View style={[globalStyles.bottomBorder, {paddingBottom: rs(5)}]}>
          <ShowDate onPress={(date: string) => setSelectedDate(date)} />
        </View>
        <Button
          text={trans('Generate Expenses')}
          onPress={() => setShowModal(true)}
        />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title={trans('Descargar')}
          para={trans(
            `Download the monthly expense report from the private company?`,
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

export default MonthlyExpensesReports;
