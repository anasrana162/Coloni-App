import {SirenEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class SirenService {
  async list(payload: any) {
    const { page = 1, perPage = 10} = payload || {};
    const query = `page=${page || 1}&perPage=${
      perPage || 10
    }`;
    return rootApi('GET', SirenEndPoint.list+ '?' + query);
  }

}
export default new SirenService();
