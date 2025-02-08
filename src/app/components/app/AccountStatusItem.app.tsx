import {View, Text, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import DownArrowIcon from '../../assets/images/svg/downArrow.svg';
import {useTheme} from '@react-navigation/native';
import accountStatusService from '../../services/features/accountStatus/accountStatus.service';
import {
  calculateCash,
  formatDate,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {useTranslation} from 'react-i18next';
import {deleteAction} from '../../state/features/accountStatus/accountStatus.slice';
import {customUseDispatch} from '../../packages/redux.package';
import {userRoles} from '../../assets/ts/core.data';
import DeleteIcon from '../../assets/icons/Delete.icon.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {config} from '../../../Config';
const AccountStatusItem: React.FC<{
  item: any;
  index: number;
  userInfo: any;
  style?: ViewStyle;
}> = ({item, index, userInfo, style}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch<any>();
  const navigation = useCustomNavigation<any>();
  const calculateProfitLoss = (item: any) => {
    const profitLoss = item?.finalBalance - item?.initialBalance;
    return profitLoss;
  };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await accountStatusService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this account status?'),
      onPressAction: confirm,
    });
  };
  const profitLoss = calculateProfitLoss(item);
  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate(screens.detailsAccountStatus as never, {
          item: item,
          id: item?.id,
          index,
        })
      }
      style={[
        globalStyles.flexRow,
        shadow(colors).shadow,
        {
          ...customPadding(20, 12, 11, 20),
          backgroundColor: colors.graySoft,
          borderRadius: rs(25),
          gap: rs(18),
          marginBottom: rs(15),
        },
        style,
      ]}>
      <View style={[globalStyles.rowBetween, globalStyles.flexGrow1]}>
        <View style={{width: 'auto'}}>
          <Text
            style={[
              typographies(colors).ralewayBold15,
              {color: colors.primary},
            ]}>
            {trans('Global')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {color: colors.gray12, lineHeight: rs(20)},
            ]}>
            {formatDate(item?.period, 'MMMM YYYY')}
          </Text>
          {isAdmin && (
            <Text
              style={[
                typographies(colors).montserratNormal8,
                {color: colors.gray3, lineHeight: rs(17)},
              ]}>
              {trans('Initial')}: {Math.round(item?.initialBalance)}
            </Text>
          )}

          {isAdmin ? (
            <Text
              style={[
                typographies(colors).montserratNormal12,
                {color: colors.light, lineHeight: rs(17)},
              ]}>
              ${Math.round(item?.totalIncome)}
            </Text>
          ) : (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
                marginTop: 5,
              }}>
              <Text
                style={[
                  typographies(colors).montserratNormal12,
                  {color: colors.white, lineHeight: rs(17)},
                ]}>
                ${Math.round(item?.totalIncome)}
              </Text>
            </View>
          )}
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text
            style={[
              typographies(colors).montserratNormal8,
              {color: colors.gray3, lineHeight: rs(17)},
            ]}>
            {trans('Final Price')}
          </Text>
          <View style={[globalStyles.flexRow, {gap: rs(7)}]}>
            <Text
              style={[
                typographies(colors).montserratMedium10,
                {color: colors.primary},
              ]}>
              $ {Math.round(item?.finalBalance)}
            </Text>
            <View style={{transform: [{rotate: '-90deg'}]}}>
              <DownArrowIcon />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AccountStatusItem;
