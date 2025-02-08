import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {announcementsStates, userStates} from '../../state/allSelector.state';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/announcements/announcements.slice';
import {debounceHandler, showAlertWithTwoActions} from '../../utilities/helper';
import announcementsService from '../../services/features/announcements/announcements.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {userRoles} from '../../assets/ts/core.data';
import SelectMonth from '../../components/app/SelectMonth.app';
import io from 'socket.io-client';
import {config} from '../../../Config';
import moment from 'moment';
import Pagination from '../../components/core/Pagination.core.component';
import SelectYear from '../../components/app/SelectYear';
const Announcements = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    totalPages, 
    search,
    total,
  } = customUseSelector(announcementsStates);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [announcementViews, setAnnouncementViews] = useState({});
  const userid = userInfo?._id;
  const [socket, setSocket] = useState<any>({});
  const [key, setKey] = useState<any>({}); 
  const [params, setParams] = useState({
    page: 1,
    perPage: 12,
    search: '',
    // month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const SOCKET_SERVER_URL = 'https://backend.coloniapp.com/'; 
 
  
  useEffect(() => {
    setAnnouncementViews(list);
    setKey(key + 1);
  }, [list]);
  
  useEffect(() => {
    // if (!isGetting) {
    console.log('Token:', config.token);
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on('connect', () => {
      console.log('Socket connected, joining room...');
      setSocket(newSocket);
    });
    dispatch(isGettingAction(params));
    setKey(key + 1);
    return () => {
      newSocket.close();
    };
  }, [SOCKET_SERVER_URL, userid]);
  
  useEffect(() => {
    console.log('socket in second effect', socket);
    if (Object.keys(socket).length > 0) {
      socket.emit('joinRoom', {userId: userid});
      console.log('resching inside socket func second');
      socket.on('announcementViewed', (data: any) => {
        console.log('Received announcementViewed event', data);
        const {announcementId, userId} = data;
        setAnnouncementViews((prev: any) =>
          prev?.map((announcement: any) =>
            announcement._id === announcementId
              ? {...announcement, views: [...announcement.views, userId]}
              : announcement,
          ),
        );
        
        dispatch(isGettingAction(params));
        setKey(key + 1);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  
  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };
  const handleSearch = debounceHandler((text: string) => {
    setParams({...params, search: text});
    dispatch(searchingAction({...params, search: text}));
  });

  
  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    setParams({
      ...params,
      // month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    });
    dispatch(
      searchingAction({
        ...params,
        // month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      }),
    );
  };
  
  const handleEndEditing = txt => {
    setParams({...params, search: txt});
    dispatch(searchingAction({...params, search: txt}));
  };

  
  const onNext = () => {
    setParams({...params, page: params.page + 1});
    dispatch(isGettingAction({...params, page: params.page + 1}));
  };
  
  const onBack = () => {
    setParams({...params, page: params.page - 1});
    dispatch(isGettingAction({...params, page: params.page - 1}));
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {sendTo, note, views, createdBy, _id, qualification} = item || {};
    const imageUrl =
      item?.images && item?.images.length > 0
        ? {uri: item.images[0]}
        : imageLink.placeholder;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.addAnnouncement as never, {
                edit: true,
                index,
                id: item?._id,
                item: item,
              })
            : undefined
        }
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {
            alignItems: `${'center'}`,
            ...customPadding(10, 10, 10, 10),
            backgroundColor: colors.graySoft,
            borderRadius: rs(10),
            marginTop: rs(10),
          },
        ]}>
        <ImagePreview
          source={imageUrl}
          styles={{
            width: rs(70),
            height: rs(70),
            borderRadius: rs(50),
            borderWidth: rs(2),
            borderColor: colors.white,
          }}
        />
        <View
          style={[globalStyles.flexShrink1, {marginTop: rs(10), flexGrow: 1}]}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {color: colors.grayDark},
            ]}>
            {qualification}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium10,
                {
                  color: colors.darkBlue2,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {note}
            </Text>
          </View>
          <Text
            style={[
              globalStyles.flexShrink1,
              typographies(colors).ralewayMedium10,
              {
                color: colors.gray9,
                lineHeight: rs(20),
                marginTop: rs(3),
              },
            ]}>
            {trans('type: ')}
            {sendTo}
          </Text>
          <View>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium10,
                {
                  color: colors.primary,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}>
              {Array.isArray(views) && views.length > 1
                ? trans('{{x}} Views', {x: views.length})
                : trans('{{x}} View', {x: views.length})}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Announcements')}
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) &&
          navigation.navigate(screens.addAnnouncement as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        key={key}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={announcementViews}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={params?.search}
              onEndEditing={handleEndEditing}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
            <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

            <SelectMonth
             showYearOnly={true}
              defaultValue={selectedDate || new Date()} 
              onPress={handleMonthChange}
            />
            <Text style={[{color:colors.primary,fontSize:13},typographies(colors).ralewayBold15]}>{`${trans("Total")}: ${total}`}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <>
            {isLoading ? <ActivityIndicator size={"large"} color={colors.primary} />
              :
              <EmptyContent text={trans('There is no data!')} />}
          </>
        }
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
        ListFooterComponent={
          <>
            {!isLoading && totalPages > 1 && (
              <Pagination
                PageNo={params.page}
                onNext={() => onNext()}
                onBack={() => onBack()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};

export default Announcements;
