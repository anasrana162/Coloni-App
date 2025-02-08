import { formatDate } from '../../../utilities/helper';
import { DismissVisitEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';

class dismissVisitServices {

  async list(payload?: any) {
    const { period = new Date(),page = 1, perPage = 10,  } = payload || {};
    const formattedPeriod = period ? formatDate(period, 'YYYY-MM-DD') : '';
    //const query = `page=${page}&perPage=${perPage}`;
    const query = `page=${page}&perPage=${perPage}&period=${formattedPeriod||new Date()}`;
    return rootApi('GET', DismissVisitEndPoint.list + '?' + query);
  }
  async createEntry(payload: any) {
    return rootApi('POST', DismissVisitEndPoint.createEntry, payload);
  }
  async createExit(payload: any) {
    return rootApi('POST', DismissVisitEndPoint.createExit, payload);
  }
}
export default new dismissVisitServices();
