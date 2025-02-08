import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, ActivityIndicator, FlatList} from 'react-native';
import Container from '../../../layouts/Container.layout';
import Header from '../../../components/core/header/Header.core';
import ImagePreview from '../../../components/core/ImagePreview.core.component';
import imageLink from '../../../assets/images/imageLink';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {screens} from '../../../routes/routeName.route';
import EmptyContent from '../../../components/core/EmptyContent.core.component';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {AssistsStates, themeStates} from '../../../state/allSelector.state';
import {Trans, useTranslation} from 'react-i18next';
import {
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../../state/features/Assist/AssistsSlice';
import {TouchableOpacity} from 'react-native';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../../assets/global-styles/color.assets';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import SearchInput from '../../../components/app/SearchInput.app';
import Pagination from '../../../components/core/Pagination.core.component';
import SelectMonth from '../../../components/app/SelectMonth.app';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import ShowCalender from '../../../components/app/ShowCalender.app';
import moment from 'moment';

const AssistsVig = () => {
  const navigation = useCustomNavigation<any>();
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    isGetting,
    search,
    totalPages,
    results,
  } = customUseSelector(AssistsStates);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const {colors} = useTheme() as any;
  const abc = customUseSelector(AssistsStates);
  console.log('abc', abc);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
    period: new Date(),
  });
  console.log('checking lists......', list);
  const {theme} = customUseSelector(themeStates);
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const [itemCount, setItemCount] = useState(0);
  const onRefresh = useCallback(() => {
    setParams(prev => ({...prev, page: 1}));
    dispatch(refreshingAction({search}));
  }, [dispatch, search]);
  useEffect(() => {
    setItemCount(list.length);
  }, [list]);
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );
  const handleSearch = (text: string) => {
    setParams({...params, search: text});
    dispatch(searchingAction({...params, search: text}));
  };
  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction(params));
    }
  }, []);
  const loadMore = () => {
    if (hasMore) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(gettingMoreAction({...params, page: newPage}));
    }
  };
  //pagination code
  const onNext = () => {
    if (params.page < totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };
  //pagination code
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };
  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const formattedDate = moment(newDate).format('YYYY-MM-DD');
    setParams({...params, period: formattedDate});
    dispatch(searchingAction({...params, period: formattedDate, search}));
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {name, accessType, note, _id, images, createdAt} = item || {};
    const mediaUrl = item?.images[0];
    const formattedTime = moment(createdAt)
      .utcOffset('+5:30')
      .format('hh:mm A');

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        //onPress={() =>
        //   navigation.navigate(screens.AddUpdateAssistsVig, {
        //     id: _id,
        //     index,
        //     edit: true,
        //   })
        // }
        style={[
          globalStyles.flexRow,
          globalStyles.flexGrow1,
          {
            alignItems: `${'flex-start'}`,
            ...customPadding(10, 10, 10, 10),
            backgroundColor: theme === 'dark' ? 'white' : colors.graySoft,
            borderRadius: rs(10),
            marginTop: rs(10),
          },
        ]}>
        <ImagePreview
          source={mediaUrl ? {uri: mediaUrl} : imageLink.placeholder}
          styles={{
            marginTop: rs(10),
            width: rs(50),
            height: rs(50),
            borderRadius: rs(50),
            borderWidth: rs(2),
            borderColor: colors.white,
          }}
        />
        <View style={[globalStyles.flexShrink1, {flexGrow: 1, marginLeft: 10}]}>
          <Text
            style={[
              typographies(colors).montserratNormal18,
              {color: colors.primary},
            ]}>
            {name}
          </Text>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                // typographies(colors).ralewayMedium12,
                {
                  color:
                    theme === 'dark'
                      ? 'black'
                      : typographies(colors).ralewayMedium12,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {accessType}
            </Text>
          </View>
          <View style={[globalStyles.flexShrink1]}>
            <Text
              style={[
                globalStyles.flexShrink1,
                {
                  color:
                    theme === 'dark'
                      ? 'grey'
                      : typographies(colors).ralewayMedium12,
                  lineHeight: rs(20),
                  marginTop: rs(3),
                },
              ]}
              numberOfLines={2}>
              {note}
            </Text>
          </View>
        </View>
        <Text
          style={[
            globalStyles.flexShrink1,
            typographies(colors).ralewayMedium12,
            {alignSelf: 'center'},
          ]}
          numberOfLines={2}>
          {formattedTime}
        </Text>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container>
      <Header
        text={trans('Assists')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.AddUpdateAssistsVig as never)
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
            <View style={{backgroundColor: colors.white}}>
              <SearchInput
                defaultValue={params.search}
                onChangeText={handleSearch}
                style={{marginBottom: rs(10)}}
              />
              <View
                style={{
                  ...globalStyles.flexRow,
                  justifyContent: 'space-between',
                }}>
                <SelectMonth
                  style={{...customMargin(10, 5, 0, 10)}}
                  defaultValue={new Date() || selectedDate}
                  //showYearOnly={true}
                  onPress={handleMonthChange}
                />
                <View>
                  <Text
                    style={{
                      ...typographies(colors).ralewayBold15,
                      color: theme === 'dark' ? 'white' : colors.primary,
                    }}>
                    {`${trans('Total')}: ${results}`}
                  </Text>
                </View>
              </View>
            </View>
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
            {hasMore ? (
              <View style={[{height: rs(40)}, globalStyles.activityCenter]}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              !isLoading &&
              totalPages > 1 && (
                <Pagination
                  PageNo={params.page}
                  onNext={() => onNext()}
                  onBack={() => onBack()}
                />
              )
            )}
          </>
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default AssistsVig;
