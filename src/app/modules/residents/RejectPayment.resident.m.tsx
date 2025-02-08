import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import Container from '../../layouts/Container.layout';
import AmountCard from '../../components/app/AmountCard.app';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import OnlyTextInput from '../../components/core/text-input/OnlyTextInput.core';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import Badge from '../../components/app/Badge.app';
import Button from '../../components/core/button/Button.core';
import { approvePaymentStyles as styles } from '../bills/styles/approvePayment.styles';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  formatDate,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import paymentService from '../../services/features/payment/payment.service';
import { apiResponse } from '../../services/features/api.interface';
import { useCustomNavigation } from '../../packages/navigation.package';
import { showMessage } from 'react-native-flash-message';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { momentTimezone } from '../../packages/momentTimezone.package';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import { imageValidation } from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { customUseDispatch } from '../../packages/redux.package';
import { deleteAction } from '../../state/features/payments/payments.slice';
import ApproveBottomSheet from '../bills/bottomSheet/Approve.bottomSheet';
import BalanceInFavorBottomSheet from '../bills/bottomSheet/BalanceInFavor.bottomSheet';
import moment from 'moment';
import monthChargesService from '../../services/features/monthCharges/monthCharges.service';
import { config } from '../../../Config';
import { screens } from '../../routes/routeName.route';
import LogComp from '../../components/app/LogComp';
import VoucherComp from '../../components/app/VoucherComp';
const UploadImage = ({
  onChange,
  defaultValue,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue?: any;
}) => {
  const [images, setImages] = useState<any>(defaultValue || []);
  const { colors } = useTheme() as any;
  const { t: trans } = useTranslation();
  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length >= 2) {
        showMessage({ message: trans('Maximum 2 files') });
        return;
      }
      const validate = imageValidation(image, trans);
      if (validate) {
        const uploadFile = (value: any) => {
          const updateArray = [...images, value];
          onChange && onChange(updateArray, 'files');
          setImages(updateArray);
        };
        s3Service.handleImageUpload(image, uploadFile);
      }
    } else {
      const updateArray = [...images];
      updateArray.splice(index, 1);
      onChange && onChange(updateArray, 'files');
      setImages(updateArray);
    }
  };
  return (
    <View style={{ marginTop: rs(25) }}>
      <View style={[globalStyles.rowBetween, { alignItems: 'center' }]}>
        {!isEmpty(images) ? (
          <View
            style={{ flexDirection: 'row', gap: rs(10), position: 'relative' }}>
            {images.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  position: `${'relative'}`,
                  alignSelf: `${'flex-start'}`,
                  marginTop: rs(15),
                }}>
                <ImagePreview
                  source={{ uri: item?.show }}
                  styles={{ height: rs(49), width: rs(49) }}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => success('', index)}
                  style={{
                    position: `${'absolute'}`,
                    right: rs(-5),
                    top: rs(-5),
                  }}>
                  <CancelIcon
                    fill={colors.error1}
                    height={rs(16)}
                    width={rs(16)}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <ImagePreview source={imageLink.demoImage} />
            <ImagePreview source={imageLink.demoImage} />
            <ImagePreview source={imageLink.demoImage} />
          </View>
        )}
      </View>
    </View>
  );
};


const RejectPaymentResident: React.FC<{
  route: { params: { index: number; item: any; status: string; ResidentName: string } };
}> = ({
  route: {
    params: { item, index, status, ResidentName },
  },
}) => {
    const { colors } = useTheme() as any;
    const { t: trans } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [showLog, setShowLog] = useState(false); 
    const [logData, setLogData] = useState(null); 
    const [showVoucher, setShowVoucher] = useState(false); 
    const navigation = useCustomNavigation();
    const data = useRef<any>({});
    const modifiedData = useRef<any>({});

    useLayoutEffect(() => {
      if (item?._id) {
        (async () => {
          setLoading(true);
          const result = await monthChargesService.details(item._id);
          const { status, body, message } = result as apiResponse;
          console.log('item?', result);

          if (status) {
            data.current = body;
            modifiedData.current = {
              data: [
                { type: trans('Type'), value: body?.paymentType?.name },
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
              header: trans('Approved'),
            };
          } else {
            // navigation.goBack();
            showMessage({ message });
          }
          setLoading(false);
        })();
      }
    }, [item?._id]);

    
    const onLogPress = async () => {
      try {
        let result = await monthChargesService.changeLog(item?._id);
        var { body, status } = result;
        if (status) {
          console.log('Log Incone Success:', body);
          setLogData(body[0]);
          setTimeout(() => {
            setShowLog(true);
          }, 1000);
        } else {
          Alert.alert(trans('Error'), trans('Something went wrong!'));
        }
      } catch (error) {
        console.log('log Income Error', error);
        Alert.alert(trans('Error'), trans('Something went wrong!'));
      }
    };

    
    const handleBalanceInFavor = async (
      amount: number,
      date: string,
      isFavor: boolean,
    ) => {
      let payload = {
        residentId: item?.resident?._id,
        amount: amount,
        isFavor: isFavor,
        date: date,
      };
      // let checkValues = checkEmptyValues(payload);

      try {
        let result = await monthChargesService.balanceInFavor(payload);
        var { success, message } = result;
        if (success) {
          Alert.alert(trans('Success'), message);
        } else {
          Alert.alert(trans('Error'), message);
        }
      } catch (error) {
        console.log('BalanceInFavor Income Error', error);
        Alert.alert(trans('Error'), trans('Something went wrong!'));
      }
    };

    

    const notifyResident = async () => {
      try {
        let result = await monthChargesService.notify(item?._id);
        var { success, message } = result;
        //   console.log('Result', result);
        if (success) {
          Alert.alert(trans('Success'), message);
          navigation.goBack();
        } else {
          Alert.alert(trans('Error'), message);
        }
      } catch (error) {
        console.log('Notify Resident Error', error);
        Alert.alert(trans('Error'), trans('Something went wrong!'));
      }

    };

    return (
      <Container statusBarBg={colors.white}>
        <Header text={ResidentName} showBg={false} />
        {loading ? (
          <EmptyContent forLoading={loading} />
        ) : (
          <ScrollView
            contentContainerStyle={{ ...customPadding(30, 25, 40, 25) }}
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
            <View style={{ marginTop: rs(11), gap: rs(16) }}>
              <View style={styles.row}>
                <Text style={styles.blueText}>{trans('Review Note')}</Text>
                <Text style={styles.lightText}>{data?.current?.note}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.blueText}>{trans('Approved By')}</Text>
                <Text style={styles.lightText}>
                  {data?.current?.resident?.clue}-
                  {moment(data?.current?.updatedAt).format('DD/MM/YYYY')}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.blueText}>{trans('Transaction / Approval')}</Text>
                <Text numberOfLines={1} style={[styles.lightText, { width: "45%" }]}>{data?.current?.transactionNumber}-{data?.current?.approveNumber}</Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 10,
              }}>
              <View>
                <ScrollView horizontal>
                  {data?.current?.images.length > 0 &&
                    data?.current?.images.map((image: any, index: number) => {
                      return (
                        <View
                          style={{
                            width: 70,
                            height: 70,
                            marginHorizontal: 10,
                            borderRadius: 20,
                            overflow: 'hidden',
                          }}>
                          <Image
                            source={{ uri: image }}
                            resizeMode="cover"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </View>
                      );
                    })}
                </ScrollView>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <Badge
                text={trans('Disapprove')}
                bgColor={colors.secondary}
                onPress={() =>
                  global.showBottomSheet({
                    flag: true,
                    component: ApproveBottomSheet,
                    componentProps: {
                      title: trans('Paid'),
                      body: trans('Change the payment status to Disapproved?'),
                      onPress: async () => {
                        
                        global.showBottomSheet({ flag: false });
                        let obj = {
                          incomeId: data?.current?._id,
                          status: 'To Be Approved',
                        };
                        console.log('Obj', obj);
                        let result = await monthChargesService.updateCharges(obj);
                        console.log('Approve Api RejectPayment', result);
                        navigation.goBack();
                      },
                    },
                  })
                }
                style={{ borderRadius: rs(10), ...globalStyles.flexGrow1 }}
              />
              <Badge
                text={trans('Edit')}
                bgColor={colors.secondary}
                style={{ borderRadius: rs(10), ...globalStyles.flexGrow1 }}
                onPress={
                  () => { }
                  // navigation.navigate(screens.addUpdateIncome as never, {item})
                }
              />
              <Badge
                text={trans('Balance in Favor')}
                bgColor={colors.secondary}
                onPress={() =>
                  global.showBottomSheet({
                    flag: true,
                    component: BalanceInFavorBottomSheet,
                    
                    componentProps: {
                      data: {
                        amount: data?.current?.amount,
                        updatedAt: data?.current?.updatedAt,
                      },
                      onConfirm: (
                        amount: number,
                        date: string,
                        isFavor: boolean,
                      ) => handleBalanceInFavor(amount, date, isFavor),
                    },
                  })
                }
                style={{ borderRadius: rs(10), ...globalStyles.flexGrow1 }}
              />

              <Badge
                text={trans('Notify')}
                bgColor={colors.secondary}
                onPress={() =>
                  global.showBottomSheet({
                    flag: true,
                    component: ApproveBottomSheet,
                    componentProps: {
                      title: trans('Notify'),
                      body: trans('Are you want to notify of this charge?'),
                      onPress: () => notifyResident(),
                    },
                  })
                }
                style={{ borderRadius: rs(10), ...globalStyles.flexGrow1 }}
              />
            </View>
            <View style={{ marginTop: rs(13), gap: rs(8) }}>
              <Button text={trans('Log')} onPress={() => onLogPress()} />
              <Button text={trans('Voucher')} onPress={() => setShowVoucher(true)} />
            </View>
          </ScrollView>
        )}
        {showLog && (
          <LogComp
            onDismiss={() => setShowLog(false)}
            titleHeader={'Change Log'}
            data={logData}
          />
        )}
        {showVoucher && <VoucherComp
          titleHeader={trans('Your payment has been confirmed')}
          data={data.current}
          onDismiss={() => { setShowVoucher(false) }}
        />}
      </Container>
    );
  };

export default RejectPaymentResident;
