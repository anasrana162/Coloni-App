import {blacklistEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class blacklistService {
  async create(payload: any) {
    return rootApi('POST', blacklistEndPoint.create, payload);
  }
  async list(payload: any) {
    const {search = '', page = 1, perPage = 10} = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }`;
    return rootApi('GET', blacklistEndPoint.list + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', blacklistEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', blacklistEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', blacklistEndPoint.delete + id);
  }
}
export default new blacklistService();
