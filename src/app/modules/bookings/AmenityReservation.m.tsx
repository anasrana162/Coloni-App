import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ImageBackgroundBase,
  ScrollView,
  Alert
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { useTranslation } from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import { bookingsStates } from '../../state/allSelector.state';
import { showAlertWithTwoActions } from '../../utilities/helper';
import bookingService from '../../services/features/booking/booking.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { deleteAction, isGettingAction, searchingAction } from '../../state/features/booking/booking.slice';
import useAmenities from '../amenities/hooks/useAmenities.hook';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { colors } from '../../assets/global-styles/color.assets';
import { shadow } from '../../assets/global-styles/global.style.asset';
import DownArrow from '../..//assets/images/svg/downArrow.svg';
import { ImageBackground } from 'react-native';
import { residents } from '../../state/features/user/user.slice';
import userService from '../../services/features/users/user.service';
import { apiResponse } from '../../services/features/api.interface';
import { userRoles } from '../../assets/ts/core.data';
const AmenityReservation = () => {
  const {
    isLoading,
    list,
    loadMore,
    hasMore,
    onRefresh,
    refreshing,
    userInfo,
    colors,
    navigation,
  } = useAmenities();
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [amenityID, setAmenityID] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [residentsList, setResidentsList] = useState([]);
  const {t: trans} = useTranslation();

  const handleSelectAmenity = (item: any) => {
    setSelectedAmenity(item?.amenityName);
    setDropdownOpen(false);
    setAmenityID(item?._id);
  };
  const dispatch = customUseDispatch();


  useEffect(() => {
    if (!isLoading) {
      dispatch(isGettingAction());
    }
  }, [isLoading]);
  const getDataHandler = async () => {
    var params = {
      page: 1,
      perPage: 10,
      search: "",
      asset: true,
      isAdmin: "",
    }
    const result = await userService.ResidentScreen(params);
    const { body, status } = result as apiResponse;
    console.log("Rsult", body?.list)
    if (status) {
      // dispatch(residents(body))
      setResidentsList(body?.list)
    };
  }
  useEffect(() => {
    if (userInfo?.role !== userRoles.VIGILANT && userInfo?.role !== userRoles.RESIDENT) {

      getDataHandler()
    }
  }, [])

  
  const renderItem: any = ({ item, index }: { item: any; index: number }) => {
    if (userInfo?.role !== userRoles.VIGILANT && userInfo?.role !== userRoles.RESIDENT) {

      return (
        <TouchableOpacity style={styles.btnContainer}
          onPress={() => {
            if (amenityID) {
              navigation.navigate(screens.ReservationDate, {
                index,
                id: amenityID,
                item: item,
              });
            } else {
              Alert.alert(trans('Select an Amenity'), trans('Please select an amenity first.'));
            }
          }}>
          <View style={{ ...customMargin(2, 2, 2, 10) }}>
            <Text style={styles.nameText}>{item?.street?.name}{" " + item?.home}</Text>

          </View>
        </TouchableOpacity>
      );
    }
  };

  const memoizedRenderItem = useMemo(() => renderItem, []);

  return (
    <Container>
      <Header text={trans('Amenity Reservations')} />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        data={residentsList}
        renderItem={renderItem}
        keyboardDismissMode="on-drag"
        keyExtractor={(item: any) => item?._id.toString()}
        ListHeaderComponent={
          <View style={{ backgroundColor: colors.white }}>
            {userInfo?.role !== userRoles.VIGILANT && userInfo?.role !== userRoles.RESIDENT && <View style={customPadding(0, 20, 10, 20)}>
              <SearchInput />
            </View>}
            <View style={styles.topContainer}>
              <TouchableOpacity onPress={() => setDropdownOpen(!isDropdownOpen)}>
                <View style={styles.amenityText}>
                  <Text style={styles.topText}>
                    {selectedAmenity ? selectedAmenity : trans('Select Amenity')}
                  </Text>
                  <DownArrow fill={colors.tertiary} style={{ ...customMargin(2, 0, 0, 0) }} />
                </View>
              </TouchableOpacity>
            </View>
            {isDropdownOpen && (
              <View style={styles.dropdownContainer}>
                <ScrollView nestedScrollEnabled style={styles.scrollContainer}>
                  {list.map((item) => (
                    <TouchableOpacity
                      key={item?._id}
                      onPress={() => {
                        if (userInfo?.role !== userRoles.VIGILANT && userInfo?.role !== userRoles.RESIDENT) {

                          handleSelectAmenity(item);
                        }
                        else {
                          navigation.navigate(screens.ReservationDate, {
                            index: "",
                            id: item?._id,
                            // item:""
                          })
                        }
                      }
                      }
                      style={styles.btnContainer}
                    >
                      <View style={{ ...customMargin(2, 2, 2, 10) }}>
                        <Text style={styles.nameText}>{item?.amenityName}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {(userInfo?.role !== userRoles.VIGILANT && userInfo?.role !== userRoles.RESIDENT) && <View style={styles.container} >
              <Text style={styles.textContainer}>{trans('Select a resident')}</Text>
            </View>}

          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There is no data!')}
            forLoading={isLoading}
          />
        }
        contentContainerStyle={{ ...customPadding(20, 0, 10, 0), gap: rs(5) }}
        ListFooterComponent={
          hasMore ? (
            <View style={[{ height: rs(40) }, globalStyles.activityCenter]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : undefined
        }
        onEndReachedThreshold={0.25}
        onEndReached={loadMore}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  dropdownContainer: {
    //position: 'absolute',
    // backgroundColor: colors.white,
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#B0C4DE',
    // ...customMargin(0, 10, 10, 20),
    // width: 106,
    // elevation: 2,
    // zIndex: 1,
    // top: 50, 
  },
  scrollContainer: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    color: colors.tertiary,
  },
  nameText: {
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
  },
  btnContainer: {
    ...customPadding(6, 6, 6, 20),
    ...shadow(colors).bottomBorder,
  },
  topContainer: {
    ...customPadding(6, 6, 6, 20),
    backgroundColor: colors.tertiary,
  },
  topText: {
    ...typographies(colors).ralewayMedium10,
    color: colors.tertiary,
    ...customPadding(2, 0, 2, 6),
  },
  amenityText: {
    ...globalStyles.flexRow,
    height: 20,
    width: 106,
    backgroundColor: colors.white,
    borderRadius: 5,
    gap: 4,

  },
  container: {
    height: 24,
    width: 135,
    borderRadius: 10,
    backgroundColor: colors.tertiary,
    ...globalStyles.justifyAlignCenter,
    ...customMargin(10, 2, 4, 6)
  },
  textContainer: {
    ...typographies(colors).ralewayMedium12,
    color: colors.white,

  }
});
export default AmenityReservation;

