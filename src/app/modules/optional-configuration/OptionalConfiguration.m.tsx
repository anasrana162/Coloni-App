import {ScrollView} from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import ListComponentCard from '../../components/app/ListComponentCard.app';
import {optionalConfigurationList} from '../../assets/ts/dropdown.data';
import {useTranslation} from 'react-i18next';

const OptionalConfiguration = () => {
  const {t: trans} = useTranslation();
  return (
    <Container>
      <Header text={trans('Optional Configuration')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{...customPadding(10, 0, 20, 0)}}>
        {optionalConfigurationList.map((item, index: number) => (
          <ListComponentCard item={item} key={index} />
        ))}
      </ScrollView>
    </Container>
  );
};

export default OptionalConfiguration;
