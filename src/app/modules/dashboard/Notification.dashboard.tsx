import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import AppIcon from '../../assets/images/svg/AppIcon.svg';
import {useCustomNavigation} from '../../packages/navigation.package';
import {themeStates, userStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import database from '@react-native-firebase/database';
import {userRoles} from '../../assets/ts/core.data';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import NotificationDeleteServices from '../../services/features/notifications/Notification.delete.services';
import Pagination from '../../components/core/Pagination.core.component';
import {getUniqueId} from 'react-native-device-info';

interface Notification {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
}

const NotificationDashboard = () => {
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();
  const {userInfo} = customUseSelector(userStates);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const {colors} = useTheme() as any;
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const {theme} = customUseSelector(themeStates);

  const user_id = userInfo?._id;

  const fetchData = async (pageNum = 1) => {
    var getDeviceUniqueID = await getUniqueId();
    setLoadingNotifications(true);
    const notificationData = await readAllNotifications(
      user_id,
      getDeviceUniqueID,
    );
    console.log('notificationData:', notificationData);
    const notificationsArray: Notification[] = notificationData
      ? Object.values(notificationData)
      : [];
    notificationsArray.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const start = (pageNum - 1) * itemsPerPage;
    const paginatedNotifications = notificationsArray.slice(
      start,
      start + itemsPerPage,
    );
    console.log('paginatedNotifications', paginatedNotifications);
    setNotifications(paginatedNotifications);
    const grouped = groupNotificationsByDate(paginatedNotifications);
    const sortedGroupedNotifications = Object.entries(grouped)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, items]) => ({date, items}));

    setGroupedNotifications(sortedGroupedNotifications);
    setLoadingNotifications(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleDelete = async (notificationId: string, residentId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion canceled'),
          style: 'cancel',
        },
        {
          text: trans('OK'),
          onPress: async () => {
            setLoading(true);
            try {
              var getDeviceUniqueID = await getUniqueId();
              await NotificationDeleteServices.delete(
                residentId,
                notificationId,
                getDeviceUniqueID,
              );
              setNotifications(prev =>
                prev.filter(
                  notification => notification._id !== notificationId,
                ),
              );
              await fetchData(page);
            } catch (error) {
              console.error('Error deleting notification:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const formatMessageDate = (timestamp: string) => {
    const date = moment(timestamp);
    if (!date.isValid()) {
      console.error('Invalid date format:', timestamp);
      return '';
    }
    const today = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(today, 'day')) {
      return 'Today';
    } else if (date.isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return date.format('MM/DD/YYYY');
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    return notifications.reduce((acc, notification) => {
      const formattedDate = formatMessageDate(notification.createdAt);
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);
  };

  const readAllNotifications = async (id: any, deviceId: string) => {
    setLoadingNotifications(true);
    const ref = database().ref(`notifications/${id}_${deviceId}`);
    try {
      const snapshot = await ref.once('value');
      return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
      console.error('Error reading data from reference:', error);
      return [];
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {date: string; items: Notification[]};
  }) => (
    <View>
      <Text
        style={[
          typographies(colors).ralewayBold15,
          {
            color: theme === 'dark' ? 'white' : colors.primary,
            marginTop: rs(8),
          },
        ]}>
        {item.date}
      </Text>
      {item.items.map(notification => (
        <TouchableOpacity
          key={notification._id}
          activeOpacity={0.8}
          style={[
            globalStyles.flexRow,
            globalStyles.flexGrow1,
            {
              alignItems: 'center',
              ...customPadding(20, 10, 20, 10),
              backgroundColor: theme === 'dark' ? 'white' : colors.gray,
              borderRadius: rs(10),
              marginTop: rs(10),
            },
          ]}>
          <View
            style={[
              globalStyles.justifyAlignCenter,
              {
                alignSelf: 'center',
                backgroundColor: colors.primary,
                height: rs(30),
                width: rs(30),
                borderRadius: rs(50),
              },
            ]}>
            <AppIcon />
          </View>
          <View
            style={[globalStyles.flexShrink1, {marginTop: rs(0), flexGrow: 1}]}>
            <Text
              style={[
                typographies(colors).ralewayBold12,
                {color: colors.primary},
              ]}>
              {typeof notification?.sender === 'string'
                ? notification.sender
                : ''}
            </Text>
            <Text
              style={[
                typographies(colors).ralewayBold12,
                {color: theme === 'dark' ? 'black' : colors.grayDark},
              ]}>
              {notification.title}
            </Text>
            <View style={[globalStyles.flexShrink1]}>
              <Text
                style={[
                  globalStyles.flexShrink1,
                  typographies(colors).ralewayMedium10,
                  {
                    color: theme === 'dark' ? 'grey' : colors.black,
                    lineHeight: rs(20),
                    marginTop: rs(3),
                  },
                ]}>
                {notification.body}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleDelete(notification._id, user_id)}>
            <DeleteIcon height={rs(18)} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const memoizedRenderItem = useMemo(() => renderItem, []);

  const onNext = () => setPage(prev => prev + 1);
  const onBack = () => page > 1 && setPage(prev => prev - 1);

  return (
    <Container>
      <Header text={trans('Notifications')} />
      {loadingNotifications || loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={groupedNotifications}
            renderItem={memoizedRenderItem}
            keyExtractor={(_item, index) => index.toString()}
            ListEmptyComponent={
              <EmptyContent text={trans('There are no notifications!')} />
            }
            contentContainerStyle={{padding: rs(20)}}
            // ListFooterComponent={() =>
            //   groupedNotifications.length > 0 && (
            //     <Pagination PageNo={page} onNext={onNext} onBack={onBack} />
            //   )
            // }
          />
        </>
      )}
    </Container>
  );
};

export default NotificationDashboard;
