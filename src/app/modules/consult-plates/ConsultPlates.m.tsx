import {Text, TouchableOpacity, Linking, Alert} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {rootApi} from '../../services/features/rootApi';
import {colors} from '../../assets/global-styles/color.assets';
import {adminUrl, moduleName} from '../../services/features/endpoint.api';
import {useTranslation} from 'react-i18next';
import Badge from '../../components/app/Badge.app';
const ConsultPlates = () => {
  const [link, setLink] = useState('');
  const {t: trans} = useTranslation();
  useLayoutEffect(() => {
    fetchLink();
  }, []);

  const fetchLink = async () => {
    var fetchurl = await rootApi(
      'GET',
      `${adminUrl}/${moduleName?.consultPlates}`,
    );
    console.log('fetchUrl', fetchurl);
    var {body, message, status} = fetchurl;
    if (status) {
      setLink(body);
    } else {
      Alert.alert(trans('Error'), trans('Failed to fetch Link'));
    }
  };

  return (
    <Container>
      <Header text="Consult Plates" />

      <Badge
        onPress={() => Linking.openURL(link)}
        text={trans('Visit Link')}
        bgColor={colors.gray5}
        style={{
          width: '50%',
          height: 50,
          backgroundColor: colors.tertiary,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40,
        }}
        textStyle={{
          ...typographies(colors).montserratMedium13.color,
          color: colors.white,
          fontSize: 18,
        }}
        classes="small"
      />
      <Text
        style={[
          typographies(colors).ralewayMedium12,
          {
            textDecorationLine: 'underline',
            textAlign: 'center',
            marginTop: rs(20),
          },
        ]}>
        {}
      </Text>
    </Container>
  );
};

export default ConsultPlates;
