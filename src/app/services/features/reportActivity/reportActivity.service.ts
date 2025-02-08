import { formatDate } from '../../../utilities/helper';
import {reportActivityEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class reportActivityService {
  async create(payload: any) {
    return rootApi('POST', reportActivityEndPoint.create, payload);
  }
  async list(payload: any) {
    const {page = 1, perPage = 10, search = '',period=new Date()} = payload || {};
    const formattedPeriod = period ? formatDate(period, 'YYYY-MM-DD') : '';
    const query = `search=${search || ''}&period=${formattedPeriod}&page=${page}&perPage=${perPage}`;
    return rootApi('GET', reportActivityEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', reportActivityEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', reportActivityEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', reportActivityEndPoint.delete + id);
  }
}
export default new reportActivityService();
