import { config } from '../../../../Config';
import { rondinesReportEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';

class rondinesReportServices {
  async fetch(date: string, trans: any) {

    const url = `${rondinesReportEndPoint.fetch}?date=${date}`;
    // Set up the request options
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
          ? `${RNFS.DocumentDirectoryPath}/Rondines_Report.csv`
          : `${RNFS.DownloadDirectoryPath}/Rondines_Report.csv`;

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

}
export default new rondinesReportServices();
