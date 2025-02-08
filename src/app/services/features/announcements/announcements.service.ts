import {announcementsEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class announcementsService {
  async create(payload: any) {
    return rootApi('POST', announcementsEndPoint.create, payload);
  }
  async createNotify(payload: any) {
    return rootApi('POST', announcementsEndPoint.createNotify, payload);
  }
  async list(payload: any) {
    const {search = '', page = 1, perPage = 10, year=''} = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }&period=${year}`;
    return rootApi('GET', announcementsEndPoint.list + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', announcementsEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', announcementsEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', announcementsEndPoint.delete + id);
  }
}
export default new announcementsService();
