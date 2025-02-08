import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useIsFocused} from '@react-navigation/native';
import myCardService from '../../services/features/myCard/myCard.service';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {useTranslation} from 'react-i18next';
import {colors} from '../../assets/global-styles/color.assets';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const {width} = Dimensions.get('screen');

const MyCard = () => {
  var {userInfo} = customUseSelector(userStates);
  const isFocused = useIsFocused();
  const [loadings, setLoading] = useState(false);
  const {t: trans} = useTranslation();
  var [myCardData, setMyCardData] = useState<any>(null);

  useEffect(() => {
    if (isFocused) {
      fetchMyCardData();
    }
  }, [isFocused]);

  const fetchMyCardData = async () => {
    try {
      let mycard = await myCardService.list();
      console.log('My Card Data from Api: ', mycard);
      var {body, message, status} = mycard;
      if (status) {
        setMyCardData(Array?.isArray(body) ? body[0] : body);
      } else {
        console.log('Error fetching my card:', message);
        Alert.alert('Error!', 'Unable to fetch data!');
      }
    } catch (error) {
      console.log('Error fetching my card:', error);
      Alert.alert('Error!', 'Unable to fetch data!');
    }
  };

  const updateName = async () => {
    setLoading(true);
    let payload = {name: myCardData.name};
    let setName = await myCardService.create(payload);
    console.log(console.log('Name Set', setName));
    var {status, message} = setName;
    if (status) {
      Alert.alert('Succes!', message);
    } else {
      console.log('Error updating my card:', message);
      Alert.alert('Error!', message);
    }
    setLoading(false);
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container bottomTab={false}>
        <Header
          text={trans('My Card')}
          showBg={false}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={() => updateName()}
        />

        <Image
          source={require('../../assets/images/My-Card.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.streetHomeCont}>
          <Text style={styles.streetHomeText}>
            {userInfo?.street?.name} {userInfo?.home}
          </Text>
        </View>

        <TextInput
          value={myCardData?.name}
          style={styles.nameCont}
          onChangeText={txt =>
            setMyCardData((prev: any) => ({...prev, name: txt}))
          }
        />
      </Container>
    </>
  );
};

export default MyCard;

const styles = StyleSheet.create({
  image: {
    width: width - 40,
    height: 150,
    alignSelf: 'center',
  },
  streetHomeCont: {
    width: 140,
    height: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: 'rgba(59,130,246 ,0.5)',
    borderRadius: 80,
  },
  streetHomeText: {
    ...typographies(colors).montserratMedium17,
    color: colors.white,
    fontWeight: '700',
  },
  nameCont: {
    width: width - 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    borderRadius: 20,
    ...typographies(colors).montserratMedium17,
    color: colors.white,
    fontWeight: '700',
  },
});
