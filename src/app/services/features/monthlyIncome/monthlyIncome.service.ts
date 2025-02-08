import { config } from '../../../../Config';
import { monthlyIncomeEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';
import { Alert, Platform } from 'react-native';

import RNFS from 'react-native-fs';
class monthlyIncomeServices {


    // Function to fetch and save CSV file
    async fetch(date: string, trans: any) {

        const url = `${monthlyIncomeEndPoint.fetch}?payDay=${date}`;
        // Set up the request options
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
            const path = Platform.OS == "ios" ? `${RNFS.DocumentDirectoryPath}/Monthly_Income.csv` : `${RNFS.DownloadDirectoryPath}/Monthly_Income.csv`;

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
export default new monthlyIncomeServices();
