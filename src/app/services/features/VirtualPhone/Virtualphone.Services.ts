import {VirtualphoneEndpoints} from '../endpoint.api';
import {rootApi} from '../rootApi';

class VirtualphoneService{
  async create(payload: any) {
    return rootApi('POST', VirtualphoneEndpoints.create, payload);
  }
  async list(payload: any) {
    const {page = 1, perPage = 10} = payload || {};
    const query = `page=${page}&perPage=${perPage}`;
    return rootApi('GET', VirtualphoneEndpoints.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', VirtualphoneEndpoints.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', VirtualphoneEndpoints.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', VirtualphoneEndpoints.delete + id);
  }
}
export default new VirtualphoneService();
