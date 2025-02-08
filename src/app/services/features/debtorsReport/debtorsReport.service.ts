import { formatDate } from '../../../utilities/helper';
import { debtorsReportEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';

class debtorsReportService {
  async create(payload: any) {
    return rootApi('POST', debtorsReportEndPoint.create, payload);
  }
  
  async list(payload?: any) {
    const { period = "", asset = true, page = 1, perPage = 10, status } = payload || {};
    const query = `page=${page}&perPage=${perPage}&asset=${asset}&period=${period}`;
    return rootApi('GET', debtorsReportEndPoint.list + '?' + query);
  }

  async update(payload: any, id: string) {
    return rootApi('PUT', debtorsReportEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', debtorsReportEndPoint.delete + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', debtorsReportEndPoint.delete + id);
  }
  async detailsByDate(date: any) {
    const formattedDate = formatDate(date, 'yyyy-MM-DD');
    return rootApi('GET', debtorsReportEndPoint.details + "?period=" + formattedDate);
  }
}
export default new debtorsReportService();
