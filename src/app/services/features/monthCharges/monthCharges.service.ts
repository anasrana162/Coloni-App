import { formatDate } from '../../../utilities/helper';
import { monthChargesEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';

class monthChargesService {
  async create(payload: any) {
    return rootApi('POST', monthChargesEndPoint.create, payload);
  }
  async list(payload: any) {
    const {
      page = '',
      perPage = '',
      search = '',
      status = '',
      month = '',
      year = '',
      resident = ''
    } = payload || {};
    const query = `search=${search || ''
      }&page=${page}&perPage=${perPage}&status=${status}&month=${month}&year=${year}&resident=${resident}`;
    console.log('Api link:', monthChargesEndPoint.list + '?' + query);
    return rootApi('GET', monthChargesEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', monthChargesEndPoint.update + id, payload);
  }
  async updateCharges(payload: any) {
    return rootApi('POST', monthChargesEndPoint.updateCharges, payload);
  }
  
  async changeLog(id: string) {
    return rootApi('GET', monthChargesEndPoint.changeLog + id);
  }
  
  async partial(payload: any) {
    return rootApi('POST', monthChargesEndPoint.balanceInFavor, payload);
  }
  
  async balanceInFavor(payload: any) {
    return rootApi('POST', monthChargesEndPoint.balanceInFavor, payload);
  }
  async details(id: string) {
    return rootApi('GET', monthChargesEndPoint.details + id);
  }
  async approve(id: string) {
    return rootApi('PUT', monthChargesEndPoint.approve + id);
  }
  async decline(id: string) {
    return rootApi('DELETE', monthChargesEndPoint.decline + id);
  }
  async notify(id: string) {
    return rootApi('PUT', monthChargesEndPoint.notify + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', monthChargesEndPoint.delete + id);
  }
  async getMonthCharge(date?: any) {
    const { search = 'Approved' } = date || {};
    const formattedDate = formatDate(date, 'yyyy-MM-DD');
    const [year, month] = formattedDate.split('-');

    const query = `status=${search}&year=${year}&month=${month}`;
    return rootApi('GET', monthChargesEndPoint.list + '?' + query);
  }

  //  
  //  async delete(id: string) {
  //   return rootApi('DELETE', incomeEndPoint.delete + id);
  // }
  // 
  // async changeLog(id: string) {
  //   return rootApi('GET', incomeEndPoint.changeLog + id);
  // }
  // 
  // async balanceInFavor(payload: any) {
  //   return rootApi('POST', incomeEndPoint.balanceInFavor, payload);
  // }
  // 
  // async partial(payload: any) {
  //   return rootApi('POST', incomeEndPoint.balanceInFavor, payload);
  // }
}
export default new monthChargesService();
