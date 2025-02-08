import {myPrivateEndPoints, myCardEndPoints} from '../endpoint.api';
import {rootApi} from '../rootApi';
class myCardService {
  async create(payload: any) {
    return rootApi('POST', myCardEndPoints.create, payload);
  }
  async list() {
    return rootApi('GET', myCardEndPoints.list);
  }
}

export default new myCardService();
