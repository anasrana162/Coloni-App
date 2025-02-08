import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import SearchInput from '../../components/app/SearchInput.app';
import {screens} from '../../routes/routeName.route';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {maintenanceStates, userStates} from '../../state/allSelector.state';
import {useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/maintenance/maintenance.slice';
import maintenanceService from '../../services/features/maintenance/maintenance.service';
import {showAlertWithTwoActions} from '../../utilities/helper';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {userRoles} from '../../assets/ts/core.data';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import Pagination from '../../components/core/Pagination.core.component';
import {useIsFocused} from '@react-navigation/native';
import SelectMonth from '../../components/app/SelectMonth.app';
import moment from 'moment';
const Maintenance = () => {
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
  } = customUseSelector(maintenanceStates);
  const isFocused = useIsFocused();
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const [period, setPeriod] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const onRefresh = () => {
    dispatch(searchingAction({search: ''}));
    dispatch(refreshingAction({page, perPage, period}));
  };
  const handleSearch = (text: string) => {
    dispatch(searchingAction({search: text, page, perPage, period}));
  };
  useEffect(() => {
    // if (!isGetting) {
    if (isFocused) {
      dispatch(searchingAction({search: ''}));

      dispatch(isGettingAction({page: 1, perPage: 12, period}));
    }
    // }
  }, [isFocused]);
  const onNextPage = () => {
    if (page >= totalPages) {
      return;
    }
    dispatch(
      gettingMoreAction({
        page: page + 1,
        perPage: 12,
        period,
      }),
    );
  };
  const onPrevPage = () => {
    if (page <= 1) {
      return;
    }
    dispatch(
      gettingMoreAction({
        page: page - 1,
        perPage: 12,
        period,
      }),
    );
  };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await maintenanceService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this maintenance?'),
      onPressAction: confirm,
    });
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {name, description, maintenanceFrequency, _id, images, note} =
      item || {};
    const isValidUri = (uri: string) =>
      (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screens.UpdateMaintenance, {
            index,
            id: _id,
            edit: true,
          })
        }
        style={[
          {
            width: '95%',
            flexDirection: 'row',
            height: 70,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: colors.graySoft,
            borderRadius: rs(10),
            marginTop: 10,
            gap: rs(10),
          },
        ]}>
        <View
          style={{
            width: rs(50),
            height: rs(50),
            borderRadius: rs(50),
            borderWidth: rs(2),
            borderColor: colors.white,
            backgroundColor: colors.primary,
            marginLeft: 10,
            overflow: 'hidden',
          }}>
          <Image
            source={
              isValidUri(images[0] == undefined ? '' : images[0])
                ? {uri: images[0]}
                : imageLink.placeholder
            }
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {color: colors.grayDark},
            ]}>
            {name}
          </Text>
          <Text
            style={[typographies(colors).ralewayBold12, {color: colors.gray9}]}>
            {description}
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            position: 'absolute',
            right: 15,
            paddingLeft: 10,
          }}
          // onPress={() =>
          //   navigation.navigate(screens.addUpdateMaintenance, {
          //     index,
          //     id: _id,
          //     edit: true,
          //   })
          // }>
        >
          <Text
            style={[
              typographies(colors).ralewaySemibold20,
              {
                color: colors.gray9,
                fontSize: 16,
                marginLeft: 20,
              },
            ]}>
            {'>'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Maintenance')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addUpdateMaintenance as never)
        }
      />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.white}}>
            <SearchInput
              defaultValue={search}
              onChangeText={handleSearch}
              style={{marginBottom: rs(10)}}
            />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <SelectMonth
                style={{}}
                defaultValue={new Date(period)}
                showYearOnly={false}
                onPress={period => {
                  setPeriod(moment(period).format('YYYY-MM-DD'));
                  dispatch(
                    searchingAction({
                      period: moment(period).format('YYYY-MM-DD'),
                      page,
                      perPage,
                    }),
                  );
                }}
              />
              <Text
                style={{
                  ...typographies(colors).ralewayBold12,
                  fontSize: 14,
                  color: colors?.primary,
                }}>{`${'Total'}: ${total}`}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There is no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
        ListFooterComponent={
          <>
            {!isLoading && totalPages > 1 && (
              <Pagination
                PageNo={page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};

export default Maintenance;
