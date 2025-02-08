import {formatDate} from '../../../utilities/helper';
import {expenseTypesEndPoint, expensesEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class expensesServices {
  async create(payload: any) {
    return rootApi('POST', expensesEndPoint.add, payload);
  }
  async list(payload?: any) {
    const {
      page = 1,
      perPage = 10,
      search = '',
      category = '',
      period = '',
      visible = '',
    } = payload || {};
    const query = `search=${
      search || ''
    }&page=${page}&perPage=${perPage}&category=${
      !category ? 'scheduled' : category
    }&period=${period}&visible=${visible}`;
    return rootApi('GET', expensesEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    console.log('Update Data expense:', payload);
    return rootApi('PUT', expensesEndPoint.update + id, payload);
  }
  async delete(id: string) {
    return rootApi('DELETE', expensesEndPoint.delete + id);
  }
  async details(id: string) {
    return rootApi('GET', expensesEndPoint.details + id);
  }
  async createType(payload: any) {
    return rootApi('POST', expenseTypesEndPoint.add, payload);
  }
  async detailsType(id: string) {
    return rootApi('POST', expenseTypesEndPoint.details + id);
  }
  async updateType(id: string) {
    return rootApi('PUT', expenseTypesEndPoint.update + id);
  }
  async deleteType(id: string) {
    return rootApi('DELETE', expenseTypesEndPoint.delete + id);
  }
  async typeList() {
    return rootApi('GET', expenseTypesEndPoint.list);
  }
  async getExpense(date?: any) {
    const formattedDate = formatDate(date, 'yyyy-MM-DD');
    return rootApi('GET', expenseTypesEndPoint.list + '?' + formattedDate);
  }
}
export default new expensesServices();
