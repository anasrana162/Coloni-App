import { emergencyNumbers } from '../endpoint.api';
import { rootApi } from '../rootApi';

class emergencyNumbersService {
  async create(payload: any) {
    return rootApi('POST', emergencyNumbers.create, payload);
  }
  
  async list(payload: any) {
    // const params = new URLSearchParams(payload);
    // return rootApi('GET', emergencyNumbers.list + '?' + params);
    const { search = '', page = 1, perPage = 10 } = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${perPage || 10
      }`;
    return rootApi('GET', emergencyNumbers.list + '?' + query); 
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', emergencyNumbers.update + id, payload);
  }
  async delete(id: string) {
    return rootApi('DELETE', emergencyNumbers.delete + id);
  }
  async details(id: string) {
    return rootApi('GET', emergencyNumbers.details + id);
  }
}
export default new emergencyNumbersService();
