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
import monthlyIncomeService from '../../services/features/monthlyIncome/monthlyIncome.service';
import {useTranslation} from 'react-i18next';
const IncomeReports = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {t: trans} = useTranslation();

  const onPressConfirm = async () => {
    setShowModal(false);
    await monthlyIncomeService.fetch(
      moment(selectedDate).format('YYYY-MM-DD'),
      trans,
    );
  };
  return (
    <Container>
      <Header text="Income" />
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
          <ShowDate selectDate={(date: string) => setSelectedDate(date)} />
        </View>
        <Button text="Generate Income" onPress={() => setShowModal(true)} />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title="Descargar"
          para={`Download the ${moment(selectedDate).format(
            'DD-MM-YYYY',
          )} income from the private company?`}
          button1Text={'Confirm'}
          button2Text={'Cancel'}
          onButton1Press={() => onPressConfirm()}
          onButton2Press={() => setShowModal(false)}
          onDismiss={() => setShowModal(false)}
        />
      )}
    </Container>
  );
};

export default IncomeReports;
