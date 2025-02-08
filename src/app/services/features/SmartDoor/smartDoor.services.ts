import {  SmartDoorEndpoints} from '../endpoint.api';
import {rootApi} from '../rootApi';

class SmartDoorService {
  async create(payload: any) {
    return rootApi('POST', SmartDoorEndpoints.create, payload);
  }
  async list(payload: any) {
    const {
      page = 1,
      perPage = 10,
      search = '',
    } = payload || {};
    const query = `search=${
      search || ''
    }&page=${page}&perPage=${perPage}`;
    return rootApi('GET',  SmartDoorEndpoints.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT',  SmartDoorEndpoints.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET',  SmartDoorEndpoints.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE',  SmartDoorEndpoints.delete + id);
  }
}
export default new SmartDoorService();
