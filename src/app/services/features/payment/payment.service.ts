import {paymentEndPoint, paymentTypes} from '../endpoint.api';
import {rootApi} from '../rootApi';

class paymentService {
  async list(payload: any) {
    const {status = 'Pending', page = 1, perPage = 10} = payload || {};
    const query = `?status=${
      status || 'Pending'
    }&page=${page}&perPage=${perPage}`;
    return rootApi('GET', paymentEndPoint.list + query);
  }
  async approvePayment(id: string) {
    return rootApi('POST', paymentEndPoint.approve + id);
  }
  async details(id: string) {
    return rootApi('GET', paymentEndPoint.details + id);
  }
  async disapprovePayment(id: string) {
    return rootApi('POST', paymentEndPoint.disapprove + id);
  }
  async generatePayment(payload: any) {
    return rootApi('POST', paymentEndPoint.generatePayment, payload);
  }
  async calculateBalance() {
    return rootApi('GET', paymentEndPoint.calculateBalance);
  }
  async update(id: string) {
    return rootApi('PUT', paymentEndPoint.update + id);
  }
  async massiveCharges(payload: any) {
    return rootApi('POST', paymentEndPoint.massiveCharges + payload);
  }
  async createType(payload: any) {
    return rootApi('POST', paymentTypes.create, payload);
  }
  async typesList() {
    return rootApi('GET', paymentTypes.list);
  }
  async deleteType(id: string) {
    return rootApi('DELETE', paymentTypes.delete + id);
  }
}
export default new paymentService();
