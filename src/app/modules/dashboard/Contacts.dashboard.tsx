import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/chats/chats.slice';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {chatsStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import chatsServices from '../../services/features/chats/chats.service';
import {formatDate, showAlertWithTwoActions} from '../../utilities/helper';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {config} from '../../../Config';
import {userStates} from '../../state/allSelector.state';
import {userRoles} from '../../assets/ts/core.data';
const EachItem: React.FC<{
  name?: string;
  id?: string;
}> = ({name = '', id = ''}) => {
  const navigation: any = useCustomNavigation();
  const {colors} = useTheme() as any;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate(screens.chat as never, {id, name})}
      style={{
        ...customPadding(15, 0, 15),
        borderBottomWidth: rs(1),
        borderBottomColor: colors.gray5,
      }}>
      <Text
        style={[
          typographies(colors).ralewayMedium12,
          {
            ...customPadding(0, 0, 0, 20),
            color: colors.primaryText,
            flexShrink: rs(1),
          },
        ]}
        numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};
const Contacts = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
  } = customUseSelector(chatsStates);
  const dispatch = customUseDispatch();
  var {userInfo} = customUseSelector(userStates);
  const {colors} = useTheme() as any;
  const [dataList, setDataList] = useState([]);

  const onRefresh = () => {
    dispatch(
      refreshingAction({
        colony: userInfo?.colony,
        accesskey: userInfo?.accessKey,
        page: 1,
        perPage: 100,
      }),
    );
  };
  const handleSearch = (text: string) => {
    // dispatch(searchingAction({arr: list, text}));

    const filtered = list.filter((item: any) =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setDataList(filtered);
  };

  useEffect(() => {
    if (!isGetting) {
      dispatch(
        isGettingAction({
          colony: userInfo?.colony,
          accesskey: userInfo?.accessKey,
          page: 1,
          perPage: 100,
        }),
      );
    }
  }, []);

  // did this extra step to filter contacts
  useEffect(() => {
    setDataList(list);
  }, [list]);

  const loadMore = () => {
    hasMore &&
      dispatch(
        gettingMoreAction({
          colony: userInfo?.colony,
          accesskey: userInfo?.accessKey,
          page: 1,
          perPage: 100,
        }),
      );
  };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await chatsServices.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this chats?'),
      onPressAction: confirm,
    });
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {name, _id} = item || {};
    return <EachItem name={name} id={_id} />;
  };
  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container>
      <Header
        text={
          userInfo?.role === userRoles.VIGILANT
            ? trans('Chats')
            : trans('Contacts')
        }

        // rightIcon={<ImagePreview source={imageLink.addIcon} />}
        // rightControl={
        //   () => {}
        //   // navigation.navigate(screens.addUpdatechats as never)
        // }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={false} //refreshing
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={dataList}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            // forLoading={isLoading}
          />
        }
        contentContainerStyle={{
          ...customPadding(20, 20, 10, 20),
          gap: rs(5),
          // paddingBottom: '40%',
        }}
        ListFooterComponent={
          hasMore ? (
            <View style={[{height: rs(40)}, globalStyles.activityCenter]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : undefined
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default Contacts;
