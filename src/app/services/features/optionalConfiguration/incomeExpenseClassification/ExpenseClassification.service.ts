import { ExpenseClassificationEndpoint } from '../../endpoint.api';
import { rootApi } from '../../rootApi';

class ExpenseClassificationServices {


    async create(payload: any) {
        return rootApi('POST', ExpenseClassificationEndpoint.create, payload);
    }

    async details(payload: any) {
        return rootApi('GET', ExpenseClassificationEndpoint.details, payload);
    }



}
export default new ExpenseClassificationServices();
