import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import Badge from '../../components/app/Badge.app';
import surveysService from '../../services/features/surveys/surveys.service';
import {apiResponse} from '../../services/features/api.interface';
import {useCustomNavigation} from '../../packages/navigation.package';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {showMessage} from 'react-native-flash-message';
import {checkEmptyValues, formatDate} from '../../utilities/helper';
import LabelInput from '../../components/app/LabelInput.app';
import ArrowLeftIcon from '../../assets/icons/ArrowLeft.icon';
import {useTheme} from '@react-navigation/native';
import Button from '../../components/core/button/Button.core';
import SearchInput from '../../components/app/SearchInput.app';
import {ScrollView} from 'react-native-gesture-handler';
import oneOptionModal from './oneOptionModal';
import OneOptionModal from './oneOptionModal';
import FavorVotesDetails from './Components/FavorVotesDetails';
import AgainstVotesDetails from './Components/AgainstVotesDetails';
import RNFS from 'react-native-fs';
import {getLocalData} from '../../packages/asyncStorage/storageHandle';
import {surveysEndPoint} from '../../services/features/endpoint.api';
import {nanoid} from '@reduxjs/toolkit';
const DetailsSurveys: React.FC<{route: {params: {id: string; item: any}}}> = ({
  route: {params: {id = '', item} = {id: ''}},
}) => {
  const {t: trans} = useTranslation();

  console.log('cecking item', item);

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigation = useCustomNavigation<any>();
  const [showModal, setShowModal] = useState(false);
  const fetchDataAndDownloadCSV = async (id: any) => {
    setLoading(true);
    const token = await getLocalData.getApiToken();
    try {
      const url = `${surveysEndPoint.download}${id}`;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      };

      const response = await fetch(url, {method: 'GET', headers});
      console.log(
        `Status: ${response.status}, Status Text: ${response.statusText}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
      }

      const responseText = await response.text();
      const sanitizedResponseText = responseText
        .replace(/\r?\n|\r/g, '\n')
        .trim();

      console.log('Raw Response Text:', sanitizedResponseText);
      const path =
        Platform.OS == 'ios'
          ? `${RNFS.DocumentDirectoryPath}/SurveyDetail${nanoid()}.csv`
          : `${RNFS.DownloadDirectoryPath}/SurveyDetail.csv`;
      if (responseText.trim() === '') {
        throw new Error('No data received from API');
      }
      await RNFS.writeFile(path, responseText, 'utf8');
      console.log('path', path);
      Alert.alert(trans('Success'), `${trans('CSV file has been saved to')} {' '} ${path}`);
      {
        Platform.OS === 'android'
          ? ToastAndroid.show('File saved successfully!', ToastAndroid.SHORT)
          : showMessage({
              message: 'File saved successfully!',
            });
      }
    } catch (error) {
      console.error('Error', error);
      Alert.alert(
        trans('Error'),
        trans('Failed to download or save the CSV file'),
      );
    }
  };
  const fetchData = async () => {
    setLoading(true);
    const result = await surveysService.details(id);
    const {status, body, message} = result as apiResponse;

    if (status) {
      setData(body);
    } else {
      navigation.goBack();
      showMessage({message});
    }
    setLoading(false);
  };
  useLayoutEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  return (
    <Container>
      <Header text={trans('Answer')} />
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SearchInput style={{...customMargin(20, 20, 4, 20)}} />
          <View style={customPadding(10)}>
            <Button
              style={{...customMargin(4, 20, 4, 20)}}
              text={trans('Discharge')}
              onPress={() => setShowModal(true)}
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.TextContainer}>
              <Text style={styles.InFavour}>{trans('In Favour')}</Text>
              <Text style={styles.InFavour}>
                {data?.favorVotes} {data?.favorPercentage}%
              </Text>
            </View>
          </View>
        </ScrollView>
        <View>
          <View>
            <FavorVotesDetails
              id={id}
              // item={item}
            />
          </View>
        </View>

        <View>
          <View style={styles.detailsContainer}>
            <View style={styles.TextContainer}>
              <Text style={styles.InFavour}>{trans('Against')}</Text>
              <Text style={styles.InFavour}>
                {data?.againstVotes} {data?.againstPercentage}%{' '}
              </Text>
            </View>
          </View>

          <View>
            <AgainstVotesDetails
              id={id}
              // item={item}
            />
          </View>
        </View>

        {showModal && (
          <OneOptionModal
            title={trans('Notify')}
            para={trans('Instruct the resident to review the incident?')}
            button1Text={trans('Confirm')}
            onButton1Press={async () => {
              try {
                await fetchDataAndDownloadCSV(id);
              } catch (error) {
                console.error('Error generating CSV:', error);
              }
              setShowModal(false);
            }}
          />
        )}
      </View>
    </Container>
  );
};
const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: colors.gray3,
    ...customMargin(20, 0, 0, 0),
    ...customPadding(10, 22, 10, 22),
  },
  TextContainer: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
  },
  subContainer: {
    ...customMargin(0, 20, 4, 20),
    ...customPadding(8, 6, 4, 6),
  },

  InFavour: {
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
  },
  voteItem: {
    padding: 10,
    backgroundColor: colors.gray3,
    marginBottom: 5,
  },
  userName: {
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
  },
  voteDate: {
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
  },
  deviceInfo: {
    ...typographies(colors).ralewayMedium12,
    color: colors.secondary,
  },
});
export default DetailsSurveys;
