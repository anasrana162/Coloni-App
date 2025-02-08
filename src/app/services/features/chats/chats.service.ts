import axios from 'axios';
import {chatsEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class chatsService {
  async send(payload: any) {
    return rootApi('POST', chatsEndPoint.send, payload);
  }

  async listContacts(payload: any) {
    const {
      colony = '',
      accesskey = '',
      page = '',
      perPage = '',
    } = payload || {};
    const query = `colony=${colony}&page=${page}&perPage=${perPage}`;
    var result = await axios
      .get(chatsEndPoint.listContacts + '?' + query, {
        headers: {
          accesskey,
        },
      })
      .then(res => {
        return res?.data;
      })
      .catch(err => {
        console.log('Error in listContact:', err);
        if (err.response) {
          // The request was made and the server responded with a status code
          console.log('Data:', err.response.data);
          console.log('Status:', err.response.status);
          console.log('Headers:', err.response.headers);
        } else if (err.request) {
          // The request was made but no response was received
          console.log('Request:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error Message:', err.message);
        }
        return 'error';
      });
    return result;

    // return rootApi('GET', chatsEndPoint.listContacts + '?' + query);
  }
  async messagesList(payload: any) {
    const {groupId = '', Accesskey = ''} = payload || {};
    const query = `groupId=${groupId}`;
    var result = await axios
      .get(chatsEndPoint.listMessages + '?' + query, {
        headers: {
          Accesskey,
        },
      })
      .then(res => {
        return res?.data;
      })
      .catch(err => {
        console.log('Error in listMessages:', err?.response.data);
        return 'error';
      });
    return result;

    // return rootApi('GET', chatsEndPoint.listContacts + '?' + query);
  }
  async details(id: string) {
    return rootApi('GET', chatsEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', chatsEndPoint.delete + id);
  }
}
export default new chatsService();
