import {streetEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class streetService {
  async create(payload: any) {
    return rootApi('POST', streetEndPoint.create, payload);
  }
  async list() {
    return rootApi('GET', streetEndPoint.list);
  }
  async delete(id: string) {
    return rootApi('DELETE', streetEndPoint.delete + '/' + id);
  }
}
export default new streetService();
