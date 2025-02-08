import {visitsEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class visitsService {
  async create(payload: any) {
    return rootApi('POST', visitsEndPoint.create, payload);
  }
  async list(payload: any) {
    const {search = '', page = 1, perPage = 20, period = ''} = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }&period=${period}`;
    return rootApi('GET', visitsEndPoint.list + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', visitsEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', visitsEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', visitsEndPoint.delete + id);
  }
}
export default new visitsService();
