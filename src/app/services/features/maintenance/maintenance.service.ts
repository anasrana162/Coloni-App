import {maintenanceEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class maintenanceService {
  async create(payload: any) {
    return rootApi('POST', maintenanceEndPoint.create, payload);
  }
  async list(payload: any) {
    const {search = '', page = 1, perPage = 10, period = ''} = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }&period=${period}`;
    return rootApi('GET', maintenanceEndPoint.list + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', maintenanceEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', maintenanceEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', maintenanceEndPoint.delete + id);
  }
}
export default new maintenanceService();
