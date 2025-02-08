import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import {colors} from '../../assets/global-styles/color.assets';
import Header from '../../components/core/header/Header.core';
import moment from 'moment';
import PaymentType from '../bills/bottomSheet/PaymentType.bottomSheet';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import CustomSelect from '../../components/app/CustomSelect.app';
import {useTheme} from '@react-navigation/native';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import s3Service from '../../services/features/s3/s3.service';
import {showMessage} from 'react-native-flash-message';
import {imageValidation} from '../../services/validators/file.validator';
import {registrationExpensesStyles as styles1} from '../bills/styles/registrationExpenses.styles';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {isEmpty} from '../../utilities/helper';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import monthChargesService from '../../services/features/monthCharges/monthCharges.service';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const {width, height} = Dimensions.get('screen');

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

      const payload = {
        fileName,
        fileUrl: fetchImageLink?.Location,
        fileSize: newFile?.size,
        fileType: contentType,
        fileKey: fetchImageLink?.Key,
        show: newFile.path,
      };
      uploadFile(fetchImageLink?.Location);
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
  return (
    <View key={key} style={{width: width - 40, marginBottom: 20}}>
      <View style={styles1.uploadContainer}>
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
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {marginTop: 10, color: colors.primary},
            ]}>
            {trans('Image Upload')}
          </Text>
        </View>
        {!isEmpty(images) && (
          <View style={{flexDirection: 'row', gap: rs(10), right: 10}}>
            {images.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  position: `${'relative'}`,
                  alignSelf: `${'flex-start'}`,
                  marginTop: rs(15),
                }}>
                <Image
                  source={{uri: !item?.show ? item : item?.show}}
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
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const UpdateAddIncome: React.FC<{
  route: {params: {item: any}};
}> = ({
  route: {
    params: {item},
  },
}) => {
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<number>(0);
  const [data, setData] = useState<any>({
    imported: 'imported',
    noteRevision: 'noteRevision',
    perDay: 'PERDAY',
    paymentTypeId: '',
    paymentDate: '',
    amount: 0,
    dueDate: '',
    note: '',
    date: moment(new Date()).format('MM/DD/YYYY'),
    status: '',
    residentId: '',
    images: [],
  });

  useLayoutEffect(() => {
    populateData();
  }, [item]);

  const populateData = () => {
    if (item) {
      setData({
        imported: 'imported',
        noteRevision: 'noteRevision',
        perDay: 'PERDAY',
        paymentTypeId: item?.paymentType,
        paymentDate: item?.paymentDate,
        amount: parseInt(item?.amount),
        dueDate: item?.expireDate,
        note: item.note,
        date: item.date,
        status: item?.status,
        residentId: item?.resident?._id,
        images: item?.images,
      });
    }
  };

  const handleChange = (value: any, name?: any) => {
    setData((prev: any) => ({...prev, [name]: value}));
  };

  const handleUpdate = async () => {
    setLoading(true);
    var obj = {
      ...data,
      paymentTypeId: data?.paymentTypeId?._id,
      amount: parseInt(data?.amount),
    };
    try {
      let result = await monthChargesService.update(obj, item?._id);
      var {body, status} = result;
      if (status) {
        Alert.alert(trans('Success'), trans('Successfuly Updated!'));
        navigation.goBack();
        navigation.goBack();
      } else {
        Alert.alert(trans('Error'), trans('Something went wrong!'));
      }
    } catch (error) {
      console.log('Updated Income Error', error);
      Alert.alert(trans('Error'), trans('Something went wrong!'));
    }
    setLoading(false);
  };

  useEffect(() => {
    setKey(key + 1);
  }, [data?.images]);

  return (
    <>
      {loading && <LoadingComp />}
      <Container statusBarBg={colors.white}>
        <Header
          text={item?.resident?.streetHome}
          showBg={false}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={() => handleUpdate()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{width: width - 40, alignSelf: 'center'}}>
          <PaymentType
            label={trans('Payment Type')}
            defaultValue={data?.paymentTypeId}
            onChange={(item, name) => handleChange(item, 'paymentTypeId')}
            ScreenName="monthCharges"
          />
          <DateTimeInput
            label={trans('Date')}
            defaultValue={data?.date}
            name="date"
            onChange={handleChange}
          />
          <DateTimeInput
            label={trans('Payment Date')}
            defaultValue={data?.paymentDate}
            name="paymentDate"
            onChange={handleChange}
          />
          <DateTimeInput
            label={trans('Expire Date')}
            defaultValue={data?.dueDate}
            name="dueDate"
            onChange={handleChange}
          />
          <LabelInput
            label={trans('Amount')}
            defaultValue={data.amount}
            name="amount"
            onChangeText={handleChange}
            inputProps={{inputMode: 'decimal'}}
          />
          <MultiLineInput
            label={trans('Note')}
            placeholder={trans('Description')}
            defaultValue={data.note}
            name="note"
            onChangeText={handleChange}
          />
          <CustomSelect
            data={['Earning', 'To Be Approved', 'Approved']}
            label={trans('Status')}
            defaultValue={data.status}
            placeholder={trans('Status')}
            onChange={(value: string) => handleChange(value, 'status')}
          />

          <UploadImage
            key={key}
            defaultValue={data?.images}
            onChange={handleChange}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default UpdateAddIncome;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
