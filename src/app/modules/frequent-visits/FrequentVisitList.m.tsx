import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {screens} from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {userRoles} from '../../assets/ts/core.data';
import useFrequentVisit from './hooks/useFrequentVisit.hook';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {colors} from '../../assets/global-styles/color.assets';
import CameraIcon from '../../assets/icons/Camera.icon';
import IconCircle from '../../components/app/IconCircle.app';
import {useFocusEffect} from '@react-navigation/native';
import {
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/frequentVisit/frequentVisit.slice';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import Pagination from '../../components/core/Pagination.core.component';
import {frequentVisitStates, userStates} from '../../state/allSelector.state';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import {debounceHandler} from '../../utilities/helper';
import SelectMonth from '../../components/app/SelectMonth.app';
import moment from 'moment';
interface RadioButtonProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View style={styles.radioGroup}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionContainer,
            selectedValue === option && styles.selectedOptionContainer,
          ]}
          onPress={() => onSelect(option)}>
          <View style={styles.radioCircleContainer}>
            <View
              style={[
                styles.radioCircle,
                {
                  borderColor:
                    selectedValue === option ? colors.primary : colors.gray,
                },
              ]}>
              {selectedValue === option && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
          </View>
          <Text
            style={[
              styles.optionText,
              {
                color: selectedValue === option ? colors.white : colors.primary,
              },
            ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const FrequentVisitList: React.FC<{
  route: {params?: {index: number; id: string; item: any}};
}> = ({
  route: {params: {index, id, item} = {edit: false, index: -1, id: ''}},
}) => {
  const {userInfo} = customUseSelector(userStates);
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
  const {
    list,
    isLoading,
    refreshing,
    hasMore,
    page,
    perPage,
    isGetting,
    search,
    status,
    totalPages,
  } = customUseSelector(frequentVisitStates);
  const {colors} = useTheme() as any;
  const isFocused = useIsFocused(); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [params, setParams] = useState({
    resident: id,
    page: 1,
    perPage: 10,
    search: '',
    period: moment(new Date()).format('YYYY-MM-DD'),
  });
  const dispatch = customUseDispatch();

  useEffect(() => {
    if (isFocused) {
      dispatch(isGettingAction(params));
      
      // Reset search parameter when the screen is focused
      setParams(prevParams => ({
        ...prevParams,
        search: '', // Reset the search
      }));
    }
  }, [isFocused]);
  //for pagination
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
      setParams(prevParams => ({
        ...prevParams,
        page: newPage,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }));
      dispatch(
        isGettingAction({
          ...params,
          page: newPage,
          period: moment(selectedDate).format('YYYY-MM-DD'),
        }),
      );
    }
  };
  // const onRefresh = useCallback(() => {
  //     dispatch(refreshingAction({ search }));
  // }, [dispatch, search]);

  const onRefresh = useCallback(() => {
    setParams(prev => ({...prev, page: 1}));
    dispatch(refreshingAction(params));
  }, [dispatch, search]);
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );
  const loadMore = useCallback(() => {
    if (hasMore && !isGetting) {
      const newPage = params.page + 1;
      setParams(prevParams => ({
        ...prevParams,
        page: newPage,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }));
      dispatch(
        gettingMoreAction({
          ...params,
          page: newPage,
          period: moment(selectedDate).format('YYYY-MM-DD'),
        }),
      );
    }
  }, [hasMore, isGetting, params]);
  const handleSearch = debounceHandler((text: string) => {
    setParams({
      ...params,
      search: text,
      period: moment(selectedDate).format('YYYY-MM-DD'),
    });
    dispatch(
      searchingAction({
        ...params,
        search: text,
        period: moment(selectedDate).format('YYYY-MM-DD'),
      }),
    );
  });
  const [selectedOption, setSelectedOption] = useState<string>('Select');
  const handleSelect = (value: string) => {
    setSelectedOption(value);
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    console.log('Item', item);
    const onPress = () => {
      navigation.navigate(screens.addFrequentVisits as never, {
        index,
        residentId: id,
        id: item?._id,
        edit: true,
        item: item,
      });
    };
    const mobileImageUrl = item?.images[0];
    return (
      <TouchableOpacity
        style={styles.mainContainer}
        activeOpacity={0.7}
        onPress={onPress}>
        <View style={globalStyles.flexRow}>
          <View>
            {mobileImageUrl ? (
              <ImagePreview
                source={{uri: mobileImageUrl}}
                styles={{width: rs(31), height: rs(31), borderRadius: 40}}
              />
            ) : (
              <IconCircle
                icon={<CameraIcon height={20} />}
                style={{height: 30, width: 30}}
              />
            )}
          </View>
          <View style={{...customPadding(2, 2, 2, 2)}}>
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.primary},
              ]}
              numberOfLines={1}>
              🤵
              {item?.name}
            </Text>
            <Text
              style={{
                ...typographies(colors).ralewayMedium10,
                color: colors.black,
              }}>
              {item?.visitType?.name}
            </Text>
          </View>
        </View>
        {item?.indicateDays && (
          <View style={styles.ActiveContainer}>
            <Text style={styles.ActiveText}>{trans('Active')}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={
          item?.street?.name
            ? `${item.street.name} ${item.home || ''}`
            : trans('Frequent Visits')
        }
        rightIcon={
          (userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN) && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          userInfo?.role === userRoles.ADMIN ||
          userInfo?.role === userRoles.SUPER_ADMIN
            ? navigation.navigate(screens.addFrequentVisits as never, {
                residentId: id,
              })
            : undefined
        }
      />
      <FlatList
        data={list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={params?.search} 
              onChangeText={handleSearch}
              style={{...customMargin(0, 20, 20, 20)}}
            />
            <SelectMonth
              style={{...customMargin(8, 20, 4, 22)}}
              defaultValue={new Date() || params?.period}
              showYearOnly={false}
              onPress={period => {
                
                setSelectedDate(period);
                setParams({
                  ...params,
                  period: moment(period).format('YYYY'),
                });
                dispatch(
                  searchingAction({
                    ...params,
                    period: moment(period).format('YYYY'),
                  }),
                );
              }}
            />
          </View>
        }
        contentContainerStyle={
          list?.length > 0
            ? {
                ...customPadding(17, 0, 20, 0),
                gap: rs(10),
              }
            : [globalStyles.emptyFlexBox, {...customPadding(17, 0, 20, 0)}]
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no visits found!')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
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
        onEndReached={hasMore ? loadMore : undefined}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tertiary,
  },
  radioGroup: {
    flexDirection: 'row',
    backgroundColor: colors.tertiary,
    paddingHorizontal: 20,
  },
  optionContainer: {
    ...globalStyles.flexRow,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  selectedOptionContainer: {
    backgroundColor: colors.tertiary,
  },
  radioCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    ...typographies(colors).ralewayMedium10,
  },
  image: {
    width: rs(31),
    height: rs(31),
    borderWidth: 1,
    borderRadius: 40,
    borderColor: colors.white,
  },
  mainContainer: {
    ...globalStyles.flexRow,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5,
    ...customPadding(8, 16, 8, 16),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ActiveContainer: {
    backgroundColor: colors.brightGreen,
    ...customPadding(6, 30, 6, 30),
    borderRadius: 40,
  },
  ActiveText: {
    ...typographies(colors).ralewayBold12,
    color: colors.white,
  },
});
export default FrequentVisitList;
