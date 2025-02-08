import {View, ScrollView, Text, Image} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {
  updateAction,
  addAction,
} from '../../state/features/monthCharges/monthCharges.slice';
import {showMessage} from 'react-native-flash-message';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {useTheme} from '@react-navigation/native';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import CustomSelect from '../../components/app/CustomSelect.app';
import PaymentType from '../bills/bottomSheet/PaymentType.bottomSheet';
import {userStates} from '../../state/allSelector.state';
import monthChargesService from '../../services/features/monthCharges/monthCharges.service';
import {screens} from '../../routes/routeName.route';

import {typographies} from '../../assets/global-styles/typography.style.asset';
import {registrationExpensesStyles as styles} from '../bills/styles/registrationExpenses.styles';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const UploadImage = ({
  onChange,
  defaultValue,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
}) => {
  const [images, setImages] = useState<any>(defaultValue || []);
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const {userInfo} = customUseSelector(userStates);

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
  console.log('Images', images);
  return (
    <View>
      <View style={styles.uploadContainer}>
        <View style={styles.center}>
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
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {marginTop: rs(22), color: colors.primary},
            ]}>
            {trans('Image Upload')}
          </Text>
        </View>
      </View>
      {!isEmpty(images) && (
        <View style={{flexDirection: 'row', gap: rs(10)}}>
          {images.map((item: any, index: number) => {
            console.log('Images:', item);
            return (
              <View
                key={index}
                style={{
                  position: `${'relative'}`,
                  alignSelf: `${'flex-start'}`,
                  marginTop: rs(15),
                }}>
                <Image
                  source={{uri: item?.show ? item?.show : item}}
                  style={{height: rs(49), width: rs(49)}}
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
            );
          })}
        </View>
      )}
    </View>
  );
};

const AddUpdateResidentCharge: React.FC<{
  route: {
    params?: {
      ResidentName?: string;
      id?: any;
      resident_id?: '';
    };
  };
}> = ({
  route: {
    params: {id, ResidentName, resident_id} = {
      id: '',
      ResidentName: '',
      resident_id: '',
    },
  },
}) => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const {userInfo} = customUseSelector(userStates);
  const [loadings, setLoading] = useState(false);

  const [residentDetails, setResidentDetails] = useState({});
  const values = useRef<{
    paymentType: any;
    paymentDate: Date;
    amount: string;
    dueDate: Date;
    note: string;
    status: string;
    residentId: string;
    images: any[];
  }>({
    paymentType: 'Earning',
    paymentDate: new Date(),
    dueDate: new Date(),
    note: '',
    status: '',
    amount: '',
    residentId: id,
    images: [],
  });
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      paymentTypeId: values?.current?.paymentType?._id,
      residentId: resident_id,
    };
    console.log('payloads.....', payload);
    if (checkEmptyValues(payload, 'files')) {
      loading.current = true;

      const result = await monthChargesService.create(payload);
      const {status, body, message} = result as apiResponse;
      if (status) {
        console.log('Body from monthCahrgesServices:', body);

        dispatch(addAction(body));
        navigation.navigate(screens.chargesResident as never, {
          resident_id,
          ResidentName,
        });
      } else {
        showAlertWithOneAction({
          title: trans('Report Activity'),
          body: message,
        });
      }
      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Invalid'),
        body: trans('Please fill-up correctly'),
      });
    }
    setLoading(false);
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          // text={trans(edit ? 'Edit Report Activity' : 'Add Report Activity')}
          text={`Charge to ${ResidentName}`}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        {fetching ? (
          <EmptyContent forLoading={fetching} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
            <PaymentType
              label={trans('Payment Type')}
              defaultValue={values?.current?.paymentType}
              onChange={handleChange}
              ScreenName="monthCharges"
            />
            <DateTimeInput
              label={trans('Date')}
              defaultValue={values?.current?.paymentDate}
              name="Date"
              onChange={handleChange}
            />
            <DateTimeInput
              label={trans('Payment Date')}
              defaultValue={values?.current?.paymentDate}
              name="paymentDate"
              onChange={handleChange}
            />
            <DateTimeInput
              label={trans('Expires Date')}
              defaultValue={values?.current?.dueDate}
              name="dueDate"
              onChange={handleChange}
            />
            <LabelInput
              label={trans('Amount')}
              defaultValue={values?.current?.amount}
              name="amount"
              onChangeText={handleChange}
              inputProps={{inputMode: 'decimal'}}
            />
            <MultiLineInput
              label={trans('Note')}
              placeholder={trans('Description')}
              defaultValue={values?.current?.note}
              name="note"
              onChangeText={handleChange}
            />
            <CustomSelect
              data={['Earning', 'To Be Approved', 'Approved']}
              label={trans('Status')}
              defaultValue={values.current.status}
              placeholder={trans('Status')}
              onChange={(value: string) => handleChange(value, 'status')}
            />
            <UploadImage
              defaultValue={values.current.images}
              onChange={handleChange}
              // edit={edit}
            />
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default AddUpdateResidentCharge;
