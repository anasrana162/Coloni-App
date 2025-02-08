import {coloniesSuperAdminEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class coloniesSuperAdminService {
    async create(payload: any) {
      return rootApi('POST', coloniesSuperAdminEndPoint.create, payload);
    }
    
    async list(payload: any) {
      const {page = 1, perPage = 10, search = ''} = payload || {};
      const query = `search=${search || ''}&page=${page}&perPage=${perPage}`;
      return rootApi('GET',coloniesSuperAdminEndPoint.list + '?' + query);
    }
    
    async update(payload: any, id: string) {
      return rootApi('PUT', coloniesSuperAdminEndPoint.update + id, payload);
    }
    
    async delete(id: string) {
      return rootApi('DELETE', coloniesSuperAdminEndPoint.delete + id);
    }
    
    async details(id: string) {
      return rootApi('GET', coloniesSuperAdminEndPoint.details + id);
    }
    async AdminList() {
      return rootApi('GET', coloniesSuperAdminEndPoint.AdminList);
    }
    async getAcessColony(id: any) {
      
      const res=await rootApi('GET', coloniesSuperAdminEndPoint.getAccessColony + id);
      console.log("checking the response from root api service",res);
      return res;
    }
  }
  
export default new coloniesSuperAdminService();
