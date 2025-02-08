import {View, ScrollView, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import {useTranslation} from 'react-i18next';

import moment from 'moment';
import ConfirmationModal from '../../components/app/ConfrimationModal';
import advancedSFService from '../../services/features/advancedSF/advancedSF.service';

const AdvancesSFReports = () => {
  const values = useRef<{
    date: string;
  }>({
    date: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [showModal, setShowModal] = useState(false);
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };

  const onPressConfirm = async () => {
    setShowModal(false);
    await advancedSFService.fetch(values?.current, trans);
  };

  // language update aug 24
  const {t: trans} = useTranslation();
  return (
    <Container>
      <Header text={trans('Advances/SF to be Processed')} />
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
          <Text />
        </View>
        <Button
          text={trans('Generate File')}
          onPress={() => setShowModal(true)}
        />
      </ScrollView>
      {showModal && (
        <ConfirmationModal
          title={trans('Descargar')}
          para={trans(
            `Download the advances to be processed from the private company?`,
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

export default AdvancesSFReports;
