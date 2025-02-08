import { userEndPoint, authEndPoint } from '../otherEndPoint.api';
import { rootApi } from '../rootApi';

class userService {
  async profile() {
    return rootApi('GET', userEndPoint.profile);
  }
  async forgotPassword(payload: object) {
    return rootApi('POST_WITHOUT_AUTH', userEndPoint.forgotPassword, payload);
  }
  async register(payload: object) {
    return rootApi('POST', userEndPoint.register, payload);
  }
  async update(payload: object, id: string) {
    return rootApi('PUT', userEndPoint.register + '/' + id, payload);
  }
  async deleteUserAccount(payload: any) {
    return rootApi('POST', userEndPoint.deleteAccount, payload);
  }
  async logoutUserAccount(payload: any) {
    return rootApi('POST', authEndPoint.logout, payload);
  }
  async resetPassword(payload: any) {
    return rootApi('POST_WITHOUT_AUTH', userEndPoint.resetPassword, payload);
  }
  async storeFCMToken(payload: {
    deviceId: string | any;
    deviceToken: string | any;
    deviceType: string;
  }) {
    return rootApi('POST', userEndPoint.saveFCMToken, payload);
  }
  async patchResident(payload: any, id: any) {

    return rootApi('PATCH', userEndPoint.ResidentsPatch + '/' + id, payload);
  }

  async patchNotifications(payload: any, id: any) {
    return rootApi('PUT', userEndPoint.patchNotification + '/' + id, payload);
  }


  async DeleteResident(id: any) {
    return rootApi('DELETE', userEndPoint.ResidentsDelete + '/' + id);
  }

  async ResidentScreen(params?: any, raw?: any) {
    var {
      asset = true,
      search = '',
      role = '',
      page = '',
      perPage = '',
      isAdmin = false,
    } = params || {};
    const query = `asset=${asset}&search=${search}&role=${role}&page=${page}&perPage=${perPage}&isAdmin=${isAdmin}`;
    console.log(
      "userEndPoint.Residents + '?' + query",
      userEndPoint.Residents + '?' + query,
    );
    return rootApi('GET', userEndPoint.Residents + '?' + query, {}, raw);
  }

  async ResidentList(params?: any) {
    var { page = 1, search = '', perPage = 10, asset = false } = params || {};
    const query = `page=${page}&search=${search}&perPage=${perPage}&asset=${asset}`;
    return rootApi('GET', userEndPoint.ResidentsList + '?' + query);
  }

  async ResidentDetails(id?: string) {
    return rootApi('GET', userEndPoint.ResidentsDetails + '/' + id);
  }

  async Resident() {
    return rootApi('GET', userEndPoint.Residents);
  }

  async ResidentListDefaulters() {
    return rootApi('GET', userEndPoint.ResidentsDefaulters);
  }
  async ChangePin(payload: any) {
    return rootApi('POST', userEndPoint.ChangePin, payload);
  }
  async ResidentVig(params?: any) {
    var { page = 1, search = '', asset = true, perPage = 10 } = params || {};
    const query = `page=${page}&search=${search}&asset=${asset}&perPage=${perPage}`;
    return rootApi('GET', userEndPoint.Residents + '?' + query);
  }
}

export default new userService();
