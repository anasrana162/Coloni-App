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
import {
  calculateCash,
  showAlertWithTwoActions,
} from '../../../utilities/helper';
import {momentTimezone} from '../../../packages/momentTimezone.package';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {userRoles} from '../../../assets/ts/core.data';
import monthChargesService from '../../../services/features/monthCharges/monthCharges.service';
import {useTranslation} from 'react-i18next';
import {customUseDispatch} from '../../../packages/redux.package';
import {deleteAction} from '../../../state/features/monthCharges/monthCharges.slice';
import DeleteIcon from '../../../assets/icons/Delete.icon.asset';
import moment from 'moment';
interface props {
  item: any;
  index: number;
  userInfo: any;
  status: string;
}
const MonthChargeItem: React.FC<props> = ({index, item, userInfo, status}) => {
  const {colors} = useTheme() as any;
  const styles = billItemStyles(colors);
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await monthChargesService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Month Charge'),
      body: trans('Are you want to delete this charge?'),
      onPressAction: confirm,
    });
  };
  const {
    paymentType,
    note,
    amount,
    paymentDate,
    resident,
    date,
    createdAt,
    home,
  } = item || {};

  
  const onPress = () => {
    if (
      userInfo?.role === userRoles.ADMIN ||
      userInfo?.role === userRoles.SUPER_ADMIN
    ) {
      const normalizedStatus = item.status.toLowerCase().trim();
      if (
        normalizedStatus === 'earning' ||
        normalizedStatus === 'to be approved'
      ) {

        navigation.navigate(screens.approvePaymentIncome as never, {
          index,
          item: item,
          status: item.status,
        });
      } else {
        navigation.navigate(screens.rejectPaymentIncome as never, {
          index,
          item: item,
          status: item.status,
        });
      }
    }
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
            {resident?.street?.name} {resident.home}
          </Text>
          <Text
            style={[typographies(colors).ralewayMedium12, {fontSize: 10}]}
            numberOfLines={1}>
            {resident?.name}
          </Text>
          {paymentType?.name && (
            <Text style={typographies(colors).ralewayBold12} numberOfLines={1}>
              {paymentType?.name}
            </Text>
          )}
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
            ]}
            numberOfLines={1}>
            {note}
          </Text>
          <View style={styles.dateContainer}>
            <CalenderIcon height={10} width={10} />
            <Text
              style={[
                typographies(colors).montserratNormal8,
                {color: colors.black},
              ]}>
              {moment(createdAt).format('MM/DD/YYYY')}
            </Text>
          </View>
          <Text
            style={[
              typographies(colors).montserratNormal8,
              {color: colors.primary},
            ]}>
            {moment(createdAt).format('MMMM')}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end', gap: 10}}>
          <Text
            style={typographies(colors).montserratMedium10}>{`${calculateCash(
            amount,
          )} >`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MonthChargeItem;

export const billItemStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      ...customPadding(12, 18, 8, 14),
      backgroundColor: colors.graySoft,
      alignItems: 'center',
      borderRadius: 25,
      gap: 19,
      marginTop: 10,
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
