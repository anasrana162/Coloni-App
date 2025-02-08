import { SocialChannelEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class SocialChannelService{
  async create(payload: any) {
    return rootApi('POST', SocialChannelEndPoint.create, payload);
  }
  async list(payload: any) {
    const {
      page = 1,
      perPage = 10,
      search = '',
    } = payload || {};
    const query = `search=${
      search || ''
    }&page=${page}&perPage=${perPage}`;
    return rootApi('GET',  SocialChannelEndPoint.list + '?' + query);
  }
  async update(payload: any, id: string) {
    return rootApi('PUT',  SocialChannelEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET',  SocialChannelEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE',  SocialChannelEndPoint.delete + id);
  }
}
export default new SocialChannelService();
