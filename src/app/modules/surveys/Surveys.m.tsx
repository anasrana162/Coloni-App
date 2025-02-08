import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import Badge from '../../components/app/Badge.app';
import {
  customMargin,
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import ProgressBar from '../../components/app/ProgressBar.app';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {
  debounceHandler,
  formatDate,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import surveysService from '../../services/features/surveys/surveys.service';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/surveys/surveys.slice';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {surveysStates, userStates} from '../../state/allSelector.state';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {userRoles} from '../../assets/ts/core.data';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {getLocalData} from '../../packages/asyncStorage/storageHandle';
import SelectMonth from '../../components/app/SelectMonth.app';
import Pagination from '../../components/core/Pagination.core.component';

const Surveys = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);
  const [residentList, setResidentList] = useState<any[]>([]);
  const [loadingResidentData, setLoadingResidentData] =
    useState<boolean>(false);
  // const getDataHandler = async () => {
  //   const result = await surveysService.Surveylist()?.data;
  //   console.log('checking result..',result);
  //   return result;
  //   // success(result);
  // };
  console.log('residentList', residentList);
  const getDataHandler = async () => {
    const token = await getLocalData.getApiToken();
    setLoadingResidentData(true);
    try {
      const response = await fetch('https://backend.coloniapp.com/surveys/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      const result = await response.json();
      console.log('Checking result:', result?.data);
      if (Array.isArray(result?.data?.list)) {
        setResidentList(result?.data?.list);
        return;
      }
      setResidentList([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingResidentData(false);
    }
  };
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    status,
    period,
    search,
    totalPages,
    total,
  } = customUseSelector(surveysStates);
  console.log('checking survey', list);
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    search: '',
  });
  const onNext = () => {
    if (params.page < totalPages) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };
  //for pagination
  const onBack = () => {
    if (params.page > 1) {
      const newPage = params.page - 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(isGettingAction({...params, page: newPage}));
    }
  };
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, []),
  );
  const onRefresh = () => {
    setParams(prev => ({...prev, page: 1}));
    dispatch(refreshingAction({status, period}));
  };

  const handleSearch = debounceHandler((text: string) => {
    setParams({...params, status: text});
    dispatch(searchingAction({...params, status: text, period}));
  });
  const isAdmin = () => {
    if (
      userInfo.role == userRoles.ADMIN ||
      userInfo.role === userRoles.SUPER_ADMIN
    ) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (userInfo?.role === userRoles.RESIDENT) {
      getDataHandler();
    }
  }, [userInfo?.role]);
  useEffect(() => {
    if (!isGetting) {
      dispatch(isGettingAction(params));
    }
  }, [list, params]);
  const loadMore = useCallback(() => {
    if (hasMore && !isGetting) {
      const newPage = params.page + 1;
      setParams(prevParams => ({...prevParams, page: newPage}));
      dispatch(
        gettingMoreAction({
          ...params,
          page: newPage,
          perPage,
          period,
          status,
          search,
        }),
      );
    }
  }, [hasMore, isGetting, params]);
  // useEffect(() => {
  //   // if (userInfo?.role === userRoles.RESIDENT) {
  //   //   getDataHandler();
  //   // }
  //   if (!isGetting) {
  //     dispatch(isGettingAction());
  //   }
  // }, []);
  // const loadMore = () => {
  //   hasMore &&
  //     dispatch(gettingMoreAction({ page, perPage, period, status, search }));
  // };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {votes, question, _id} = item || {};
    return (
      <TouchableOpacity
        onPress={() =>
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.addUpdateSurveys as never, {
                edit: true,
                id: _id,
                index,
              })
            : undefined
        }
        activeOpacity={0.7}
        style={[
          shadow(colors).shadow,
          {
            ...customMargin(8, 20, 4, 20),
            ...customPadding(5, 16, 10, 16),
            backgroundColor: colors.gray10,
            borderRadius: rs(10),
          },
        ]}>
        <View style={globalStyles.rowBetween}>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              {lineHeight: rs(20), flexGrow: 1},
            ]}
            numberOfLines={5}>
            {question}
          </Text>
        </View>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.tertiary, lineHeight: rs(16)},
          ]}>
          {trans('Date: ')}
          {formatDate(item?.createdAt, 'DD/MM/YYYY')}
        </Text>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.tertiary, lineHeight: rs(16)},
          ]}>
          {trans('Validity: ')}
          {formatDate(item?.dueDate, 'DD-MM-YYYY')}
        </Text>

        {(userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN) && (
          <>
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.tertiary, lineHeight: rs(16)},
              ]}>
              {trans('Vote')}: {votes?.length}
            </Text>
            <View style={{...customMargin(10, 0, 10, 0)}}>
              <ProgressBar
                width={item?.favorPercentage}
                slider={true}
                style={{marginBottom: rs(4)}}
              />

              <Text
                style={[
                  typographies(colors).ralewayMedium10,
                  {
                    color: colors.black,
                    lineHeight: rs(20),
                    marginBottom: rs(6),
                  },
                ]}>
                In Favor - {item?.favorVotes} Votes ({' '}
                {Math.round(item?.favorPercentage)}% )
              </Text>

              <ProgressBar
                width={item?.againstPercentage}
                slider={true}
                style={{marginBottom: rs(4)}}
              />
              <Text
                style={[
                  typographies(colors).ralewayMedium10,
                  {color: colors.black, lineHeight: rs(20)},
                ]}>
                In Against - {item?.againstVotes} Votes ({' '}
                {Math.round(item?.againstPercentage)}% )
              </Text>
            </View>
          </>
        )}
        <Badge
          style={{alignSelf: 'flex-end', borderRadius: rs(10)}}
          textColor={colors.black}
          text={trans('See Details')}
          onPress={() => {
            if (
              userInfo?.role === userRoles.ADMIN ||
              userInfo?.role === userRoles.SUPER_ADMIN
            ) {
              navigation.navigate(screens.detailsSurveys as never, {
                id: _id,
                item: item,
              });
            } else if (userInfo?.role === userRoles.RESIDENT) {
              navigation.navigate(screens.SurveyResident as never, {item});
            }
          }}
        />
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Surveys')}
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) &&
          navigation.navigate(screens.addUpdateSurveys as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={() => {
          if (
            userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN
          ) {
            onRefresh();
          } else {
            getDataHandler();
          }
        }}
        data={isAdmin() ? list : residentList}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            {(userInfo?.role === userRoles.ADMIN ||
              userInfo?.role === userRoles.SUPER_ADMIN) && (
              <View style={[globalStyles.flexRow, customMargin(18, 20, 4, 20)]}>
                <Badge
                  text={trans('Assets')}
                  style={{width: `${'49%'}`}}
                  bgColor={status === 'assets' ? '' : colors.gray5}
                  onPress={() => handleSearch('assets')}
                  textColor={status === 'assets' ? '' : colors.gray7}
                />
                <Badge
                  text={trans('InActive')}
                  style={{width: `${'49%'}`}}
                  bgColor={status === 'inactive' ? '' : colors.gray5}
                  onPress={() => handleSearch('inactive')}
                  textColor={status === 'inactive' ? '' : colors.gray7}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <SelectMonth
                showYearOnly={true}
                style={{...customMargin(8, 20, 4, 22)}}
                defaultValue={new Date() || period}
                onPress={period => {
                  dispatch(searchingAction({status, period, search}));
                }}
              />
              <Text
                style={{
                  ...typographies(colors).ralewayBold15,
                  color: colors.primaryText,
                  ...customMargin(8, 20, 4, 20),
                }}>
                {trans('Total')}: {total}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{gap: rs(5)}}
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
        // ListFooterComponent={
        //   hasMore ? (
        //     <View style={[{ height: rs(40) }, globalStyles.activityCenter]}>
        //       <ActivityIndicator color={colors.primary} />
        //     </View>
        //   ) : undefined
        // }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default Surveys;
