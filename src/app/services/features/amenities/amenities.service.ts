import {amenityEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class amenitiesService {
  async create(payload: any) {
    return rootApi('POST', amenityEndPoint.create, payload);
  }
  async list(payload: any) {
    const {page = 1, perPage = 10} = payload || {};
    const query = `page=${page}&perPage=${perPage}`;
    return rootApi('GET', amenityEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', amenityEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', amenityEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', amenityEndPoint.delete + id);
  }
}
export default new amenitiesService();
