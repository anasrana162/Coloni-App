import {View, Text} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

const DarkMode = () => {
  const {t: trans} = useTranslation();

  return (
    <View>
      <Text>{trans('DarkMode')}</Text>
    </View>
  );
};

export default DarkMode;
