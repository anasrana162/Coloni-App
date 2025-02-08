import {NotificationEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class NotificationDeleteService {
  async delete(residentId: string, notificationId: string, deviceId: string) {
    const query = `?residentId=${residentId}&notificationId=${notificationId}&deviceId=${deviceId}`;
    return rootApi('DELETE', NotificationEndPoint.delete + query);
  }
}

export default new NotificationDeleteService();
