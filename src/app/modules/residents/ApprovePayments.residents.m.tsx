import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
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
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  formatDate,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';

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
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {deleteAction} from '../../state/features/payments/payments.slice';
import ApproveBottomSheet from '../bills/bottomSheet/Approve.bottomSheet';
import PartialPaymentBottomSheet from '../bills/bottomSheet/PartialPayment.bottomSheet';
import BalanceInFavorBottomSheet from '../bills/bottomSheet/BalanceInFavor.bottomSheet';
import {approvePaymentStyles as styles} from '../bills/styles/approvePayment.styles';
import moment from 'moment';
import monthChargesService from '../../services/features/monthCharges/monthCharges.service';
import {config} from '../../../Config';
import {screens} from '../../routes/routeName.route';
import LogComp from '../../components/app/LogComp';
import {userStates} from '../../state/allSelector.state';
import {registrationExpensesStyles as styles1} from '../bills/styles/registrationExpenses.styles';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const {width} = Dimensions.get('screen');
const UploadImage = ({
  onChange,
  defaultValue,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
}) => {
  const [images, setImages] = useState<any>(defaultValue || []);
  const [key, setKey] = useState<number>(0);
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const {userInfo} = customUseSelector(userStates);

  useEffect(() => {
    setKey(key + 1);
  }, [defaultValue]);

  const createImageLinksData = async (image: any) => {
    const uploadFile = async (value: any) => {
      try {
        setImages((prevImages: any) => {
          const updatedArray = [...prevImages, value];
          console.log('Updated Images Array:', updatedArray);

          // Collect URLs for mobileFileUrl after updating state
          const mobileImageUrl = updatedArray.map(file => file.fileUrl);
          console.log('Mobile File URLs:', mobileImageUrl);

          onChange && onChange(mobileImageUrl, 'images');
          return updatedArray;
        });
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    };
    const newFile = image;
    let fileName = '';
    let fileContent: any = null; // Placeholder for file content
    let contentType = ''; // Placeholder for content type
    let ext = newFile?.mime;
    let ext2 = newFile?.type;

    if (ext) {
      fileName = newFile?.path?.split('/').pop(); // Use .pop() to get the last segment
      fileContent = await fetch(newFile.path).then(res => res.blob());
      contentType = ext; // Use MIME type as content type
    } else if (ext2) {
      fileName = newFile?.name;
      fileContent = await fetch(newFile.path).then(res => res.blob());
      contentType = ext2; // Use MIME type as content type
    }

    try {
      const fetchImageLink = await s3Service.uploadFileToS3(
        'coloni-app',
        fileName,
        fileContent,
        contentType,
      );
      console.log('Link image', fetchImageLink);

      const payload = {
        fileName,
        fileUrl: fetchImageLink?.Location,
        fileSize: newFile?.size,
        fileType: contentType,
        fileKey: fetchImageLink?.Key,
        show: newFile.path,
      };
      uploadFile(payload);
    } catch (error) {
      console.error('Error uploading file:', error);
      showMessage({message: trans('Upload failed')});
      throw error; // Ensure the error is thrown to handle it outside
    }
  };
  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length >= 2) {
        showMessage({message: trans('Maximum 2 files')});
        return;
      }
      const validate = imageValidation(image, trans);
      if (validate) {
        console.log('IS array images:', image);
        if (Array.isArray(image)) {
          for (let i = 0; i < image.length; i++) {
            console.log('LOOP: ', i);
            await createImageLinksData(image[i]);
          }
        } else {
          createImageLinksData(image);
        }
      }
    } else {
      const updateArray = [...images];
      updateArray.splice(index, 1);
      onChange && onChange(updateArray, 'images');
      setImages(updateArray);
    }
  };
  console.log('Images Image upload', images);
  return (
    <View key={key} style={{width: width - 40}}>
      <View
        style={[styles1.uploadContainer, {marginTop: 20, marginBottom: 10}]}>
        <View style={styles1.center}>
          <IconCircle
            icon={<CameraIcon />}
            onPress={() => {
              if (config.role == 'Resident') {
                global.showBottomSheet({
                  flag: true,
                  component: ImagePickerBottomSheet,
                  componentProps: {success, multiple: true},
                });
              }
            }}
          />
        </View>
        {!isEmpty(images) && (
          <View style={{flexDirection: 'row', right: 20, width: '70%'}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    position: `${'relative'}`,
                    alignSelf: `${'flex-start'}`,
                    marginTop: 10,
                    marginHorizontal: 10,
                  }}>
                  <Image
                    source={{uri: !item?.show ? item : item?.show}}
                    style={{height: rs(55), width: rs(55)}}
                  />
                  {config.role == 'Resident' && (
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
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const ApprovePaymentResident: React.FC<{
  route: {
    params: {index: number; item: any; status: string; ResidentName: string};
  };
}> = ({
  route: {
    params: {item, index, status, ResidentName},
  },
}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  // const [loading, setLoading] = useState(true);
  const [loadings, setLoading] = useState(false);

  const [showLog, setShowLog] = useState(false);
  const [logData, setLogData] = useState(null);
  const navigation = useCustomNavigation();
  const data = useRef<any>({});
  const dispatch = customUseDispatch();
  const modifiedData = useRef<any>({});

  useLayoutEffect(() => {
    console.log('PaymentData Approve:', item);
    data.current = item;
    setLoading(false);
    modifiedData.current = {
      data: [
        {type: trans('Type'), value: item?.paymentType?.name},
        {
          type: trans('Payment Date'),
          value: moment(item?.paymentDate).format('DD/MM/YYYY'),
        },
        {
          type: trans('Due Date'),
          value: moment(item?.expireDate).format('DD/MM/YYYY'),
        },
      ],
      amount: item?.amount,
      header: item?.status,
    };
  }, [item?._id]);

  const onDecline = async () => {
    try {
      let result = await monthChargesService.delete(item?._id);
      var {body, status} = result;
      if (status) {
        navigation.navigate(screens.chargesResident as never);
      } else {
        Alert.alert(trans('Error'), trans('Something went wrong!'));
      }
    } catch (error) {
      console.log('Delete Income Error', error);
      Alert.alert(trans('Error'), trans('Something went wrong!'));
    }
  };

  const onLogPress = async () => {
    try {
      let result = await monthChargesService.changeLog(item?._id);
      var {body, status} = result;
      if (status) {
        // navigation.navigate(screens.income as never);
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

  const handlePartial = async (amount: number, date: string) => {
    let payload = {
      amount: amount,
      date: date,
      note: data?.current.note,
      residentId: item?.resident?._id,
      income: item?._id,
    };

    try {
      let result = await monthChargesService.partial(payload);
      var {success, message} = result;
      if (success) {
        Alert.alert(trans('Success'), message);
      } else {
        Alert.alert(trans('Error'), message);
      }
    } catch (error) {
      console.log('Partial Resident Error', error);
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

    try {
      let result = await monthChargesService.balanceInFavor(payload);
      var {success, message} = result;
      if (success) {
        Alert.alert(trans('Success'), message);
      } else {
        Alert.alert(trans('Error'), message);
      }
    } catch (error) {
      console.log('BalanceInFavor Resident Error', error);
      Alert.alert(trans('Error'), trans('Something went wrong!'));
    }
  };

  const notifyResident = async () => {
    try {
      let result = await monthChargesService.notify(item?._id);
      var {success, message} = result;
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

  const handleChange = (value: any, name?: any) => {
    data.current = {...data.current, [name]: value};
    console.log('handleChange', data.current);
  };

  const handleUpdate = async () => {
    setLoading(true);

    var obj = {
      imported: data?.current.imported || 'imported',
      noteRevision: data?.current?.noteRevision || 'noteRevision',
      perDay: data?.current?.perDay || 'perDay',
      amount: data?.current?.amount,
      images: data?.current?.images || [],
    };
    console.log('Obj:', obj);
    try {
      let result = await monthChargesService.update(obj, item?._id);
      var {success, message} = result;
      if (success) {
        Alert.alert(trans('Success'), message);
      } else {
        Alert.alert(trans('Error'), message);
      }
    } catch (error) {
      console.log('Update Error', error);
      Alert.alert(trans('Error'), trans('Something went wrong!'));
    }
    setLoading(false);
  };

  // return
  return (
    <>
      {loadings && <LoadingComp />}
      <Container statusBarBg={colors.white}>
        <Header
          text={ResidentName}
          showBg={false}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={() => handleUpdate()}
        />
        {loadings ? (
          <EmptyContent forLoading={loadings} />
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
            <Text
              style={[typographies(colors).montserratNormal12, styles.date]}>
              {trans('Fee')} {momentTimezone().format('MMM YYYYY')}
            </Text>
            <View style={{marginTop: rs(11), gap: rs(16)}}>
              <OnlyTextInput
                placeholder={trans('Imported')}
                defaultValue={data?.current?.imported}
                onChangeText={handleChange}
                name={'imported'}
              />
              <OnlyTextInput
                placeholder={trans('Note Revision')}
                defaultValue={data?.current?.noteRevision}
                onChangeText={handleChange}
                name={'noteRevision'}
              />
              <OnlyTextInput
                placeholder={trans('Pay Day')}
                defaultValue={data?.current?.perDay}
                onChangeText={handleChange}
                name={'perDay'}
              />
            </View>
            <UploadImage
              defaultValue={data?.current?.images}
              onChange={handleChange}
            />

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
                      body: trans('Change the payment status to approved?'),
                      onPress: async () => {
                        navigation.goBack();
                        global.showBottomSheet({flag: false});
                        let obj = {
                          monthChargesId: data?.current?._id,
                          status: 'Approved',
                        };
                        await monthChargesService.updateCharges(obj);
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
                onPress={() =>
                  navigation.navigate(screens.addUpdateIncome as never, {item})
                }
              />
              <Badge
                text={trans('Partial')}
                bgColor={colors.secondary}
                onPress={() =>
                  global.showBottomSheet({
                    flag: true,
                    component: PartialPaymentBottomSheet,
                    componentProps: {
                      data: {
                        amount: data?.current?.amount,
                        updatedAt: data?.current?.updatedAt,
                        note: data?.current?.note,
                      },
                      onConfirm: (amount: number, date: string) =>
                        handlePartial(amount, date),
                    },
                  })
                }
                style={{borderRadius: rs(10), ...globalStyles.flexGrow1}}
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
                style={{borderRadius: rs(10), ...globalStyles.flexGrow1}}
              />
            </View>
            <View style={{marginTop: rs(13), gap: rs(8)}}>
              <Button text={trans('Log')} onPress={() => onLogPress()} />
              <Button text={trans('Decline')} onPress={() => onDecline()} />
              <Button
                text={trans('Balance in Favor')}
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
              />
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
      </Container>
    </>
  );
};

export default ApprovePaymentResident;
