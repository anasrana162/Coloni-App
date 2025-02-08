import {
  ActivityIndicator,
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
  customMargin,
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
} from '../../state/features/raffles/raffles.slice';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {rafflesStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import rafflesServices from '../../services/features/raffles/raffles.service';
import {
  debounceHandler,
  formatDate,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {useIsFocused} from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';
import ShowDate from '../../components/app/ShowDate.app';
import moment from 'moment';
import SelectMonth from '../../components/app/SelectMonth.app';

const Raffles = () => {
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
    totalPages,
    search,
  } = customUseSelector(rafflesStates);
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  const {colors} = useTheme() as any;

  const [params, setParams] = useState({
    page: 1,
    perPage: 12,
    search: '',
    period: moment(new Date()).format('YYYY-MM-DD'),
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };

  const handleSearch = (text: string) => {
    debounceHandler(dispatch(searchingAction({...params, search: text})));
  };

  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    setParams({
      ...params,
      page: params.page + 1,
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: params.page + 1,
      }),
    );
  };

  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    setParams({
      ...params,
      page: params.page - 1,
    });
    dispatch(
      gettingMoreAction({
        ...params,
        page: params.page - 1,
      }),
    );
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(searchingAction({...params, search: ''}));
      dispatch(isGettingAction(params));
    }
  }, [isFocused]);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {date, title, _id, description} = item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screens.addUpdateRaffles, {
            id: _id,
            index,
            edit: true,
          })
        }
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {
            alignItems: 'flex-start',
            ...customPadding(10, 10, 10, 10),
            backgroundColor: colors.graySoft,
            borderRadius: rs(10),
            marginTop: rs(10),
          },
        ]}>
        <View style={[globalStyles.flexShrink1, {flexGrow: 1, marginLeft: 10}]}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {color: colors.grayDark},
            ]}>
            {title}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium10,
                {color: colors.darkBlue2, lineHeight: rs(20), marginTop: rs(3)},
              ]}
              numberOfLines={2}>
              {description}
            </Text>
          </View>
          <View style={globalStyles.flexRow}>
            <CalenderIcon height={rs(12)} width={rs(12)} />
            <Text
              style={[
                globalStyles.flexShrink1,
                typographies(colors).ralewayMedium10,
                {color: colors.gray9, marginTop: rs(3)},
              ]}>
              {moment(date).format('YYYY-MM-DD')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(() => renderItem, []);

  function handledateChange(date: any): void {
    setSelectedDate(date);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setParams({
      ...params,
      period: formattedDate,
      page: 1,
    });
    dispatch(
      searchingAction({
        ...params,
        period: formattedDate,
        page: 1,
      }),
    );
  }

  return (
    <Container>
      <Header
        text={trans('Raffles')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addUpdateRaffles as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
              keyboardType={'default'}
            />
            {/* <ShowDate
              style={{...customMargin(2, 2, 2, 2)}}
              selectDate={setSelectedDate}
              defaultValue={selectedDate}
              onPress={() => {
                // const formattedDate =;

                console.log(moment(selectedDate).format('YYYY-MM-DD'));

                dispatch(
                  searchingAction({
                    ...params,
                    period: moment(selectedDate).format('YYYY-MM-DD'),
                  }),
                );
              }}
            /> */}
            <SelectMonth
              style={{paddingLeft: rs(9)}}
              defaultValue={selectedDate}
              name="date"
              onPress={date => handledateChange(date)}
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
          !isLoading && totalPages > 1 ? (
            <Pagination
              PageNo={params?.page}
              onNext={onNextPage}
              onBack={onPrevPage}
            />
          ) : null
        }
      />
    </Container>
  );
};

export default Raffles;
