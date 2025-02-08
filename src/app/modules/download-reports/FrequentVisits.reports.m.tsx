import {View, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import ShowDate from '../../components/app/ShowDate.app';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import frequentVisitService from '../../services/features/frequentVisit/frequentVisit.service';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';

const FrequentVisitsReports = () => {
  const values = useRef<{
    isdeleted: boolean;
    date: string;
  }>({
    isdeleted: true,
    date: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [showModal, setShowModal] = useState(false);
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const onPressConfirm = async () => {
    setShowModal(false);
    await frequentVisitService.visitRecords(values?.current, trans);
  };
  // updated language 24 aug
  const {t: trans} = useTranslation();
  return (
    <Container>
      <Header text={trans('Frequent Visits')} />
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
          <ActiveOrDisActive
            label={trans('Inculde Deleted Visits')}
            name="isdeleted"
            defaultValue={values.current.isdeleted}
            onChange={handleChange}
          />
        </View>
        <Button
          text={trans('Generate Report')}
          onPress={() => setShowModal(true)}
        />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title={trans('Download Confirmation')}
          para={trans(`Download all Frequently Visited?`)}
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

export default FrequentVisitsReports;
