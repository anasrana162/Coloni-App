import {saftyReportEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class saftyReportService {
  async create(payload: any) {
    console.log('saftyReportEndPoint.create', saftyReportEndPoint.create);
    return rootApi('POST', saftyReportEndPoint.create, payload);
  }
  async list(payload: any) {
    const {page = 1, perPage = 10, search = ''} = payload || {};
    const query = `search=${search || ''}&page=${page}&perPage=${perPage}`;
    console.log(
      "saftyReportEndPoint.list + '?' + query: ",
      saftyReportEndPoint.list + '?' + query,
    );
    return rootApi('GET', saftyReportEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', saftyReportEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', saftyReportEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', saftyReportEndPoint.delete + id);
  }
}
export default new saftyReportService();
