import {expenseTypeEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class expenseTypesService {
  async create(payload: any) {
    console.log('payload in expensseTemplateService :', payload);
    return rootApi('POST', expenseTypeEndPoint.add, payload);
  }
  async list(payload?: any) {
    const {page = 1, perPage = 10, search = ''} = payload || {};
    const query = `search=${search || ''}&page=${page}&perPage=${perPage}`;
    return rootApi('GET', expenseTypeEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', expenseTypeEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', expenseTypeEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', expenseTypeEndPoint.delete + id);
  }
}
export default new expenseTypesService();
