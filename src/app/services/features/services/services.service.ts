import {servicesEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class servicesService {
  async create(payload: any) {
    return rootApi('POST', servicesEndPoint.create, payload);
  }
  async list(payload: any) {
    const {search = '', page = 1, perPage = 10} = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }`;
    return rootApi('GET', servicesEndPoint.list + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', servicesEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', servicesEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', servicesEndPoint.delete + id);
  }
}
export default new servicesService();
