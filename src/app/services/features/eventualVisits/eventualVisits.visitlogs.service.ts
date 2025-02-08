import { Platform, Alert, ToastAndroid } from 'react-native';
import { eventaulVisitsEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';
import RNFS from 'react-native-fs';
import { config } from '../../../../Config';
import { formatDate } from '../../../utilities/helper';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';

class eventualVisitsService {
  async create(payload: any) {
    return rootApi('POST', eventaulVisitsEndPoint.create, payload);
  }
  async list(payload: any) {
    const {
      search = '',
      page = 1,
      perPage = 10,
      status = '',
      type = '',
      dateType = '',
      period = new Date(),
      resident = '',
    } = payload || {};
    const formattedPeriod = period ? formatDate(period, 'YYYY-MM-DD') : '';
    console.log('period', period);
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${perPage || 10
      }&status=${status}&type=${type}&dateType=${dateType}&period=${formattedPeriod}&resident=${resident}`;
    console.log('Query:', query);
    return rootApi('GET', eventaulVisitsEndPoint.list + query, {}, true);
  }
  async update(payload: any, id: string) {
    console.log(
      'eventaulVisitsEndPoint.update + id, payload',
      eventaulVisitsEndPoint.update + id,
    );
    return rootApi('PUT', eventaulVisitsEndPoint.update + id, payload);
  }
  async receiveVisit(id: string) {
    return rootApi('PATCH', eventaulVisitsEndPoint.update + id);
  }
  async details(id: string) {
    return rootApi('GET', eventaulVisitsEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', eventaulVisitsEndPoint.delete + id);
  }
  async downloadFile(payload: any) {
    // Define the URL with query parameters
    const {
      search = '',
      page = 1,
      perPage = 10,
      status = '',
      type = '',
      dateType = '',
      period = '',
    } = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${perPage || 10
      }&status=${status}&type=${type}&dateType=${dateType}&period=${period}`;
    const url = `${eventaulVisitsEndPoint.list}/download${query}`;
    console.log('URL:  ', url);
    // Set up the request options
    const bodyParams: any = {
      method: 'GET',
      headers: {
        Authorization: config.token,
      },
      referrerPolicy: 'origin',
    };
    const { t: trans } = useTranslation();

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
          ? `${RNFS.DocumentDirectoryPath}/Visit_logs.csv`
          : `${RNFS.DownloadDirectoryPath}/Visit_logs.csv`;

      // Write the CSV data to a file
      await RNFS.writeFile(path, csvData, 'utf8');
      console.log('path', path);
      // Show an alert or any other notification that file is saved
      Alert.alert('File Saved', `CSV file has been saved to ${path}`);
      {
        Platform.OS === 'android'
          ? ToastAndroid.show(
            `File saved successfully ${path}!`,
            ToastAndroid.SHORT,
          )
          : showMessage({ message: `File saved successfully ${path}!` });
      }
    } catch (error) {
      // Handle errors, such as network issues or invalid responses
      console.error('Error', error);
      Alert.alert(
        trans('Error'),
        trans('Failed to download or save the CSV file'),
      );
    }
  }
}
export default new eventualVisitsService();
