import {  saftyConfigurtionEndpoint } from '../../endpoint.api';
import { rootApi } from '../../rootApi';

class saftyConfigationServices {


  async create(payload: any) {
    return rootApi('POST', saftyConfigurtionEndpoint.create, payload);
  }
  async details() {
    return rootApi('GET', saftyConfigurtionEndpoint.create);
  }

}
export default new saftyConfigationServices();
