import { QrReaderEndpoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class QrReaderService {
  async create(payload: any) {
    return rootApi('POST', QrReaderEndpoint.create, payload);
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
    return rootApi('GET',  QrReaderEndpoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT',  QrReaderEndpoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET',  QrReaderEndpoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE',  QrReaderEndpoint.delete + id);
  }
}
export default new QrReaderService();
