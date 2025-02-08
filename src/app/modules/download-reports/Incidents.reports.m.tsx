/* eslint-disable react-native/no-inline-styles */
import {View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import ShowDate from '../../components/app/ShowDate.app';
import moment from 'moment';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import incidentReportsService from '../../services/features/incidentsReport/incidentReports.service';
import {useTranslation} from 'react-i18next';
const IncidentsReports = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onPressConfirm = async () => {
    setShowModal(false);
    await incidentReportsService.fetch(
      moment(selectedDate).format('YYYY-MM-DD'),
      trans,
    );
  };
  // updated language 24 aug
  const {t: trans} = useTranslation();
  return (
    <Container>
      <Header text={trans('Incidents')} />
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
          <ShowDate onPress={(date: any) => setSelectedDate(date)} />
        </View>
        <Button
          text={trans('Generate Report')}
          onPress={() => setShowModal(true)}
        />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title={trans('Download Confirmation')}
          para={trans(`Download the Incident report from the private company?`)}
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

export default IncidentsReports;
