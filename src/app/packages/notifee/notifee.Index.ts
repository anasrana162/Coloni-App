import {config} from '../../../Config';
import {momentTimezone} from '../momentTimezone.package';
import {
  CustomAndroidImportance,
  CustomEventType,
  CustomTimestampTrigger,
  CustomTriggerType,
  customNotifee,
} from './notifee.Package';

const createChannel = async (ref: any) => {
  const channelId = await customNotifee.createChannel({
    id: 'firebaseNotification' + config.title,
    name: 'Channel for firebase notification',
    importance: CustomAndroidImportance.HIGH,
    sound: 'default',
  });
  ref.current = channelId;
};
const displayNotification = async (params: {
  channelId?: string;
  title?: string;
  body?: string;
  subtitle?: string;
  data?: {[key: string]: string | number | object};
}) => {
  const {channelId, title, body, subtitle, data = {}} = params;
  await customNotifee.displayNotification({
    title: title,
    body: body,
    subtitle: subtitle,
    data: data,
    android: {
      channelId,
      importance: CustomAndroidImportance.HIGH,
    },
  });
};

const onCreateTriggerNotification = async ({
  title = '',
  time = '2023-11-29T07:14:27.312Z',
  channelId = '',
  before = '15',
}: {
  title?: string;
  time?: string;
  channelId?: string;
  before?: string;
}) => {
  const givenDate = momentTimezone(time);
  const currentDate = momentTimezone();
  const notificationTime = givenDate.subtract(before, 'minutes');
  const trigger: CustomTimestampTrigger = {
    type: CustomTriggerType.TIMESTAMP,
    timestamp: notificationTime.unix(),
  };
  await customNotifee.createTriggerNotification(
    {
      title: title,
      body: `${
        givenDate.isSame(currentDate, 'day') ? 'Today' : 'Tomorrow'
      } at ${givenDate.format('hh:mm A')}`,
      android: {
        channelId: channelId,
        importance: CustomAndroidImportance.HIGH,
      },
    },
    trigger,
  );
};
const notifeeEventListener = (callback: Function) => {
  customNotifee.onForegroundEvent(({type, detail}) => {
    if (type === CustomEventType.PRESS) {
      callback(detail);
    }
  });
  customNotifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === CustomEventType.PRESS) {
      await callback(detail);
    }
  });
};

const notifeeEventListenerObject = {
  onForegroundEvent: () => {},
  onBackgroundEvent: () => {},
  getInitialNotification: () => {},
};

export {
  createChannel,
  onCreateTriggerNotification,
  displayNotification,
  notifeeEventListener,
  notifeeEventListenerObject,
};
