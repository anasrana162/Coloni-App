import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

import EmptyContent from '../../components/core/EmptyContent.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {useTheme} from '@react-navigation/native';
import {colors} from '../../assets/global-styles/color.assets';
import {userResidentsStates, userStates} from '../../state/allSelector.state';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import userService from '../../services/features/users/user.service';
import {apiResponse} from '../../services/features/api.interface';
import {useTranslation} from 'react-i18next';
import {residents} from '../../state/features/user/user.slice';
import {
  gettingMoreAction,
  isGettingAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/frequentVisit/frequentVisit.slice';
import {useCustomNavigation} from '../../packages/navigation.package';
const ResidentIncident: React.FC = (props: any) => {
  const dispatch = customUseDispatch();
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
  } = customUseSelector(userResidentsStates);
  console.log('checking list', list);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState<any>();
  const {colors} = useTheme() as any;
  const getDataHandler = async () => {
    const result = await userService.Resident();
    const {body, status} = result as apiResponse;
    console.log('checking body......',body);
    setData(body?.list);
    // if (status) {
    //   dispatch(residents(body))
    // };
  };
  // const getDataHandler = async () => {
  //   const result = await userService.Resident();
  //   const { body, status } = result as apiResponse;

  //   if (status) {
  //     dispatch(residents(body))
  //   };
  // }
  const onRefresh = () => {
    dispatch(refreshingAction({search}));
  };

  // const handleSearch = (status: string) => {
  //   dispatch(searchingAction({ status }));
  // }
  const loadMore = () => {
    hasMore && dispatch(gettingMoreAction({page, perPage, search}));
  };
  useEffect(() => {
    getDataHandler();
  }, []);
  const handleSearch = (text:string) => {
    setLoading(true);
    dispatch(searchingAction({search: text}));

    if (text.trim() === '') {
      getDataHandler();
    } else {
      const filteredData = (Data || []).filter(
        (item:any) =>
          item.name?.toLowerCase().includes(text.toLowerCase()) ||
          item.street?.name?.toLowerCase().includes(text.toLowerCase()) ||
          item.home?.toLowerCase().includes(text.toLowerCase()),
      );
      setData(filteredData);
    }
    setLoading(false);
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    console.log("checking itmes",item)
    const onPress = () => {
      navigation.navigate(screens.addUpdateReportIncident as never, {
        index,
        id: item?._id,
        item: item,
        status: props?.route?.params?.status,
      });
    };
    return (
      <TouchableOpacity
        style={[
          globalStyles.rowBetween,
          {borderBottomWidth: 1, borderBottomColor: colors.gray5},
        ]}
        activeOpacity={0.7}
        onPress={onPress}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            {
              marginVertical: rs(4),
              color: colors.primary,
              ...customPadding(0, 20, 0, 26),
            },
          ]}
          numberOfLines={1}>
          {item?.street?.name}
          {' ' + item?.home}
        </Text>
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(() => renderItem, []);

  return (
    <Container>
      <Header text={trans('Create Incident')} />
      <FlatList
        data={Data}
        refreshing={refreshing}
        onRefresh={onRefresh}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              onChangeText={handleSearch}
              style={{marginHorizontal: rs(20)}}
            />
            <TouchableOpacity onPress={() => setShowList(true)}>
              <View style={styles.container}>
                <Text style={styles.textContainer}>
                  {trans('Select a resident')}
                </Text>
              </View>
            </TouchableOpacity>
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
        initialNumToRender={2}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no visits found!')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
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

const styles = StyleSheet.create({
  container: {
    height: 24,
    width: 135,
    borderRadius: 10,
    backgroundColor: colors.tertiary,
    ...globalStyles.justifyAlignCenter,
    ...customMargin(10, 10, 4, 20),
  },
  textContainer: {
    ...typographies(colors).ralewayMedium12,
    color: colors.white,
  },
});

export default ResidentIncident;
