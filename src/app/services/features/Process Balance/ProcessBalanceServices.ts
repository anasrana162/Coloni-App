import { formatDate } from '../../../utilities/helper';
import {ProcessBalaceInFavour} from '../endpoint.api';
import {rootApi} from '../rootApi';

class ProcessBalanceService {

  async list(payload?: any) {
    const { period = '', positionType = '', search = '',favorType='' } = payload || {};
    

    const formattedPeriod = period ? formatDate(period, 'MM-YYYY') : '';

    const query = `search=${search || ''}&period=${formattedPeriod}&positionType=${positionType}&favorType=${favorType}`;
    const response = await rootApi('GET', ProcessBalaceInFavour.list + '?' + query);
    console.log("checking process balance api response", response);
    return response;
  }

}

export default new ProcessBalanceService();
