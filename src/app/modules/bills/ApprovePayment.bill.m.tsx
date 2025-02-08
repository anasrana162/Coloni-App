import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import AmountCard from '../../components/app/AmountCard.app';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import OnlyTextInput from '../../components/core/text-input/OnlyTextInput.core';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import Badge from '../../components/app/Badge.app';
import Button from '../../components/core/button/Button.core';
import {approvePaymentStyles as styles} from './styles/approvePayment.styles';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  formatDate,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import BalanceInFavorBottomSheet from './bottomSheet/BalanceInFavor.bottomSheet';
import PartialPaymentBottomSheet from './bottomSheet/PartialPayment.bottomSheet';
import ApproveBottomSheet from './bottomSheet/Approve.bottomSheet';
import paymentService from '../../services/features/payment/payment.service';
import {apiResponse} from '../../services/features/api.interface';
import {useCustomNavigation} from '../../packages/navigation.package';
import {showMessage} from 'react-native-flash-message';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {momentTimezone} from '../../packages/momentTimezone.package';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {customUseDispatch} from '../../packages/redux.package';
import {deleteAction} from '../../state/features/payments/payments.slice';

const ApprovePayment: React.FC<{
  route: {params: {index: number; item: any; status: string}};
}> = ({
  route: {
    params: {item, index, status},
  },
}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const [loading, setLoading] = useState(true);
  const navigation = useCustomNavigation();
  const data = useRef<any>({});
  const dispatch = customUseDispatch();
  const modifiedData = useRef<any>({});

  useLayoutEffect(() => {
    if (item?._id) {
      (async () => {
        setLoading(true);
        const result = await paymentService.details(item._id);
        const {status, body, message} = result as apiResponse;
        if (status) {
          data.current = body;
          modifiedData.current = {
            data: [
              {type: trans('Type'), value: body?.paymentType?.name},
              {
                type: trans('Payment Date'),
                value: formatDate(body?.paymentDate, 'dd/mm/yyyy'),
              },
              {
                type: trans('Due Date'),
                value: formatDate(body?.dueDate, 'dd/mm/yyyy'),
              },
            ],
            amount: body?.amount,
            header: trans('Pending'),
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setLoading(false);
      })();
    }
  }, [item?._id]);

  return (
    <Container statusBarBg={colors.white}>
      <Header text={item?.resident?.name} showBg={false} />
      {loading ? (
        <EmptyContent forLoading={loading} />
      ) : (
        <ScrollView
          contentContainerStyle={{...customPadding(30, 25, 40, 25)}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <AmountCard
            amount={modifiedData.current.amount}
            data={modifiedData.current.data}
            header={modifiedData.current.header}
          />
          <Text style={[typographies(colors).montserratNormal12, styles.date]}>
            {trans('Fee')} {momentTimezone().format('MMM YYYYY')}
          </Text>
          <View style={{marginTop: rs(11), gap: rs(16)}}>
            <OnlyTextInput placeholder={trans('Imported')} />
            <OnlyTextInput placeholder={trans('Note Revision')} />
            <OnlyTextInput placeholder={trans('Pay Day')} />
          </View>
          <View style={styles.bottomContainer}>
            <Badge
              text={trans('Approve')}
              bgColor={colors.secondary}
              onPress={() =>
                global.showBottomSheet({
                  flag: true,
                  component: ApproveBottomSheet,
                  componentProps: {
                    title: trans('Paid'),
                    body: trans('Change the payment status to pending?'),
                    onPress: () => {
                      navigation.goBack();
                      global.showBottomSheet({flag: false});
                      paymentService.approvePayment(item?._id);
                      dispatch(deleteAction({id: item?._id, index}));
                    },
                  },
                })
              }
              style={{borderRadius: rs(10), ...globalStyles.flexGrow1}}
            />
            <Badge
              text={trans('Edit')}
              bgColor={colors.secondary}
              style={{borderRadius: rs(10), ...globalStyles.flexGrow1}}
            />
            <Badge
              text={trans('Partial')}
              bgColor={colors.secondary}
              onPress={() =>
                global.showBottomSheet({
                  flag: true,
                  component: PartialPaymentBottomSheet,
                })
              }
              style={{borderRadius: rs(10), ...globalStyles.flexGrow1}}
            />
          </View>
          <View style={{marginTop: rs(13), gap: rs(8)}}>
            <Button text={trans('Log')} />
            <Button
              text={trans('Decline')}
              onPress={() => {
                showAlertWithOneAction({
                  body: trans(
                    'Administrator, write a valid note of the reason for rejection',
                  ),
                });
              }}
            />
            <Button
              text={trans('Balance in Favor')}
              onPress={() =>
                global.showBottomSheet({
                  flag: true,
                  component: BalanceInFavorBottomSheet,
                })
              }
            />
          </View>
        </ScrollView>
      )}
    </Container>
  );
};

export default ApprovePayment;
