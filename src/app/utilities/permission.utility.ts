import {Platform} from 'react-native';

const {PermissionsAndroid} = require('react-native');

/* permission */
const hasPermission = async () => {
  if (Platform.OS === 'android') {
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  } else {
    return true;
  }
};

const notificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const hasPermissionFlag = await hasPermission();
      if (hasPermissionFlag) {
        return true;
      }
      const permissionResponse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return permissionResponse === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  } catch (_) {
    return false;
  }
};
/* permission */

export {hasPermission, notificationPermission};
