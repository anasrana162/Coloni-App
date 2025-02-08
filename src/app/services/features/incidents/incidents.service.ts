import {incidentEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class incidentsService {
  async create(payload: any) {
    return rootApi('POST', incidentEndPoint.create, payload);
  }
  async list(payload: any) {
    const {
      page = 1,
      perPage = 10,
      status = '',
      period = '',
      resident = '',
    } = payload || {};
    const query = `status=${
      status || ''
    }&page=${page}&perPage=${perPage}&period=${period}&resident=${resident}`;
    console.log('query', incidentEndPoint.list + '?' + query);
    return rootApi('GET', incidentEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', incidentEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', incidentEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', incidentEndPoint.delete + id);
  }
}
export default new incidentsService();
