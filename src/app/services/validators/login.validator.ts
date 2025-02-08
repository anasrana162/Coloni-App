import {isEmpty} from '../../utilities/helper';


class loginValidator {
  isValidForLogin({
    username,
    password,
    deviceType,
    fcmtoken,
  }: {
    username: string;
    password: string;
    deviceType: string;
    fcmtoken: string;
  }) {
    if (
      isEmpty(username) ||
      isEmpty(password) ||
      isEmpty(deviceType) ||
      isEmpty(fcmtoken)
    ) {
      return false;
    }
    return true;
  }
}

export default new loginValidator();
