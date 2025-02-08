import {
  frequentVisitTypeEndPoint,
  frequentVisitEndPoint,
} from '../endpoint.api';
import { rootApi } from '../rootApi';

import { config } from '../../../../Config';
import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';

class frequentVisitServices {
  async create(payload: any) {
    return rootApi('POST', frequentVisitEndPoint.create, payload);
  }
  async list(payload: any) {
    const { page = 1, perPage = 10, search = '', resident = '' } = payload || {};
    const query = `search=${search || ''
      }&page=${page}&perPage=${perPage}&resident=${resident}`;
    console.log(
      "frequentVisitEndPoint.list + '?' + query + '/' + resident",
      frequentVisitEndPoint.list + '?' + query,
    );
    return rootApi('GET', frequentVisitEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', frequentVisitEndPoint.update + id, payload);
  }
  async delete(id: string) {
    return rootApi('DELETE', frequentVisitEndPoint.delete + id);
  }
  async details(id: string) {
    return rootApi('GET', frequentVisitEndPoint.details + id);
  }
  async createType(payload: any) {
    return rootApi('POST', frequentVisitTypeEndPoint.create, payload);
  }
  async typeList() {
    return rootApi('GET', frequentVisitTypeEndPoint.list);
  }

  async visitRecords(values: any, trans: any) {
    // download-reports/visit-records?
    // Define the URL with query parameters
    const url = `${frequentVisitTypeEndPoint.visitRecords}?isdeleted=${values.isdeleted}`;

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
          ? `${RNFS.DocumentDirectoryPath
          }/FrequentVisits_Report_${new Date().getMilliseconds()}.csv`
          : `${RNFS.DownloadDirectoryPath
          }/FrequentVisits_Report_${new Date().getMilliseconds()}.csv`;

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
export default new frequentVisitServices();
