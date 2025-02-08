import { formatDate } from '../../../utilities/helper';
import {assistEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class assistService {
  async create(payload: any) {
    return rootApi('POST', assistEndPoint.create, payload);
  }
  async list(payload: any) {
    const {page = 1, perPage = 10, search = '',period=new Date()} = payload || {};
    const formattedPeriod = period ? formatDate(period, 'YYYY-MM-DD') : '';
    const query = `search=${search || ''}&period=${formattedPeriod}&page=${page}&perPage=${perPage}`;
    return rootApi('GET', assistEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', assistEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', assistEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', assistEndPoint.delete + id);
  }
}
export default new assistService();
