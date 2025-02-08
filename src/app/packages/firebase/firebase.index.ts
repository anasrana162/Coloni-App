import {customMessaging} from './firebase.package';

const requestFBPermission = async () => {
  try {
    if (await customMessaging().hasPermission()) {
      return true;
    } else {
      const authStatus = await customMessaging().requestPermission();
      return (
        authStatus === customMessaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === customMessaging.AuthorizationStatus.PROVISIONAL
      );
    }
  } catch (e) {
    return false;
  }
};
const registerDeviceForRemoteMessages = async () => {
  await customMessaging().registerDeviceForRemoteMessages();
};
const getMessagingToken = async () => {
  try {
    const token = await customMessaging().getToken();
    return token;
  } catch (_) {
    return '';
  }
};

const addMessagingEventListener = (callback: any) => {
  customMessaging().onMessage(async remoteMessage =>
    callback(remoteMessage, 'foreground'),
  );
  customMessaging().setBackgroundMessageHandler(async remoteMessage =>
    callback(remoteMessage, 'background'),
  );
  customMessaging()
    .getInitialNotification()
    .then(async remoteMessage => callback(remoteMessage, 'killed'));
  customMessaging().onNotificationOpenedApp(remoteMessage =>
    callback(remoteMessage, 'openApp'),
  );
};
const unregisterFirebase = async () => {
  try {
    await customMessaging().deleteToken();
  } catch (_) {
    return '';
  }
};
export {
  requestFBPermission,
  registerDeviceForRemoteMessages,
  getMessagingToken,
  addMessagingEventListener,
  unregisterFirebase,
};
