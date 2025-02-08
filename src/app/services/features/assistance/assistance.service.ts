import {TourEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class assistanceService {
  async create(payload: any) {
    return rootApi('POST', TourEndPoint.create, payload);
  }
  async list(payload: any) {
    const {status = '', page = 1, perPage = 100} = payload || {};
    const query = `?status=${status || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }`;
    return rootApi('GET', TourEndPoint.list + query);  
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', TourEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', TourEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', TourEndPoint.delete + id);
  }
}
export default new assistanceService();
