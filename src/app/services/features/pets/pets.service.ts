import {petEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class petsService {
  async create(payload: any) {
    console.log('petEndPoint.create', petEndPoint.create);
    return rootApi('POST', petEndPoint.create, payload);
  }
  async list(payload: any) {
    var {page = '', perPage = '', search = ''} = payload;
    const query = `page=${page}&perPage=${perPage}&search=${search}`;
    return rootApi('GET', petEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', petEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', petEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', petEndPoint.delete + id);
  }
}
export default new petsService();
