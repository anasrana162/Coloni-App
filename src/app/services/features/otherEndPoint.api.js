import { config } from '../../../Config';
import { userRoles } from '../../assets/ts/core.data';
const baseUrl = config.baseUrl;
const adminUrl = config.baseUrl + '/admin';
const moduleName = {
  auth: '/auth',
  users: '/users',
  admin: '/admin',
  profile: '/profile',
};

const authEndPoint = {
  login: baseUrl + moduleName.auth + '/login',
  logout: baseUrl + moduleName.auth + '/logout',
  generatePinandUser: baseUrl + moduleName.auth + '/generatePinandUser',
  changePinUser: baseUrl + moduleName.auth + '/Userchange-pin',
};
const userEndPoint = {
  profile: baseUrl + moduleName.profile,
  register: adminUrl + moduleName.users + '/register',
  deleteAccount: adminUrl + moduleName.users + '/delete-account',
  forgotPassword: baseUrl + '/auth' + '/send-otp',
  resetPassword: baseUrl + '/auth' + '/reset-password/',
  saveFCMToken: baseUrl + moduleName.auth + '/save-fcm-token',
  Residents: baseUrl + moduleName.users + '/residents',
  ResidentsList:
    (config.role === userRoles.ADMIN ||
      config.role === userRoles.VIGILANT ||
      config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.users +
    '/residents',
  ResidentsDetails: adminUrl + moduleName.users + '/residents',
  ResidentsDelete: adminUrl + moduleName.users,
  ResidentsPatch: baseUrl + moduleName.users + '/residents',
  ResidentsDefaulters: baseUrl + moduleName.users + '/residents/defaulters',
  ChangePin: baseUrl + moduleName.auth + '/change-pin',
  patchNotification: baseUrl + moduleName.admin + "/devices/status"
};

export { userEndPoint, authEndPoint };
