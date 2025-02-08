import notifee, {
  AndroidImportance as CustomAndroidImportance,
  EventType as CustomEventType,
  TimestampTrigger as CustomTimestampTrigger,
  TriggerType as CustomTriggerType,
} from '@notifee/react-native';

export {
  notifee as customNotifee,
  CustomTriggerType,
  CustomEventType,
  CustomAndroidImportance,
};

export type {CustomTimestampTrigger};
