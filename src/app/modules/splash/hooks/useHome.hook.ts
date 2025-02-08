import {useCustomNavigation} from '../../../packages/navigation.package';
import {Keyboard} from 'react-native';
import {
  createChannel,
  displayNotification,
  notifeeEventListener,
} from '../../../packages/notifee/notifee.Index';
import {useLayoutEffect, useRef} from 'react';
import {customUseDispatch} from '../../../packages/redux.package';
import {
  addMessagingEventListener,
  registerDeviceForRemoteMessages,
  requestFBPermission,
} from '../../../packages/firebase/firebase.index';
import {contactTitle} from '../../../utilities/helper';
import {notificationPermission} from '../../../utilities/permission.utility';
import {saveGCMToken} from '../../../state/features/user/user.slice';

export const selectedDrawer = {
  value: '',
};

const useHome = () => {
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const androidNotificationChannelRef = useRef<any>(null);
  const initialSetup = async () => {
    createChannel(androidNotificationChannelRef);
    const fBPermission = await requestFBPermission();
    if (fBPermission) {
      await registerDeviceForRemoteMessages();
      dispatch(saveGCMToken());
      addMessagingEventListener((msg: any, _type: any = 'foreground') => {
        if (msg && msg.notification) {
          const {
            notification: {body, title},
            data: {type, message},
          } = msg;
          console.log({body, title, type, message});
          if (_type === 'foreground') {
            displayNotification({
              channelId: androidNotificationChannelRef.current,
              title: title,
              // body: body,
              // data: msg.data,
            });
          } else if (_type === 'openApp') {
            // navigation.navigate(screens.eachConversation, {
            //   from: 'notification',
            //   contact: contact,
            //   type: parseInt(`${type}`),
            //   id: contact.id,
            //   name: title,
            // });
          } else if (_type === 'killed') {
            // if (!isEmpty(contact)) {
            //   navigation.navigate(screens.eachConversation, {
            //     from: 'notification',
            //     contact: contact,
            //     type: parseInt(`${type}`),
            //     id: contact.id,
            //     name: title,
            //   });
            //   dispatch(
            //     readUnreadMessage({
            //       status: true,
            //       contactId: contact.id,
            //       index: 0,
            //       state: 'killed',
            //     }),
            //   );
            // }
          }
          // const item = {...contact, type: type, message: message};
          if (_type !== 'killed') {
            // dispatch(
            //   readUnreadMessage({
            //     status: true,
            //     contactId: item.id,
            //     index: 0,
            //   }),
            // );
          }
        } else {
          // dispatch(
          //   storeNewMessage(inboxThreadModel.notificationMessage({item})),
          // );
          // dispatch(updateUnreadCount(1));
          // }
        }
      });
    }
    const isGivingPermission = await notificationPermission();
    if (isGivingPermission) {
      notifeeEventListener((detail: any) => {
        const {
          notification: {
            data: {contactInfo, type},
            title,
          },
        } = detail;
        const contact = JSON.parse(`${contactInfo}`);
        if (contact) {
          //   navigation.navigate(screens.eachConversation, {
          //     from: 'notification',
          //     contact: contact,
          //     type: parseInt(`${type}`),
          //     id: contact.id,
          //     name: title,
          //   });
          //   dispatch(
          //     readUnreadMessage({
          //       status: true,
          //       contactId: contact.id,
          //       index: 0,
          //     }),
          //   );
        }
      });
    }
    // dispatch(storeUnreadCount());
    // dispatch(getTeamUser());
    // dispatch(getUserLeadSource());
    // dispatch(getUserVirtualNumber());
    // dispatch(getUserCustomField());
    // dispatch(getUserStandardPersonalized());
  };
  const handleTabClick = (screen: any) => {
    try {
      Keyboard.dismiss();
    } catch (error) {}
    navigation.navigate(screen as never);
  };
  useLayoutEffect(() => {
    initialSetup();
  }, []);
  return {navigation, handleTabClick};
};
export default useHome;
