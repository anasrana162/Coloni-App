import { cameraSettingsEndPoint } from '../endpoint.api';
import { rootApi } from '../rootApi';

class CameraSettingsServices {
  async create(payload: any) {
    return rootApi('POST',  cameraSettingsEndPoint.create, payload);
  }
  async list() {
    return rootApi('GET', cameraSettingsEndPoint.list);
  }
}
export default new CameraSettingsServices();
