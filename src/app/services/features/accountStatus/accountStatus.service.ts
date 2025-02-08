import {formatDate} from '../../../utilities/helper';
import {accountStatusEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class accountStatusService {
  async create(payload: any) {
    return rootApi('POST', accountStatusEndPoint.create, payload);
  }
  async list(payload: any) {
    const {
      page = 1,
      perPage = 10,
      search = '',
      status = 'asset',
      period = '',
    } = payload || {};
    const query = `search=${
      search || ''
    }&page=${page}&perPage=${perPage}&status=${status}&period=${
      period || new Date()
    }`;
    return rootApi('GET', accountStatusEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', accountStatusEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', accountStatusEndPoint.details + id);
  }
  async eliminate(id: string) {
    return rootApi('PUT', accountStatusEndPoint.eliminate + id);
  }
  async updateExpense(id: string) {
    return rootApi('DELETE', accountStatusEndPoint.updateExpense + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', accountStatusEndPoint.delete + id);
  }
  async reciptDetails(id: string) {
    const query = `acountStatusId=${id}`;
    return rootApi('GET', accountStatusEndPoint.reciptList + '?' + query);
  }
  async dischargeFile(id: string) {
    const query = `accountStatusId=${id}`;
    const res = await rootApi(
      'GET',
      accountStatusEndPoint.dischargeFileList + '?' + query,
    );
    console.log('checking api res from service file....', res);
    return res;
  }
}
export default new accountStatusService();
