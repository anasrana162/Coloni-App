import {
  View,
  Text,
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
  shadow,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import OnlyTextInput from '../../components/core/text-input/OnlyTextInput.core';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import Badge from '../../components/app/Badge.app';
import Button from '../../components/core/button/Button.core';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
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
import {screens} from '../../routes/routeName.route';
import incomeService from '../../services/features/income/income.service';
import LogComp from '../../components/app/LogComp';
import {config} from '../../../Config';

import {userStates} from '../../state/allSelector.state';
import {registrationExpensesStyles as styles1} from '../bills/styles/registrationExpenses.styles';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {userRoles} from '../../assets/ts/core.data';
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

  useEffect(() => {
    setKey(key + 1);
  }, [defaultValue]);

  const createImageLinksData = async (image: any) => {
    const uploadFile = async (value: any) => {
      try {
        setImages((prevImages: any) => {
          const updatedArray = [...prevImages, value];

          onChange && onChange(updatedArray, 'images');
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
      uploadFile(fetchImageLink.Location);
    } catch (error) {
      console.error('Error uploading file:', error);
      showMessage({message: trans('Upload failed')});
      throw error; // Ensure the error is thrown to handle it outside
    }
  };
  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length >= 3) {
        showMessage({message: trans('Maximum 3 files')});
        return;
      }
      const validate = imageValidation(image, trans);
      if (validate) {
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
  const isValidUri = (uri: string) =>
    (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));
  return (
    <View key={key} style={{width: width - 40}}>
      <View style={[styles1.uploadContainer, {marginTop: 10}]}>
        <View style={styles1.center}>
          <IconCircle
            icon={<CameraIcon />}
            onPress={() =>
              global.showBottomSheet({
                flag: true,
                component: ImagePickerBottomSheet,
                componentProps: {success, multiple: true},
              })
            }
          />
        </View>
        {!isEmpty(images) && (
          <View style={{flexDirection: 'row', gap: rs(10), right: 20}}>
            {images.map((item: any, index: number) => {
              return (
                <View
                  key={index}
                  style={{
                    position: `${'relative'}`,
                    alignSelf: `${'flex-start'}`,
                    marginTop: rs(15),
                  }}>
                  <View
                    style={{
                      borderRadius: 20,
                      height: rs(55),
                      width: rs(55),
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={
                        isValidUri(item) ? {uri: item} : imageLink.placeholder
                      }
                      style={{height: '100%', width: '100%'}}
                    />
                  </View>

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
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

declare global {
  var showImageView: (image: any) => void;
}
const ImageView = () => {
  const [image, setImage] = useState<any>('');
  global.showImageView = (value: any) => {
    setImage(value);
  };
  const {colors} = useTheme() as any;
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 1,
        top: '15%',
        width: '90%',
        alignSelf: 'center',
        padding: 10,
        borderRadius: rs(20),
        backgroundColor: colors.gray2,
        display: image ? 'flex' : 'none',
      }}>
      <ImagePreview
        source={Number(image) ? image : {uri: image}}
        styles={{
          width: '100%',
          alignSelf: 'center',
          height: rs(407),
          borderRadius: rs(20),
        }}
        resizeMode={'contain'}
        borderRadius={rs(20)}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setImage('')}
        style={[
          shadow(colors).shadow,
          {
            position: 'absolute',
            right: 15,
            top: 15,
            backgroundColor: colors.pureWhite,
            height: rs(32),
            width: rs(32),
            borderRadius: rs(500),
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <CancelIcon />
      </TouchableOpacity>
    </View>
  );
};

const ApprovePaymentIncome: React.FC<{
  route: {params: {index: number; item: any; status: string}};
}> = ({
  route: {
    params: {item, index, status},
  },
}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState(true);
  const navigation = useCustomNavigation();
  const data = useRef<any>({});
  const [showLog, setShowLog] = useState(false);
  const [logData, setLogData] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const dispatch = customUseDispatch();
  const {userInfo} = customUseSelector(userStates);
  const modifiedData = useRef<any>({});

  const isValidUri = (uri: string) =>
    (uri && uri.startsWith('http')) || (uri && uri.startsWith('file'));
  useLayoutEffect(() => {
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
        // navigation.navigate(screens.income as never);
        navigation.goBack();
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
        console.log('Log  Success:', body[0]);
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
      console.log('Partial Error', error);
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
      console.log('BalanceInFavor Income Error', error);
      Alert.alert(trans('Error'), trans('Something went wrong!'));
    }
  };

  const handleChange = (value: any, name?: any) => {
    data.current = {...data.current, [name]: value};
    console.log('handleChange', data.current);
  };

  const handleUpdate = async () => {
    setLoadings(true);
    console.log(
      'Data.current',
      data.current,
      ' ',
      item?._id,
      '  ',
      config.token,
    );
    var obj = {
      imported: data?.current.imported || '',
      noteRevision: data?.current?.noteRevision || '',
      perDay: data?.current?.perDay || '',
      amount: data?.current?.amount,
      note: data?.current.note,
      paymentTypeId: data?.current?.paymentType?._id,
      dueDate: moment(data?.current?.expireDate).format('YYYY-MM-DD'),
      date: moment(new Date()).format('YYYY-MM-DD'),
      residentId: data?.current?.resident?._id,
      images: data?.current?.images || [],
    };
    console.log('Obj:', obj);
    try {
      let result = await monthChargesService.update(obj, item?._id);
      console.log('Result', result);
      var {status, message} = result;
      if (status) {
        Alert.alert(trans('Success'), trans('Successfully Updated'));
        navigation.goBack();
      } else {
        Alert.alert(trans('Error'), trans('Error Updating'));
      }
    } catch (error) {
      console.log('Update Error', error);
      Alert.alert(trans('Error'), trans('Something went wrong!'));
    }
    setLoadings(false);
  };

  const notifyResident = async () => {
    try {
      let result = await monthChargesService.notify(item?._id);
      var {status, message} = result;
      console.log('Result', result);
      if (status) {
        Alert.alert(trans('Success'), message);
        navigation.goBack();
        return;
      } else {
        Alert.alert(trans('Error'), message);
      }
    } catch (error) {
      console.log('Notify Resident Error', error);
      Alert.alert(trans('Error'), trans('Something went wrong!'));
    }
  };
  console.log('status', item);
  // return
  return (
    <>
      {loading && <LoadingComp />}
      <Container statusBarBg={colors.white}>
        <Header
          text={`${item?.resident?.street?.name} ${item?.resident?.home}`}
          showBg={false}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={() => handleUpdate()}
        />
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
            <Text
              style={[typographies(colors).montserratNormal12, styles.date]}>
              {trans('Fee')} {momentTimezone().format('MMM YYYYY')}
            </Text>
            <View style={{marginTop: rs(11), gap: rs(16)}}>
              <OnlyTextInput
                placeholder={trans('Amount')}
                defaultValue={`${data?.current?.amount}`}
                onChangeText={handleChange}
                name={'amount'}
              />
              <OnlyTextInput
                placeholder={trans('Note')}
                defaultValue={data?.current?.note}
                onChangeText={handleChange}
                name={'note'}
              />
              <DateTimeInput
                defaultValue={new Date()}
                onChange={handleChange}
                name={'date'}
              />
            </View>
            {status == 'To Be Approved' &&
            (userInfo.role == userRoles.ADMIN ||
              userInfo.role == userRoles.SUPER_ADMIN) ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {data?.current?.images.length > 0 &&
                    data?.current?.images.map((image: any, index: number) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            global.showImageView(
                              isValidUri(image) ? image : imageLink.placeholder,
                            )
                          }
                          style={{
                            width: 60,
                            height: 60,
                            marginHorizontal: 10,
                            borderRadius: 20,
                            overflow: 'hidden',
                            backgroundColor: colors.gray2,
                          }}>
                          <Image
                            source={{uri: image}}
                            style={{width: '100%', height: '100%'}}
                            resizeMode={'cover'}
                          />
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </>
            ) : (
              <>
                <UploadImage
                  defaultValue={data?.current?.images}
                  onChange={handleChange}
                />
              </>
            )}
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
                        global.showBottomSheet({flag: false});
                        let obj = {
                          monthChargesId: data?.current?._id,
                          status: 'Approved',
                        };
                        let result = await monthChargesService.updateCharges(
                          obj,
                        );
                        console.log('Approve Api ApprovePayment', result);
                        navigation.goBack();
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
              {status && status.toLowerCase().trim() == 'earning' && (
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
              )}
            </View>
            <View style={{marginTop: rs(13), gap: rs(8)}}>
              <Button text={trans('Log')} onPress={() => onLogPress()} />

              <Button
                text={trans('Decline')}
                textColor={colors.white}
                style={{backgroundColor: colors.error1}}
                onPress={() => onDecline()}
              />

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
        <ImageView />
      </Container>
    </>
  );
};

export default ApprovePaymentIncome;
