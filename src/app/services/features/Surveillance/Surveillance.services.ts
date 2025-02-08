import {  SurveillanceEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class SurveillanceServices {
  async create(payload: any) {
    return rootApi('POST', SurveillanceEndPoint.create, payload);
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
    return rootApi('GET',  SurveillanceEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT',  SurveillanceEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET',  SurveillanceEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE',  SurveillanceEndPoint.delete + id);
  }
}
export default new SurveillanceServices();
