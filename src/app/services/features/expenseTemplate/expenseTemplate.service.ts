import {expenseTypesEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class expenseTemplateService {
  async create(payload: any) {
    console.log("payload in expensseTemplateService :",payload)
    return rootApi('POST', expenseTypesEndPoint.add, payload);
  }
  async list(payload?: any) {
    const {page = 1, perPage = 10, search = ''} = payload || {};
    const query = `search=${search || ''}&page=${page}&perPage=${perPage}`;
    return rootApi('GET', expenseTypesEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', expenseTypesEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', expenseTypesEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', expenseTypesEndPoint.delete + id);
  }
}
export default new expenseTemplateService();
