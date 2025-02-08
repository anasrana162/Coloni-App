import { rafflesEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';

class rafflesService {
  async create(payload: any) {
    return rootApi('POST', rafflesEndPoint.create, payload);
  }
  async list(payload: any) {
    const { search = '', page = 1, perPage = 10, period = '' } = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${perPage || 10
      }&period=${period}`;
    return rootApi('GET', rafflesEndPoint.list + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', rafflesEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', rafflesEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', rafflesEndPoint.delete + id);
  }
}
export default new rafflesService();
