import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Container from '../../../layouts/Container.layout';
import Header from '../../../components/core/header/Header.core';
import ImagePreview from '../../../components/core/ImagePreview.core.component';
import imageLink from '../../../assets/images/imageLink';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {screens} from '../../../routes/routeName.route';
import EmptyContent from '../../../components/core/EmptyContent.core.component';
import {Trans, useTranslation} from 'react-i18next';
import Badge from '../../../components/app/Badge.app';
import SelectMonth from '../../../components/app/SelectMonth.app';
import eventualVisitsVisitlogsService from '../../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import frequentVisitService from '../../../services/features/frequentVisit/frequentVisit.service';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../../assets/global-styles/color.assets';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import IconCircle from '../../../components/app/IconCircle.app';
import CameraIcon from '../../../assets/icons/Camera.icon';
import moment from 'moment';
import {useTheme} from '@react-navigation/native';
import {customUseSelector} from '../../../packages/redux.package';
import {themeStates} from '../../../state/allSelector.state';

const VisitHomeScreenVig: React.FC<{
  route: {params?: {index: number; id: string; item: any}};
}> = ({
  route: {params: {index, id, item} = {edit: false, index: -1, id: ''}},
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('frequent');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [Result, setResult] = useState('');
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    resident: id,
    page: 1,
    perPage: 10,
    search: '',
    period: moment(new Date()).format('YYYY-MM-DD'),
  });
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const {theme} = customUseSelector(themeStates);

  const getDataHandler = useCallback(async () => {
    setLoading(true);
    try {
      setRefreshing(true);
      const result =
        selectedTab === 'eventual'
          ? await eventualVisitsVisitlogsService.list(params)
          : await frequentVisitService.list(params);

      setResult(result?.body?.results || result?.data?.totalCount);
      console.log('checking result.......', result);
      if (selectedTab === 'eventual') {
        setList(result?.data?.list || []);
        setTotalPages(result?.data?.totalPages || 1);
      } else {
        setList(result?.body?.list || []);
        setTotalPages(result?.body?.totalPages || 1);
      }
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }, [params, selectedTab]);

  useEffect(() => {
    getDataHandler();
  }, [params, selectedTab]);

  const {t: trans} = useTranslation();

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    setParams(prevParams => ({
      ...prevParams,
      period: moment(newDate).format('YYYY-MM-DD'),
      page: 1,
    }));
  };
  useEffect(() => {
    setTotal(Result === undefined ? 0 : Result);
  }, [list]);
  const onRefresh = async () => {
    setRefreshing(true);
    setParams(prevParams => ({...prevParams, page: 1}));
    await getDataHandler();
    setRefreshing(false);
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const onPress = () => {
      navigation.navigate(screens.AddVisitsHomeScreenVig as never, {
        index,
        residentId: id,
        id: item?._id,
        edit: true,
        item: item,
        screenName: selectedTab,
      });
    };

    const mobileImageUrl = item?.images[0];

    return (
      <TouchableOpacity
        style={styles.mainContainer}
        activeOpacity={0.7}
        onPress={onPress}>
        <View style={[globalStyles.flexRow]}>
          <View>
            {mobileImageUrl ? (
              <ImagePreview
                source={{uri: mobileImageUrl}}
                styles={{
                  width: rs(31),
                  height: rs(31),
                  borderRadius: 40,
                  borderColor: colors.primary,
                  borderWidth: 1,
                }}
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
              {item?.name || item?.visitorName}
            </Text>
            <Text
              style={{
                ...typographies(colors).ralewayMedium10,
                color: '#000',
              }}>
              {item?.visitType?.name || item?.note}
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
        text={
          item?.street?.name
            ? `${item.street.name} ${item.home || ''}`
            : trans('Visits')
        }
        heading={trans('Visits')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.AddUpdateEventVig as never, {
            item: item,
            screenName: selectedTab,
          })
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
          <View>
            <View style={{...customPadding(10, 10, 10, 10)}}>
              <View style={[globalStyles.flexRow]}>
                <Badge
                  text={trans('Frequent')}
                  style={{width: '49%'}}
                  bgColor={
                    selectedTab === 'frequent'
                      ? colors.tertiary
                      : theme == 'dark'
                      ? 'lightgrey'
                      : colors.gray5
                  }
                  textColor={
                    selectedTab === 'frequent' ? colors.white : colors.gray7
                  }
                  onPress={() => {
                    setSelectedTab('frequent');
                    setParams(prev => ({
                      ...prev,
                      page: 1,
                      visitType: 'frequent',
                    }));
                  }}
                />
                <Badge
                  text={trans('Eventual Visits')}
                  style={{width: '49%'}}
                  bgColor={
                    selectedTab === 'eventual'
                      ? colors.tertiary
                      : theme == 'dark'
                      ? 'lightgrey'
                      : colors.gray5
                  }
                  textColor={
                    selectedTab === 'eventual' ? colors.white : colors.gray7
                  }
                  onPress={() => {
                    setSelectedTab('eventual');
                    setParams(prev => ({
                      ...prev,
                      page: 1,
                      visitType: 'eventual',
                    }));
                  }}
                />
              </View>
            </View>
            <View
              style={{
                ...globalStyles.flexRow,
                justifyContent: 'space-between',
              }}>
              {selectedTab == 'eventual' && (
                <SelectMonth
                  style={{...customMargin(10, 5, 0, 10)}}
                  defaultValue={selectedDate}
                  onPress={handleMonthChange}
                />
              )}
              <Text
                style={{
                  ...typographies(colors).ralewayBold15,
                  color: colors?.primaryText,
                  flex: selectedTab == 'frequent' ? 1 : 0,
                  textAlign: 'right',
                }}>
                {trans('Total')}: {total}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyContent text={trans('There are no data!')} />}
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(10)}}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.gray5,
    backgroundColor: colors.gray,
    borderRadius: 20,
  },
});

export default VisitHomeScreenVig;
