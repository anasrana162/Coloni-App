import {AccessTagCardEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class accessTagCardService {
  async create(payload: any) {
    return rootApi('POST', AccessTagCardEndPoint.create, payload);
  }
  async list(payload: any) {
    const {
      page = 1,
      perPage = 10,
      search = '',
      status = 'Activities',
      
    } = payload || {};
    const query = `search=${
      search || ''
    }&page=${page}&perPage=${perPage}&activate=${status}`;
    const res=await rootApi('GET', AccessTagCardEndPoint.list + '?' + query);
    return res;
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', AccessTagCardEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', AccessTagCardEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', AccessTagCardEndPoint.delete + id);
  }
}
export default new accessTagCardService();
