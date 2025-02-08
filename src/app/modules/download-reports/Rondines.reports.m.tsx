import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import ShowDate from '../../components/app/ShowDate.app';
import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import {trans} from 'i18next';
import rondinesReportService from '../../services/features/rondinesReport/rondinesReport.service';
import {useTranslation} from 'react-i18next';
const RondinesReports = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onPressConfirm = async () => {
    setShowModal(false);
    await rondinesReportService.fetch(
      moment(selectedDate).format('YYYY-MM-DD'),
      trans,
    );
  };
  const {colors} = useTheme();
  const {t: trans} = useTranslation();
  return (
    <Container>
      <Header text={trans('Rondines')} />
      <ScrollView
        contentContainerStyle={[globalStyles.flexRow, styles.container]}>
        <View style={[shadow(colors).bottomBorder, {paddingBottom: rs(5)}]}>
          <ShowDate onPress={date => setSelectedDate(date)} />
        </View>
        <Button
          text={trans('Generate Report')}
          onPress={() => setShowModal(true)}
        />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title={trans('Download Confirmation')}
          para={trans(`Download the Rondines report from the private company?`)}
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

export default RondinesReports;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rs(20),
    flexDirection: 'column',
    height: '100%',
    paddingBottom: rs(20),
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
});
