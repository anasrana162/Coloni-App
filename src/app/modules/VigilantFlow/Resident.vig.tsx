import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../layouts/Container.layout';
import {
  customMargin,
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import AdministratorIcon from '../../assets/images/svg/adminstratorIcon.svg';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import {useTheme} from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import userService from '../../services/features/users/user.service';
import {useTranslation} from 'react-i18next';
import {
  gettingMoreAction,
  searchingAction,
} from '../../state/features/user/ResidentVig.slice';
import Pagination from '../../components/core/Pagination.core.component';
import {ResidentVigStates} from '../../state/allSelector.state';
import AlertIcon from '../../assets/images/svg/alertIcon.svg';
import Truck from '../../assets/images/svg/Truck.svg';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import Header from '../../components/core/header/HeaderWithTwoRightIcons';
import GarbageArrivedModal from './HomeScreenVig/GarbageArrived';
import GarbageArrivedServices from '../../services/features/GarbageArrived/GarbageArrivedServices';
import {showAlertWithOneAction} from '../../utilities/helper';

const ResidentVig: React.FC = () => {
  const navigation = useCustomNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = customUseDispatch();
  const [totalPages, setTotalPages] = useState(1);
  const {t: trans} = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const {hasMore, page, perPage, search} = customUseSelector(ResidentVigStates);
  const {colors} = useTheme() as any;
  const [params, setParams] = useState({page: 1, perPage: 10});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getDataHandler = useCallback(async () => {
    setLoading(true);
    try {
      const result = await userService.ResidentVig(params);
      const {body} = result;
      setData(body?.list || []);
      setTotalPages(body?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const onNext = () => {
    if (params.page < totalPages) {
      setParams(prevParams => ({...prevParams, page: prevParams.page + 1}));
    }
  };

  const onBack = () => {
    if (params.page > 1) {
      setParams(prevParams => ({...prevParams, page: prevParams.page - 1}));
    }
  };
  const handleSearch = useCallback(
    (text: string) => {
      dispatch(searchingAction({search: text}));
      if (text.trim() === '') {
        getDataHandler();
      } else {
        const filteredData = data.filter(
          item =>
            item.name?.toLowerCase().includes(text.toLowerCase()) ||
            item.street?.name?.toLowerCase().includes(text.toLowerCase()) ||
            item.home?.toLowerCase().includes(text.toLowerCase()),
        );
        setData(filteredData);
      }
    },
    [data, dispatch, getDataHandler],
  );
  useEffect(() => {
    getDataHandler();
  }, [getDataHandler, params]);

  const loadMore = useCallback(() => {
    if (hasMore && loading) {
      dispatch(gettingMoreAction({page, perPage, search}));
    }
  }, [hasMore, loading, page, perPage, search, dispatch]);

  const handleGarbagePressed = async () => {
    const payload = {
      notify: true,
      sendTo: 'Private',
    };

    try {
      const result = await GarbageArrivedServices.create(payload);
      const {status, message, body} = result;
      if (status) {
        console.log('Notification created successfully');
      } else {
        console.error('Failed to create notification:', message);
        showAlertWithOneAction({
          title: trans('Notification Error'),
          body: message,
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      showAlertWithOneAction({
        title: trans('Notification Error'),
        body: trans('Failed to create notification'),
      });
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setParams(prevParams => ({...prevParams, page: 1}));
    await getDataHandler();
    setRefreshing(false);
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const onPress = () => {
      navigation.navigate(screens.VisitsHomeScreenVig as never, {
        index,
        id: item?._id,
        item: item,
      });
    };
    return (
      <TouchableOpacity
        style={{
          ...styles.container,
          backgroundColor: colors.recieveBg,
          borderColor: colors.primary,
        }}
        activeOpacity={0.7}
        onPress={onPress}>
        <View
          style={[
            globalStyles.justifyAlignCenter,
            shadow(colors).shadow,
            {
              height: rs(30),
              width: rs(30),
              borderRadius: rs(40),
              backgroundColor: colors.primary,
            },
          ]}>
          <AdministratorIcon />
        </View>
        <View>
          <Text style={typographies(colors).montserratMedium10}>
            {item?.street?.name} {item?.home}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const memoizedRenderItem = useMemo(() => renderItem, []);

  return (
    <Container bottomTab={false}>
      {showModal && (
        <GarbageArrivedModal
          title={trans('Garbage arrived')}
          onDismiss={() => setShowModal(false)}
        />
      )}
      <Header
        text={trans('Receive')}
        leftIcon={false}
        rightIcon={
          <TouchableOpacity
            style={[
              globalStyles.justifyAlignCenter,
              {
                backgroundColor: colors.primary,
                height: rs(50),
                width: rs(50),
                borderRadius: rs(50),
              },
            ]}
            onPress={() =>
              navigation.navigate(screens.NotificationDashboard as never)
            }>
            <AlertIcon />
          </TouchableOpacity>
        }
        secondRightIcon={
          <TouchableOpacity
            style={[
              globalStyles.justifyAlignCenter,
              {
                backgroundColor: colors.primary,
                height: rs(50),
                width: rs(50),
                borderRadius: rs(50),
              },
            ]}
            onPress={() => setShowModal(true)}>
            <Truck />
          </TouchableOpacity>
        }
        // rightControl={() => navigation.navigate(screens.NotificationDashboard as never)}
        // secondRightControl={() => setShowModal(true)}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={globalStyles.activityCenter}
        />
      )}
      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        data={data}
        stickyHeaderIndices={[0]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              onChangeText={handleSearch}
              style={{...customMargin(4, 20, 20, 20)}}
            />
          </View>
        }
        contentContainerStyle={[
          globalStyles.emptyFlexBox,
          {...customPadding(17, 0, 20, 0)},
        ]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={2}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no visits found!')}
            forLoading={loading}
          />
        }
        renderItem={memoizedRenderItem}
        ListFooterComponent={
          <>
            {hasMore && loading ? (
              <View style={[{height: rs(40)}, globalStyles.activityCenter]}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              !loading &&
              totalPages > 1 && (
                <Pagination
                  PageNo={params.page}
                  onNext={onNext}
                  onBack={onBack}
                />
              )
            )}
          </>
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore ? loadMore : null}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,

    flexDirection: 'row',
    ...customPadding(10, 16, 6, 12),
    alignItems: 'center',
    borderRadius: 15,
    gap: 19,
    ...customMargin(4, 20, 4, 20),
  },
});

export default ResidentVig;
