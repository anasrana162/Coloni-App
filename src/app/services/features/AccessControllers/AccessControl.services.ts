import {AccessControllersEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class AccessControlServices {
  async create(payload: any) {
    return rootApi('POST', AccessControllersEndPoint.create, payload);
  }
  async list(payload: any) {
    const {
      page = 1,
      perPage = 10,
      search = '',
      date = '',
    } = payload || {};
    const query = `search=${
      search || ''
    }&page=${page}&perPage=${perPage}&date=${date}`;
    return rootApi('GET', AccessControllersEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', AccessControllersEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', AccessControllersEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', AccessControllersEndPoint.delete + id);
  }
}
export default new AccessControlServices();
