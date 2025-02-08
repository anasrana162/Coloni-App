import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import IconCircle from '../../components/app/IconCircle.app';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {userRoles} from '../../assets/ts/core.data';
import documentsService from '../../services/features/documents/documents.service';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/documents/documents.slice';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {documentsStates, userStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import {
  debounceHandler,
  formatDate,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import SelectMonth from '../../components/app/SelectMonth.app';
import Pagination from '../../components/core/Pagination.core.component';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
const PrivateDocuments = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const isFocused = useIsFocused();
  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    totalPages,
  } = customUseSelector(documentsStates);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
    month: moment().month() + 1,
    year: moment().year(),
    isAdmin: false,
    id: userInfo?._id,
    type: 'Resident',
  });
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const onNext = () => {
    if (params.page < totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({
        ...prevParams,
        page: newPage,
      }));
      dispatch(
        isGettingAction({
          ...params,
          page: newPage,
        }),
      );
    }
  };
  //for pagination
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({
        ...prevParams,
        page: newPage,
      }));
      dispatch(
        isGettingAction({
          ...params,
          page: newPage,
        }),
      );
    }
  };
  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };
  const handleSearch = (text: string) => {
    setParams(prevParams => ({
      ...prevParams,
      search: text,
    }));
    debounceHandler(dispatch(searchingAction({search: text})));
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    setParams({
      ...params,
      month: moment(newDate).month() + 1,
      year: moment(newDate).year(),
    });
    dispatch(
      searchingAction({
        ...params,
        month: moment(newDate).month() + 1,
        year: moment(newDate).year(),
      }),
    );
  };
  useEffect(() => {
    if (isFocused) {
      console.log('Parasm intaila', params);
      dispatch(isGettingAction(params));

      // Reset search parameter when the screen is focused
      setParams(prevParams => ({
        ...prevParams,
        search: '', // Reset the search
      }));
    }
  }, [isFocused]);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {document, qualification, date, note, _id, createdAt} = item || {};
    console.log('Document', item);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          if (userInfo?.role == userRoles.RESIDENT) {
            // Resident / Vigilant should go here
            await Linking.openURL(item?.uploadfile.toString());
            // navigation.navigate(screens.viewDocument as never, {
            //   edit: true,
            //   index,
            //   item,
            // });
          } else {
            // admin / super Admin
            navigation.navigate(screens.addDocuments as never, {
              edit: true,
              index,
              id: item?._id,
            });
          }
        }}
        style={[
          globalStyles.flexRow,
          {
            ...customPadding(7, 7, 7, 14),
            backgroundColor: colors.graySoft,
            borderRadius: rs(25),
            marginTop: rs(15),
            gap: rs(20),
          },
        ]}>
        <IconCircle
          icon={
            <ImagePreview
              source={item?.uploadfile?.[0] ? imageLink.pdfIcon : imageLink}
              styles={{height: rs(40), width: rs(40), borderRadius: 500}}
              borderRadius={500}
            />
          }
          style={{height: rs(40), width: rs(40)}}
        />
        <View style={{width: '55%'}}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {color: colors.primary},
            ]}>
            {document?.name}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {
                color: colors.primary,
                lineHeight: rs(20),
                flexShrink: 1,
                flexGrow: 1,
              },
            ]}>
            {qualification}
          </Text>

          <Text
            style={[
              typographies(colors).montserratNormal8,
              globalStyles.flexShrink1,
              {color: colors.gray12, lineHeight: rs(17)},
            ]}>
            {formatDate(createdAt, 'DD/MM/YYYY')}{' '}
            {moment(createdAt).format('LT')}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.flexShrink1,
              {gap: rs(5)},
            ]}>
            <Text
              style={[
                typographies(colors).montserratSemibold,
                globalStyles.flexShrink1,
                {color: colors.primary, lineHeight: rs(17), fontSize: 12},
              ]}>
              {trans('See file')}
            </Text>
            {/* <DownArrow style={{transform: [{rotate: '-90deg'}]}} /> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  //   console.log('list', list);

  return (
    <Container>
      <Header text={trans('Private Documents')} />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        // initialNumToRender={2}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={params?.search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
            <SelectMonth
              style={{...customMargin(8, 2, 10, 2)}}
              defaultValue={new Date() || selectedDate}
              onPress={handleMonthChange}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
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

        // onEndReachedThreshold={0.25}
        // onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default PrivateDocuments;
