import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import ImagePreview from '../../../components/core/ImagePreview.core.component';
import SearchIcon from '../../../assets/images/svg/searchIcon.svg';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {screens} from '../../../routes/routeName.route';
import {userRoles} from '../../../assets/ts/core.data';
import {customUseSelector} from '../../../packages/redux.package';
import {userStates} from '../../../state/allSelector.state';
import imageLink from '../../../assets/images/imageLink';
import {useTranslation} from 'react-i18next';
import {formatDate} from '../../../utilities/helper';
import moment from 'moment';
const PetItem: React.FC<{item: any; index: number}> = ({item, index}) => {
  const {colors} = useTheme() as any;
  const {name, petType, breed, sex, color, images, _id, resident} = item;
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
  const {userInfo} = customUseSelector(userStates);

  const isValidUri = (uri: string) =>
    (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));

  if (userInfo?.role === userRoles?.RESIDENT) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate(screens.addPets as never, {
            edit: true,
            id: _id,
            index,
            item,
            disabledEditing: true,
          });
        }}
        style={[
          globalStyles.rowBetween,
          styles.container,
          {
            width: '90%',
            alignSelf: 'center',
            paddingBottom: 10,
            borderBottomColor: colors.gray5,
            alignItems: 'center',
            gap: 40,
          },
        ]}>
        {images[0] && (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 40,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                images.length > 0 && images[0]
                  ? isValidUri(images[0])
                    ? {uri: images[0]}
                    : {uri: 'https://coloniapp.com/assets/extra/pets.png'}
                  : {uri: 'https://coloniapp.com/assets/extra/pets.png'}
              }
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 20,
              }}
            />
          </View>
        )}
        <View style={{width: '80%'}}>
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {color: colors.black},
            ]}>
            {name}
          </Text>
          <Text
            style={[typographies(colors).ralewayBold12, {color: colors.gray3}]}>
            {petType}
            {petType && ' | '}
            {sex}
            {sex && ' | '}
            {breed}
          </Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (
            userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN ||
            userInfo?.role === userRoles.VIGILANT
          ) {
          } else {
            navigation.navigate(screens.addPets as never, {
              edit: true,
              id: _id,
              index,
              item,
              disabledEditing:
                !(
                  userInfo?.role === userRoles.ADMIN ||
                  userInfo?.role === userRoles.SUPER_ADMIN ||
                  userInfo?.role === userRoles.VIGILANT
                ) && userInfo?._id == item?.resident?._id
                  ? false
                  : true,
            });
          }
        }}
        style={[
          globalStyles.rowBetween,
          styles.container,
          {
            width: '95%',
            alignSelf: 'center',
            borderBottomColor: colors.gray5,
            borderRadius: 20,
            backgroundColor: colors.white,
            overflow: 'hidden',
            alignItems: 'center',
          },
        ]}>
        <View style={[globalStyles.flexShrink1, {marginTop: 5}]}>
          <Text
            numberOfLines={1}
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary},
            ]}>
            {resident?.street?.name} {resident?.home}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {color: colors.black},
            ]}>
            {name}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayBold10,
              {color: colors.gray3, marginTop: rs(2)},
            ]}>
            {petType}
            {petType && ' | '}
            {sex}
            {sex && ' | '}
            {breed}
          </Text>
          {userInfo?.role === userRoles.VIGILANT && (
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray3, marginTop: rs(5)},
              ]}>
              {item?.lostDescription}
            </Text>
          )}
          <Text
            style={[
              typographies(colors).ralewayBold10,
              {color: colors.gray3, marginTop: rs(2)},
            ]}>
            {moment(item?.lostDate).format('YYYY-MM-DD')}
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}>
            {userInfo?.role !== userRoles.ADMIN && (
              <Text
                onPress={() => {
                  if (
                    userInfo?.role === userRoles.ADMIN ||
                    userInfo?.role === userRoles.SUPER_ADMIN ||
                    userInfo?.role === userRoles.VIGILANT
                  ) {
                    navigation.navigate(screens.addPets as never, {
                      edit: true,
                      id: _id,
                      index,
                      item,
                      disabledEditing: false,
                    });
                  } else {
                    navigation.navigate(screens.addPets as never, {
                      edit: true,
                      id: _id,
                      index,
                      item,
                      disabledEditing:
                        !(
                          userInfo?.role === userRoles.ADMIN ||
                          userInfo?.role === userRoles.SUPER_ADMIN ||
                          userInfo?.role === userRoles.VIGILANT
                        ) && userInfo?._id == item?.resident?._id
                          ? false
                          : true,
                    });
                  }
                }}
                style={[
                  typographies(colors).ralewayBold12,
                  {color: colors.primary},
                ]}>
                {trans('View')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {images && (
          <View>
            <Image
              source={
                images.length > 0 && images[0]
                  ? isValidUri(images[0])
                    ? {uri: images[0]}
                    : {uri: 'https://coloniapp.com/assets/extra/pets.png'}
                  : {uri: 'https://coloniapp.com/assets/extra/pets.png'}
              }
              style={{
                width: rs(172),
                height: rs(102),
                borderRadius: 20,
                resizeMode: 'cover',
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                global.showImageView(
                  isValidUri(images[0] == undefined ? '' : images[0])
                    ? images[0]
                    : imageLink.placeholder,
                )
              }
              style={[
                styles.search,
                {backgroundColor: colors.gray5, right: 15, top: 15},
              ]}>
              <SearchIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }
};

export default PetItem;

const styles = StyleSheet.create({
  container: {
    ...customPadding(10, 20, 15, 20),
    alignItems: 'flex-start',
    borderBottomWidth: rs(1),
  },
  search: {
    height: rs(14),
    width: rs(14),
    borderRadius: rs(500),
    alignItems: 'center',
    justifyContent: 'center',
    top: 6,
    right: 9,
    position: 'absolute',
  },
});
