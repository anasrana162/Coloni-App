import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import ShowDate from '../../components/app/ShowDate.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {saftyReportStates} from '../../state/allSelector.state';
import {useIsFocused, useNavigation, useTheme} from '@react-navigation/native';
import {
  refreshingAction,
  isGettingAction,
  gettingMoreAction,
  searchingAction,
  deleteAction,
} from '../../state/features/saftyReport/saftyReport.slice';
import {showAlertWithTwoActions} from '../../utilities/helper';
import saftyReportService from '../../services/features/saftyReport/saftyReport.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {userRoles} from '../../assets/ts/core.data';
import CalenderIcon from '../../assets/icons/Calender.icon';
import Badge from '../../components/app/Badge.app';
import LocationIcon from '../../assets/images/svg/locationIcon.svg';
import SMSIcon from '../../assets/images/svg/smsIcon.svg';
import {config} from '../../../Config';
import {colors} from '../../assets/global-styles/color.assets';
import FlameIcon from '../../assets/icons/Flame.icon';
import RobberIcon from '../../assets/icons/Robber.icon';
import MedicIcon from '../../assets/icons/Medic.icon';
import SirenIcon from '../../assets/icons/Siren.icon';
import EmergencyType from '../safety-alert/EmergencyType';
import {useCustomNavigation} from '../../packages/navigation.package';
import moment from 'moment';
import ClockIcon from '../../assets/icons/Clock.icon';
import Pagination from '../../components/core/Pagination.core.component';
const {width, height} = Dimensions.get('screen');

const SaftyReports = () => {
  const {t: trans} = useTranslation();
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
    results,
  } = customUseSelector(saftyReportStates);
  const [count, setCount] = useState(3);
  const navigation = useCustomNavigation();
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const isFocused = useIsFocused();
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
  });
  const dispatch = customUseDispatch();
  const {colors} = useTheme() as any;
  const onRefresh = () => {
    dispatch(refreshingAction(params));
  };
  // const handleSearch = (text: string) => {
  //   dispatch(searchingAction({search: text}));
  // };

  useEffect(() => {
    if (isFocused) {
      dispatch(isGettingAction(params));
    }
  }, [isFocused]);

  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await saftyReportService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this report?'),
      onPressAction: confirm,
    });
  };

  type EmergencyType = 'Fire' | 'Medical' | 'Robbery' | 'Other';
  interface DisplayEmergencyIconsProps {
    icon: EmergencyType;
  }

  const DisplayEmergencyIcons: React.FC<DisplayEmergencyIconsProps> = ({
    icon,
  }) => {
    console.log('icon', icon);
    switch (icon) {
      case 'Fire':
        return <FlameIcon width={10} height={10} />;
      case 'Medical':
        return <MedicIcon width={10} height={10} />;
      case 'Robbery':
        return <RobberIcon width={10} height={10} fill={colors.black} />;
      case 'Other':
        return <SirenIcon width={10} height={10} />;
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {
      emergencyType,
      _id,
      updatedAt,
      createdAt,
      reportedBy: {name, home, street},
    } = item || {};
    console.log('emergencyType', item);

    const date = new Date(createdAt);
    let hours = date.getHours();
    const minutes = date.getUTCMinutes();
    const isPM = hours >= 12;

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Converts 0 to 12 for midnight

    // Format minutes to ensure two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Output the result
    // const timeString = `${hours}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;
    const timeString = `${hours}:${formattedMinutes}`;
    console.log(timeString);
    // const seconds = date.getUTCSeconds();
    return (
      <View
        style={[
          globalStyles.rowBetween,
          {
            ...customPadding(7, 7, 12, 7),
            ...customMargin(0, 13, 0, 13),
            borderBottomWidth: rs(1),
            borderBottomColor: colors.gray5,
            alignItems: 'flex-start',
          },
        ]}>
        <View>
          <View style={globalStyles.flexRow}>
            <DisplayEmergencyIcons icon={emergencyType} />
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.primary},
              ]}>
              {street?.name} {home}
            </Text>
          </View>
          <View style={[globalStyles.flexRow, {marginTop: rs(4)}]}>
            <CalenderIcon height={12} width={12} />
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.gray3},
              ]}>
              {moment(createdAt).format('YYYY-MM-DD')}
            </Text>
          </View>
          <View style={[globalStyles.flexRow, {marginTop: rs(4)}]}>
            <ClockIcon height={12} width={12} />
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.gray3},
              ]}>
              {timeString}
            </Text>
          </View>
          <View style={[globalStyles.flexRow, {marginTop: rs(4)}]}>
            <SMSIcon height={12} width={12} />
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.gray3},
              ]}>
              {emergencyType}
            </Text>
          </View>
          <View style={[globalStyles.flexRow, {marginTop: rs(4)}]}>
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.gray3},
              ]}>
              ✏️ {item?.description}
            </Text>
          </View>
          <View style={[globalStyles.flexRow, {marginTop: rs(4)}]}>
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.gray3},
              ]}>
              📱 {item?.deviceId}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {config.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) && (
            <Badge
              text="Eliminate"
              onPress={() => handleDelete(index, _id)}
              style={{
                alignSelf: 'flex-start',
                borderRadius: rs(10),
                // marginLeft: rs(30),
                marginTop: rs(10),
                backgroundColor: colors.error1,
              }}
            />
          )}
        </View>
      </View>
    );
  };
  const memoizedValue = useMemo(() => renderItem, []);

  const onPressEmerBtn = async () => {
    if (count == 0) {
      if (!description) return Alert.alert('Please fill description');

      var payload: any = {
        emergencyType,
        description,
      };
      console.log('Payload', payload);
      var result = await saftyReportService.create(payload);
      console.log('Result:', result);
      Alert.alert(result?.message);
      navigation.goBack();
    } else {
      setCount(count - 1);
    }
  };

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
  // console.log('List: ', list);
  return (
    <Container>
      <Header text={trans('Safety Alert')} />
      <FlatList
        keyboardShouldPersistTaps="always"
        initialNumToRender={2}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        data={list}
        renderItem={memoizedValue}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: colors.white,
              paddingBottom: 4,
              borderBottomWidth: 1,
              borderBottomColor: colors.primary,
            }}>
            <View style={{...globalStyles.flexRow, justifyContent: 'flex-end'}}>
              <Text
                style={{
                  ...typographies(colors).ralewayBold15,
                  color: colors.primary,
                }}>
                {trans('Total: ')}
                {results ? results : 0}
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={() => {
          return (
            <>
              {!isLoading && totalPages > 1 && (
                <Pagination
                  PageNo={params.page}
                  onNext={() => onNext()}
                  onBack={() => onBack()}
                />
              )}
            </>
          );
        }}
        // onEndReachedThreshold={0.25}
        // onEndReached={hasMore && loadMore}
      />
    </Container>
  );
};

export default SaftyReports;

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    // height: height / 2,
    alignSelf: 'center',
  },
  notice: {
    ...typographies(colors).ralewayBold12,
    alignSelf: 'center',
    color: colors.black,
    marginTop: 20,
  },
  bigBtn: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.emergencyBtn,
    marginVertical: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigNumber: {
    ...typographies(colors).ralewayBold18,
    color: colors.black,
    fontSize: 68,
    marginTop: -20,
  },
});
