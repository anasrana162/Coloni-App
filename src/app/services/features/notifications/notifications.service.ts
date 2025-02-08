import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import {config} from '../../../../Config';

import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification: any) {
    console.log('NOTIFICATION:', notification);
    // Process the notification as required
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

// Request user permission for notifications
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

// Get FCM token
export async function getFCMToken() {
  const token = await messaging().getToken();
  config.fcmtoken = token;
}

// Handle background messages

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  PushNotification.localNotification({
    channelId: remoteMessage?.notification?.android?.channelId || 'default', // Required for Android 8.0 and above
    title: remoteMessage?.notification?.title,
    message: remoteMessage?.notification?.body,
    playSound: true,
    sound: 'default',
  });
});

// Handling foreground messages

export function listenForForegroundMessages() {
  return messaging().onMessage(async remoteMessage => {
    PushNotification.localNotification({
      channelId: remoteMessage?.notification?.android?.channelId || 'default', // Required for Android 8.0 and above
      title: remoteMessage?.notification?.title,
      message: remoteMessage?.notification?.body,
      playSound: true,
      sound: 'default',
    });
  });
}
