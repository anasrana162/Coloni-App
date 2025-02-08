import { formatDate } from '../../../utilities/helper';
import {otherIncomeEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class otherIncomeService {
  async create(payload: any) {
    return rootApi('POST', otherIncomeEndPoint.create, payload);
  }
  async list(payload?: any) {
    const {page = 1, perPage = 10, search = ''} = payload || {};
    const query = `search=${search || ''}&page=${page}&perPage=${perPage}`;
    return rootApi('GET', otherIncomeEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', otherIncomeEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', otherIncomeEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', otherIncomeEndPoint.delete + id);
  }
  async approve(id: string) {
    return rootApi('PUT', otherIncomeEndPoint.approve + id);
  }
  async submitCharges(id: string) {
    return rootApi('PATCH', otherIncomeEndPoint.submitCharges + id);
  }
  async getIncome(date?: any) {
    const { page = 1, perPage = 10, search = '' } = date || {};
    const formattedDate = formatDate(date, 'yyyy-MM-DD'); 
    const query = `payDay=${formattedDate}&catagory=${search || 'Share'}&page=${page}&perPage=${perPage}`;
    return rootApi('GET', otherIncomeEndPoint.list + '?' + query);
  }
  
  // async detailsByDate(date: any) {
  //   const formattedDate = formatDate(date, 'yyyy-MM-DD'); 
  //   return rootApi('GET', debtorsReportEndPoint.details + "?period=" + formattedDate);
  // }
}
export default new otherIncomeService();
