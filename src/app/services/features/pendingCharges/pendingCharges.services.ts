import { config } from '../../../../Config';
import { pendingChargesEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';

class vehiclesServices {


  async fetch(values: any, trans: any) {



    if (!values?.date) return Alert.alert("Date Missing!", "Please select date")
    if (!values?.reportType) return Alert.alert("Report Type Missing!", "Please select Report Type")
    const url = `${pendingChargesEndPoint.fetch}?reportType=${values?.reportType}&cutDate=${values?.date}`;
    const bodyParams: any = {
      method: 'GET',
      headers: {
        "Authorization": config.token
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
      const path = Platform.OS == "ios" ? `${RNFS.DocumentDirectoryPath}/Pending_Charges.csv` : `${RNFS.DownloadDirectoryPath}/Pending_Charges.csv`;

      // Write the CSV data to a file
      await RNFS.writeFile(path, csvData, 'utf8');
      console.log("path", path)
      // Show an alert or any other notification that file is saved
      Alert.alert('File Saved', `CSV file has been saved to ${path}`);

    } catch (error) {
      // Handle errors, such as network issues or invalid responses
      console.error("Error", error);
      Alert.alert(trans('Error'), trans('Failed to download or save the CSV file'));
    }
  }



  // async fetch() {
  //   return rootApi('GET', pendingChargesEndPoint.fetch);

  // }
}
export default new vehiclesServices();
