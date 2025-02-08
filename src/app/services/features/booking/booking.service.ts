import { bookingEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';

class bookingService {
  async create(payload: any) {
    return rootApi('POST', bookingEndPoint.create, payload);
  }
  async list(payload: any) {
    
    const {
      page = 1,
      perPage = 10,
      search = '',
      status = 'X-Approve',
      period = ""
    } = payload || {};
    const query = `search=${search || ''
      }&page=${page}&perPage=${perPage}&status=${status}&period=${period}`;
    return rootApi('GET', bookingEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', bookingEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', bookingEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', bookingEndPoint.delete + id);
  }
}
export default new bookingService();
