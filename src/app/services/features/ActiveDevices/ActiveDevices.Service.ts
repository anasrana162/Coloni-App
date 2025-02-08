import {DevicesEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class ActiveDevicesServices {
  async list(payload: any, raw:boolean) {
    const {page = 1, perPage = 10, search = ''} = payload || {};
    const query = `search=${search || ''}&page=${page}&perPage=${perPage}`;
    const res = await rootApi(
      'GET',
      DevicesEndPoint.list + '?' + query,
      {},
      raw,
    );
    return res;
  }
  async listResident(id: string,payload?:any) {
    console.log('ID  ___', id);
    const {page = 1, perPage = 10, search = ''} = payload || {};
    const query = `?search=${search || ''}&page=${page}&perPage=${perPage}`;
    const res = await rootApi('GET', DevicesEndPoint.list + '/' + id+query);
    return res;
  }
  async delete(id: string) {
    console.log('ID Delete', id);
    return rootApi('DELETE', DevicesEndPoint.delete + id);
  }
}
export default new ActiveDevicesServices();
