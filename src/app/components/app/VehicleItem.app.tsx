import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import {
  globalStyles,
  shadow,
  customMargin,
  customPadding,
} from '../../assets/global-styles/global.style.asset';
import { useTheme } from '@react-navigation/native';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import ImagePreview from '../core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import { customUseSelector } from '../../packages/redux.package';
import { userStates } from '../../state/allSelector.state';
import { userRoles } from '../../assets/ts/core.data';
import { colors } from '../../assets/global-styles/color.assets';
interface props {
  item: any;
  index?: number;
  onDelete?: any;
}
const VehicleItem: React.FC<props> = ({ item, index, onDelete }) => {
  
  const { userInfo } = customUseSelector(userStates);
  const {
    registrationPlate,
    carBrand,
    carModel,
    tag,
    color,
    _id,
    images,
    resident,
  } = item || {};
  console.log('Item', item);
  const navigation = useCustomNavigation<any>();
  const onPress = () => {
    navigation.navigate(screens.addUpdateVehicles as never, {
      id: _id,
      index,
      edit: true,
    });
  };
  const isValidUri = (uri: string) =>
    (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        globalStyles.flexRow,
        shadow(colors).shadow,
        {
          ...customMargin(17, 20, 0, 20),
          ...customPadding(13, 14, 13, 20),
          borderRadius: rs(20),
          backgroundColor: colors.graySoft,
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
              ? { uri: images[0] }
              : imageLink.placeholder
          }
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View
        style={[
          globalStyles.rowBetween,
          globalStyles.flexShrink1,
          { width: `${'100%'}` },
        ]}>
        <View style={[globalStyles.flexShrink1, { gap: rs(5) }]}>
          <Text
            style={[
              typographies(colors).ralewaySemibold12,
              { color: colors.primary },
            ]}>
            {carModel}
          </Text>
          {userInfo?.role === userRoles.RESIDENT ? null : <Text
            style={[
              typographies(colors).ralewaySemibold12,
              { color: colors.primary },
            ]}>
            {resident?.street?.name + ' ' + resident?.home}
          </Text>}
          <Text
            style={[
              typographies(colors).ralewaySemibold12,
              { color: colors.gray3 },
            ]}>
            {carBrand}
          </Text>
          {userInfo?.role === userRoles.RESIDENT ? null : <Text
            style={[
              typographies(colors).ralewaySemibold12,
              { color: colors.gray3 },
            ]}>
            {tag}
          </Text>}
          <View
            style={{
              height: rs(15),
              width: rs(15),
              borderRadius: rs(50),
              backgroundColor: color?.toLowerCase() || colors.black,
              borderWidth:1
            }}
          />
        </View>
        <View style={{ transform: [{ rotate: '-90deg' }], marginRight: 5 }}>
          <DownArrow />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VehicleItem;
