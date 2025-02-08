import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {screens} from '../../../routes/routeName.route';
import ImagePreview from '../../../components/core/ImagePreview.core.component';
import imageLink from '../../../assets/images/imageLink';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../../assets/global-styles/global.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import CalenderIcon from '../../../assets/icons/Calender.icon';
import {calculateCash} from '../../../utilities/helper';
import {momentTimezone} from '../../../packages/momentTimezone.package';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {userRoles} from '../../../assets/ts/core.data';
import {useTranslation} from 'react-i18next';

interface props {
  item: any;
  index: number;
  userInfo: any;
  status: string;
}
const PaymentItem: React.FC<props> = ({index, item, userInfo, status}) => {
  const {colors} = useTheme() as any;
  const styles = billItemStyles(colors);
  const navigation = useCustomNavigation<any>();
  
  const {paymentType, resident, amount, expireDate, images, createdAt} =
    item || {};
  const onPress = () => {
    if (
      userInfo?.role === userRoles.ADMIN ||
      userInfo?.role === userRoles.SUPER_ADMIN
    ) {
      if (status == 'To Be Approved') {
        navigation.navigate(screens.approvePaymentIncome as never, {
          index,
          item: item,
          status,
        });
      } else {
        navigation.navigate(screens.rejectPaymentIncome as never, {
          index,
          item: item,
          status,
        });
      }
    }
  };
  const {t: trans} = useTranslation();

  const isValidUri = (uri: string) =>
    (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={styles.imageContainer}>
        <ImagePreview
          source={
            isValidUri(images[0]) ? {uri: images[0]} : imageLink.placeholder
          }
          borderRadius={40}
          styles={styles.image}
        />
      </View>
      <View style={styles.middleContainer}>
        <View style={globalStyles.flexShrink1}>
          <Text style={typographies(colors).ralewayBold12} numberOfLines={1}>
            {resident?.street?.name} {resident?.home}
          </Text>
          {paymentType?.name && (
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                globalStyles.flexShrink1,
              ]}
              numberOfLines={1}>
              {paymentType?.name}
            </Text>
          )}
          <View style={styles.dateContainer}>
            <CalenderIcon height={10} width={10} />
            <Text style={typographies(colors).montserratNormal8}>
              {momentTimezone(createdAt).format('YYYY/MM/DD')}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={typographies(colors).montserratMedium10}>
            {item.note}
          </Text>
          {item?.status == 'Approved' && (
            <Text style={typographies(colors).montserratMedium10}>
              {trans('Paid:')} {momentTimezone(item?.paymentDate).format('YYYY/MM/DD')}
            </Text>
          )}
        </View>
        <Text style={typographies(colors).montserratMedium10}>{`${calculateCash(
          amount,
        )} >`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PaymentItem;

export const billItemStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      ...customPadding(12, 18, 8, 14),
      backgroundColor: colors.graySoft,
      alignItems: 'center',
      borderRadius: 25,
      gap: 19,
    },
    imageContainer: {
      width: rs(40),
      height: rs(40),
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
