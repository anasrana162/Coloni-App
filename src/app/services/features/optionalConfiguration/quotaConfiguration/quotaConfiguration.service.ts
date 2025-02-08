import {  quotaConfigurtionEndpoint } from '../../endpoint.api';
import { rootApi } from '../../rootApi';

class quotaConfigationServices {


  async create(payload: any) {
    return rootApi('POST', quotaConfigurtionEndpoint.create, payload);
  }
  async details() {
    return rootApi('GET', quotaConfigurtionEndpoint.create);
  }

}
export default new quotaConfigationServices();
