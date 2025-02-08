import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

import imageLink from '../../assets/images/imageLink';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import {momentTimezone} from '../../packages/momentTimezone.package';
import {calculateCash} from '../../utilities/helper';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import ImagePreview from '../../components/core/ImagePreview.core.component';

interface props {
  item: any;
  index: number;
}


const ChargesItem: React.FC<props> = ({index, item}) => {
  const {colors} = useTheme() as any;
  const styles = chargesItemStyle(colors);
  const navigation = useCustomNavigation<any>();
  const {amount, date, note, paymentType, resident, status} = item || {};
  const onPress = () => {
    const normalizedStatus = status.toLowerCase().trim();

    const screenName =
      normalizedStatus === 'earning' || normalizedStatus === 'to be approved'
        ? screens.approvePaymentResident
        : screens.rejectPaymentResident;

    navigation.navigate(screenName as never, {
      edit: true,
      index,
      item: item,
    });
  };
  const isValidUri = (uri: string) =>
    (uri && uri.startsWith('http')) || uri.startsWith('file');
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={styles.imageContainer}>
        <ImagePreview
          source={
            isValidUri(item?.images[0] ? item?.images[0] : 'nothing')
              ? {uri: item?.images[0]}
              : imageLink.demoImage
          }
          borderRadius={40}
          styles={styles.image}
        />
      </View>
      <View style={styles.middleContainer}>
        <View style={globalStyles.flexShrink1}>
          <Text style={typographies(colors).ralewayBold12} numberOfLines={1}>
            {resident?.name}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              {color: colors.primary},
            ]}
            numberOfLines={1}>
            {paymentType?.name}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
            ]}
            numberOfLines={1}>
            {note}
          </Text>
          <View style={styles.dateContainer}>
            <CalenderIcon height={6} width={6} />
            <Text style={typographies(colors).montserratNormal8}>
              {momentTimezone(date).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
        <Text style={typographies(colors).montserratMedium10}>{`${calculateCash(
          amount,
        )} >`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChargesItem;

export const chargesItemStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      //   ...customPadding(12, 18, 8, 14),
      padding: 10,
      backgroundColor: colors.graySoft,
      alignItems: 'center',
      borderRadius: 25,
      gap: 19,
      marginBottom: 15,
    },
    imageContainer: {
      width: rs(38),
      height: rs(38),
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadow(colors).shadow,
    },
    image: {
      width: rs(31),
      height: rs(31),
      borderWidth: 1,
      borderRadius: 40,
      borderColor: colors.white,
    },
    middleContainer: {
      flexDirection: 'row',
      flexShrink: 1,
      gap: 20,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateContainer: {
      flexDirection: 'row',
      flexShrink: 1,
      gap: 4,
      alignItems: 'center',
    },
  });
