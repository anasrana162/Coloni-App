import {visitsTypeEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class visitsTypeService {
  
  async createEventual(payload: any) {
    return rootApi('POST', visitsTypeEndPoint.createEventual, payload);
  }
  
  async listEventual(payload?: any) {
    const {screen = ''} = payload || {};
    const query = `?screen=${screen || ''}`;
    return rootApi('GET', visitsTypeEndPoint.listEventual + query);
  }
  
  async deleteEventual(id: string) {
    return rootApi('DELETE', visitsTypeEndPoint.deleteEventual + id);
  }
  async create(payload: any) {
    return rootApi('POST', visitsTypeEndPoint.create, payload);
  }
  async list(payload: any) {
    const {screen = ''} = payload || {};
    const query = `?screen=${screen || ''}`;
    return rootApi('GET', visitsTypeEndPoint.list + query);
  }
  async delete(id: string) {
    return rootApi('DELETE', visitsTypeEndPoint.delete + id);
  }
}
export default new visitsTypeService();
