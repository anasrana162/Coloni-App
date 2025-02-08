import {vehiclesEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class vehiclesServices {
  async create(payload: any) {
    return rootApi('POST', vehiclesEndPoint.create, payload);
  }
  async list(payload: any) {
    const {search = '', page = 1, perPage = ''} = payload || {};
    const query = `search=${search}&page=${page}&perPage=${perPage}`;
    return rootApi('GET', vehiclesEndPoint.list + '?' + query);
    // return rootApi('GET', vehiclesEndPoint.list );
  }
  
  async update(payload: any, id: string) {
    return rootApi('PUT', vehiclesEndPoint.update + id, payload);
  }
  async delete(id: string) {
    return rootApi('DELETE', vehiclesEndPoint.delete + id);
  }
  async details(id: string) {
    return rootApi('GET', vehiclesEndPoint.details + id);
  }
}
export default new vehiclesServices();
