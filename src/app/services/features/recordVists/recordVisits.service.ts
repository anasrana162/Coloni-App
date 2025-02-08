import {config} from '../../../../Config';
import {recordVisitsEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';
import {Alert, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {useTranslation} from 'react-i18next';

class recordVisitsServices {
  async fetch(date: string) {
    const {t: trans} = useTranslation();
    // console.log('config.token,', config.token);
    // return;
    const url = `${recordVisitsEndPoint.fetch}?date=${date}`;
    const bodyParams: any = {
      method: 'GET',
      headers: {
        Authorization: config.token,
      },
      referrerPolicy: 'origin',
    };

    try {
      // Perform the fetch request
      const response = await fetch(url, bodyParams);

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the response as text
      const csvData = await response.text();

      // Define a path for the file
      const path =
        Platform.OS == 'ios'
          ? `${
              RNFS.DocumentDirectoryPath
            }/Record_Visits_${new Date().getMilliseconds()}.csv`
          : `${
              RNFS.DownloadDirectoryPath
            }/Record_Visits_${new Date().getMilliseconds()}.csv`;

      // Write the CSV data to a file
      await RNFS.writeFile(path, csvData, 'utf8');
      console.log('path', path);
      // Show an alert or any other notification that file is saved
      Alert.alert('File Saved', `CSV file has been saved to ${path}`);
    } catch (error) {
      // Handle errors, such as network issues or invalid responses
      console.error('Error', error);
      Alert.alert(trans('Error'), trans('Failed to download or save the CSV file'));
    }
  }

  // async fetch() {
  //   return rootApi('GET', pendingChargesEndPoint.fetch);

  // }
}
export default new recordVisitsServices();
