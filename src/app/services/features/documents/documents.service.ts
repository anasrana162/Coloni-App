import {documentsEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class documentsService {
  async create(payload: any) {
    return rootApi('POST', documentsEndPoint.create, payload);
  }
  async list(payload: any) {
    const {search = '', page = 1, perPage = 10, period = ''} = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }&period=${period}`;
    return rootApi('GET', documentsEndPoint.list + query);
  }

  async listResidentDoc(payload: any) {
    const {
      search = '',
      page = 1,
      perPage = 10,
      id = '',
      period = '',
      month = '',
      year = '',
      type = '',
      formatJson = false,
    } = payload || {};
    const query = `?search=${search || ''}&page=${page || 1}&perPage=${
      perPage || 10
    }&period=${period}&month=${month}&year=${year}&type=${type}`;
    console.log(
      "documentsEndPoint.listResident + '/' + id + query: ",
      documentsEndPoint.listResident + id + query,
    );
    return rootApi(
      'GET',
      documentsEndPoint.listResident + id + query,
      {},
      formatJson,
    );
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', documentsEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', documentsEndPoint.details + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', documentsEndPoint.delete + id);
  }

  async residentDocumentTypes() {
    return rootApi('GET', documentsEndPoint.listResDocTypes);
  }

  async residentDocTypesCreate(payload: any) {
    return rootApi('POST', documentsEndPoint.resDocTypesCreate, payload);
  }

  async residentDocTypesDelete(id: string) {
    return rootApi('DELETE', documentsEndPoint.resDocTypesDelete + id);
  }

  async documentTypes() {
    return rootApi('GET', documentsEndPoint.listDocTypes);
  }

  async documentTypesCreate(payload: any) {
    return rootApi('POST', documentsEndPoint.docTypesCreate, payload);
  }

  async docTypesDelete(id: string) {
    return rootApi('DELETE', documentsEndPoint.docTypesDelete + id);
  }
}
export default new documentsService();
