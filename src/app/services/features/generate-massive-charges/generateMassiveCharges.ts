import { generateMassiveChargesEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';

class GenerateMassiveChargesService {
  async list(params?: any) {
    const { page = '', perPage = '', month = '', year = '' } = params || {};
    const query = `page=${page}&perPage=${perPage}&month=${month}&year=${year}`;
    return rootApi(
      'GET',
      generateMassiveChargesEndPoint.list + '?' + query,
      params,
      true,
    );
  }
  async surchargeList(payload: any, id: string, raw?: boolean) {
    const { page = '', perPage = '', search = '', date = '' } = payload || {};
    const query = `search=${search || ''
      }&page=${page}&perPage=${perPage}&date=${date}`;
    return rootApi(
      'GET',
      generateMassiveChargesEndPoint.surchargeList + '/' + id + '?' + query,{},raw
    );
  }
  async affectedChargeList(payload: any, id: string) {
    const { page = '', perPage = '', search = '', date = '' } = payload || {};
    const query = `search=${search || ''
      }&page=${page}&perPage=${perPage}&date=${date}`;
    return rootApi(
      'GET',
      generateMassiveChargesEndPoint.affectedChargeList +
      '/' +
      id +
      '?' +
      query,
    );
  }
  async createSurcharge(payload: any) {
    return rootApi(
      'POST',
      generateMassiveChargesEndPoint.createSurcharge,
      payload,
    );
  }
  
  async createMassiveCharges(payload: any) {
    return rootApi('POST', generateMassiveChargesEndPoint.create, payload);
  }
  
  async update(payload: any, id: string) {
    return rootApi('PUT', generateMassiveChargesEndPoint.update + id, payload);
  }
  async delete(id: string) {
    return rootApi('DELETE', generateMassiveChargesEndPoint.delete + id);
  }
}
export default new GenerateMassiveChargesService();
