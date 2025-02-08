import { config } from '../../../../../Config';
import { acceptCardsEndPoint } from '../../endpoint.api';
import { rootApi } from '../../rootApi';
import { Alert } from 'react-native';

class acceptCardsServices {


    async create(payload: any) {
        return rootApi('POST', acceptCardsEndPoint.create, payload);
    }

    async details(payload: any) {
        return rootApi('GET', acceptCardsEndPoint.details);
    }
    
    //   return rootApi('GET', pendingChargesEndPoint.fetch);

    // }
}
export default new acceptCardsServices();
