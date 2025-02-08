import {maintenanceEndPoint, incomeEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';


class incomeService {
  async list(payload: any) {
    const {search = '', page = 1, perPage = 10} = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }`;
    return rootApi('GET', incomeEndPoint.list + query);
  }
  
  async update(payload: any, id: string) {
    return rootApi('PUT', incomeEndPoint.update + id, payload);
  }
  
  async updateCharges(payload: any) {
    return rootApi('POST', incomeEndPoint.updateCharges, payload);
  }
  
  async delete(id: string) {
    return rootApi('DELETE', incomeEndPoint.delete + id);
  }
  
  async changeLog(id: string) {
    return rootApi('GET', incomeEndPoint.changeLog + id);
  }
  
  async balanceInFavor(payload: any) {
    return rootApi('POST', incomeEndPoint.balanceInFavor, payload);
  }
  
  async partial(payload: any) {
    return rootApi('POST', incomeEndPoint.balanceInFavor, payload);
  }
}
export default new incomeService();
