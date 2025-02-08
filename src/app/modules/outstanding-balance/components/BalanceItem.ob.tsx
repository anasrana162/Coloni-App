import {View, Text} from 'react-native';
import React from 'react';
import {globalStyles} from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import ImagePreview from '../../../components/core/ImagePreview.core.component';
import imageLink from '../../../assets/images/imageLink';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {calculateCash} from '../../../utilities/helper';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {screens} from '../../../routes/routeName.route';
import {colors} from '../../../assets/global-styles/color.assets';
import {useTranslation} from 'react-i18next';

const BalanceItem: React.FC<{
  item: any;
  index: number;
  blockingFlow?: boolean;
  setBlockingFlow?: any;
}> = ({item, index, blockingFlow, setBlockingFlow}) => {
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
  console.log('Item BalanceItem', item);
  let {
    home,
    resident,
    pendingCharges,
    pendingExpire,
    totalPendingExpireAmount,
    resident_id,
    street,
  } = item;
  return (
    <View
      style={[
        globalStyles.rowBetween,
        {
          borderTopWidth: rs(1),
          borderTopColor: colors.gray3,
          paddingVertical: rs(10),
          paddingRight: rs(15),
        },
      ]}>
      <TouchableOpacity
        onPress={() => {
          if (blockingFlow) {
            setBlockingFlow(false);
            navigation.navigate(screens.blockingOfDefaulters as never, {item});
          } else {
            navigation.navigate(screens.outstandingBalanceCharges as never, {
              ResidentName: 'Outstanding Balance',
              resident_id,
            });
          }
          // navigation.navigate(screens.approvePayment, {item: any});
        }}>
        <View style={[globalStyles.flexRow, {gap: rs(10)}]}>
          <ImagePreview source={imageLink.housesIcon} />
          <View style={globalStyles.flexShrink1}>
            <Text
              numberOfLines={1}
              style={[
                typographies(colors).montserratNormal10,
                {
                  color: colors.primary,
                  textTransform: `${'uppercase'}`,
                },
              ]}>
              {street?.name} {home}
            </Text>
            <Text
              style={[
                typographies(colors).montserratNormal12,
                {
                  color: colors.primary,
                  textTransform: `${'uppercase'}`,
                  fontSize: 10,
                },
              ]}>
              {resident}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                typographies(colors).montserratNormal10,
                {color: colors.gray6},
              ]}>
              {trans('Pending Charges:')} {pendingCharges}
            </Text>
            <Text
              numberOfLines={1}
              style={typographies(colors).montserratNormal10}>
              {trans('Overdue Charges:')} {pendingExpire}
            </Text>
            <Text
              numberOfLines={1}
              style={typographies(colors).montserratNormal10}>
              {trans('Pending Installments:')} {pendingCharges}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          padding: 5,
          backgroundColor:
            totalPendingExpireAmount == 0 ? colors.brightGreen : colors.error1,
          borderRadius: 10,
        }}>
        <Text
          style={[
            typographies(colors).montserratNormal12,
            {
              color: colors.white,
              fontWeight: '700',
            },
          ]}>
          {calculateCash(totalPendingExpireAmount)}
        </Text>
      </View>
    </View>
  );
};

export default BalanceItem;
