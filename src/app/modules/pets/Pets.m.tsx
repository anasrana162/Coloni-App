/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customMargin,
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import PetItem from './components/PetItem';
import CancelIcon from '../../assets/images/svg/cancelIconStroke.svg';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import usePets from './hooks/usePets.m';
import {searchingAction} from '../../state/features/pets/pet.slice';
import {config} from '../../../Config';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {userRoles} from '../../assets/ts/core.data';
import Pagination from '../../components/core/Pagination.core.component';
import SelectMonth from '../../components/app/SelectMonth.app';
import moment from 'moment';
import {customUseDispatch} from '../../packages/redux.package';
declare global {
  var showImageView: (image: any) => void;
}
const ImageView = () => {
  const [image, setImage] = useState<any>('');
  global.showImageView = (value: any) => {
    setImage(value);
  };
  const {colors} = useTheme() as any;
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 1,
        top: '15%',
        width: '95%',
        alignSelf: 'center',
        borderRadius: rs(20),
        display: image ? 'flex' : 'none',
      }}>
      <ImagePreview
        source={Number(image) ? image : {uri: image}}
        styles={{
          width: '100%',
          height: rs(407),
          borderRadius: rs(20),
        }}
        resizeMode={'covers'}
        borderRadius={rs(20)}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setImage('')}
        style={[
          shadow(colors).shadow,
          {
            position: 'absolute',
            right: 15,
            top: 15,
            backgroundColor: colors.pureWhite,
            height: rs(32),
            width: rs(32),
            borderRadius: rs(500),
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <CancelIcon />
      </TouchableOpacity>
    </View>
  );
};
const Pets = () => {
  const navigation = useCustomNavigation();
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const {
    handleSearch,
    isLoading,
    list,
    onNextPage,
    onPrevPage,
    params,
    onRefresh,
    refreshing,
    search,
    total,
    userInfo,
    totalPages,
  } = usePets();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    dispatch(searchingAction({period: moment(newDate).format('YYYY'), search}));
  };
  const renderItem = ({item, index}: {item: any; index: number}) => {
    return <PetItem item={item} index={index} userInfo={userInfo} />;
  };
  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header
        text={trans('Pets')}
        rightIcon={
          userInfo?.role !== userRoles.VIGILANT &&
          userInfo?.role !== userRoles.ADMIN && (
            <ImagePreview source={imageLink.addIcon} />
          )
        }
        rightControl={() =>
          navigation.navigate(screens.addPets as never, {
            disabledEditing: true,
          })
        }
      />
      <ImageView />
      <FlatList
        data={list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: colors.white,
              width: '90%',
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: colors.gray5,
              }}>
              <SearchInput onChangeText={handleSearch} defaultValue={search} />
              <View
                style={{
                  ...globalStyles.flexRow,
                  justifyContent: 'space-between',
                }}>
                {userInfo?.role === userRoles.VIGILANT && (
                  <View>
                    <SelectMonth
                      style={{...customMargin(10)}}
                      onPress={handleMonthChange}
                      showYearOnly={true}
                      defaultValue={new Date() || selectedDate}
                    />
                  </View>
                )}
                {userInfo?.role === userRoles.ADMIN && (
                  <View>
                    <SelectMonth
                      style={{...customMargin(10)}}
                      onPress={handleMonthChange}
                      showYearOnly={true}
                      defaultValue={new Date() || selectedDate}
                    />
                  </View>
                )}
                <Text
                  style={[
                    typographies(colors).ralewaySemibold12,
                    {
                      marginVertical: 10,
                      color: colors.primary,
                      fontSize: 14,
                      fontWeight: '600',
                    },
                  ]}>
                  {trans('Total: {{x}}', {x: total})}
                </Text>
              </View>
            </View>
          </View>
        }
        contentContainerStyle={
          list?.length > 0
            ? {...customPadding(0, 0, 20, 0)}
            : [globalStyles.emptyFlexBox, {...customPadding(0, 0, 20, 0)}]
        }
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There is no data to display')}
            forLoading={isLoading}
          />
        }
        renderItem={memoizedValue}
        ListFooterComponent={
          <>
            {!isLoading && totalPages > 1 && (
              <Pagination
                PageNo={params?.page}
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

export default Pets;
