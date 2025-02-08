import {Alert, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {config} from '../../../../Config';
import {formatDate} from '../../../utilities/helper';
import {outstandingBalanceEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

class outstandingBalanceService {
  async create(payload: any) {
    return rootApi('POST', outstandingBalanceEndPoint.create, payload);
  }
  async list(payload?: any, raw?: boolean) {
    const {page = 1, perPage = 10, search = ''} = payload || {};
    const query = `search=${search || ''}&page=${page}&perPage=${perPage}`;
    return rootApi(
      'GET',
      outstandingBalanceEndPoint.list + '?' + query,
      {},
      raw,
    );
  }
  async listCharges(payload: any) {
    const {
      page = 1,
      perPage = 10,
      status = 'Earning',
      id = '',
      period = '',
      search = '',
    } = payload || {};
    const query = `status=${
      status || ''
    }&page=${page}&perPage=${perPage}&period=${period}&search=${search}`;
    return rootApi(
      'GET',
      outstandingBalanceEndPoint.listCharges + id + '?' + query,
      {},
      true,
    );
  }
  async notifyRes(payload: any) {
    return rootApi('POST', outstandingBalanceEndPoint.notify, payload);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', outstandingBalanceEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', outstandingBalanceEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', outstandingBalanceEndPoint.delete + id);
  }
  async downloadFile() {
    // Define the URL with query parameters
    const {t: trans} = useTranslation();


    const url = `${outstandingBalanceEndPoint.downloadFile}`;
    // Set up the request options
    console.log('URL', url);
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
          ? `${RNFS.DocumentDirectoryPath}/Outstanding_Balances-${moment(
              new Date(),
            ).format('DD-MM-YYYY')}.csv`
          : `${RNFS.DownloadDirectoryPath}/Outstanding_Balances-${moment(
              new Date(),
            ).format('DD-MM-YYYY')}.csv`;

      // Write the CSV data to a file
      await RNFS.writeFile(path, csvData, 'utf8');
      console.log('path', path);

      return path;
    } catch (error) {
      // Handle errors, such as network issues or invalid responses
      console.error('Error', error);
      Alert.alert(trans('Error'), trans('Failed to download'));
      return 'error';
    }
  }
}
export default new outstandingBalanceService();
