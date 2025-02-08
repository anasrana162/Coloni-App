import {config} from '../../../../Config';
import {authEndPoint} from '../otherEndPoint.api';
import {rootApi} from '../rootApi';
import axios from 'axios';
class authService {
  async login(payload: {username: string; password: string}) {
    console.log('payload final', payload);
    return rootApi('POST_WITHOUT_AUTH', authEndPoint.login, payload);
    // return rootApi(
    //   'POST_WITHOUT_AUTH',
    //   'http://192.168.18.200:3000/auth/login/',
    //   payload,
    // );
  }
  async logout() {
    return rootApi('GET', authEndPoint.logout);
  }
  
  async generatePinandUser() {
    console.log(' authEndPoint.generatePinandUser', config.token);
    try {
      return await axios
        .get(authEndPoint.generatePinandUser, {
          headers: {
            Authorization: `${config.token}`,
          },
        })
        .then(resp => {
          if (resp?.data?.success) {
            return resp?.data;
          } else {
            return 'error';
          }
        });
    } catch (error: any) {
      console.log('fetching pin and username error:', error?.response.data);
      return 'error';
    }

    // return rootApi('GET', authEndPoint.generatePinandUser);
  }

  
  async changePin(payload: any) {
    return rootApi('POST', authEndPoint.changePinUser, payload);
  }
}
export default new authService();
