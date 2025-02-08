import { incomeClassificationEndpoint } from '../../endpoint.api';
import { rootApi } from '../../rootApi';

class incomeClassificationServices {


    async create(payload: any) {
        return rootApi('POST', incomeClassificationEndpoint.create, payload);
    }

    async details(payload: any) {
        return rootApi('GET', incomeClassificationEndpoint.details, payload);
    }



}
export default new incomeClassificationServices();
