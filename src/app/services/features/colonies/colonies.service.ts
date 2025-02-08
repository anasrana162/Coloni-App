import {coloniesEndPoint, documentsEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class coloniesService {
  async create(payload: any) {
    return rootApi('POST', coloniesEndPoint.create, payload);
  }
  async residentUsers() {
    console.log("documentsEndPoint",documentsEndPoint.listResidents);
    return rootApi('GET', `${documentsEndPoint.listResidents}?asset=true&perPage=1000000000`);
  }
  async list() {
    return rootApi('GET', coloniesEndPoint.list);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', coloniesEndPoint.update + id, payload);
  }
  async delete(id: string) {
    return rootApi('DELETE', coloniesEndPoint.delete + id);
  }
}
export default new coloniesService();
