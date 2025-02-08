import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {ScrollView, TouchableOpacity, View, Text} from 'react-native';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {showMessage} from 'react-native-flash-message';
import {apiResponse} from '../../services/features/api.interface';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/frequentVisit/frequentVisit.slice';
import {isEmpty} from '../../utilities/helper';
import {customUseDispatch} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import UserProfile from '../../assets/images/svg/userProfile.svg';
import {useTheme} from '@react-navigation/native';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import VisitType from './bottomSheet/VisitType.bottomSheet';
import frequentVisitService from '../../services/features/frequentVisit/frequentVisit.service';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import SeeHistory from './bottomSheet/SeeHistoryBottomSheet';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const Upload: React.FC<{defaultValue: any; onChange: any}> = ({
  defaultValue,
  onChange,
}) => {
  const [images, setImages] = useState<any[]>(
    defaultValue ? [defaultValue[0]] : [],
  );
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();

  useEffect(() => {
    if (defaultValue) {
      setImages([defaultValue[0]]);
    }
  }, [defaultValue]);

  const success = async (image: any) => {
    if (image) {
      const validate = imageValidation(image, trans);
      if (validate) {
        const uploadFile = async (file: any) => {
          const newFile = Array.isArray(file) ? file[0] : file;
          let fileName = '';
          let fileContent: any = null;
          let contentType = '';
          let ext = newFile?.mime;
          let ext2 = newFile?.type;

          if (ext) {
            fileName = newFile?.path?.split('/').pop();
            fileContent = await fetch(newFile.path).then(res => res.blob());
            contentType = ext;
          } else if (ext2) {
            fileName = newFile?.name;
            fileContent = await fetch(newFile.path).then(res => res.blob());
            contentType = ext2;
          }

          try {
            const fetchImageLink = await s3Service.uploadFileToS3(
              'coloni-app',
              fileName,
              fileContent,
              contentType,
            );
            console.log('Link image', fetchImageLink);

            return {
              fileName,
              fileUrl: fetchImageLink?.Location,
              fileSize: newFile?.size,
              fileType: contentType,
              fileKey: fetchImageLink?.Key,
              show: newFile.path,
            };
          } catch (error) {
            console.error('Error uploading file:', error);
            showMessage({message: trans('Upload failed')});
            throw error;
          }
        };

        try {
          const uploadedFile = await uploadFile(image);
          const updatedImages = [uploadedFile.fileUrl];
          setImages(updatedImages);
          onChange && onChange(updatedImages, 'images');
        } catch (error) {
          console.error('Error uploading files:', error);
        }
      }
    } else {
      setImages([]);
      onChange && onChange([], 'images');
    }
  };

  return (
    <>
      <View
        style={{
          height: rs(99),
          width: rs(99),
          backgroundColor: colors.gray8,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        {images.length > 0 ? (
          <ImagePreview
            source={{uri: images[0] || defaultValue[0]}}
            styles={{height: rs(52), width: rs(52), borderRadius: 50}}
            borderRadius={50}
          />
        ) : (
          <UserProfile />
        )}
      </View>
      <IconCircle
        onPress={() =>
          global.showBottomSheet({
            flag: true,
            component: ImagePickerBottomSheet,
            componentProps: {success, multiple: false},
          })
        }
        icon={<CameraIcon />}
        style={{marginBottom: rs(20)}}
      />
    </>
  );
};

const IndicateDays = ({
  values,
  handleChange,
}: {
  values: any;
  handleChange: (value: any, field: string) => void;
}) => {
  const {t: trans} = useTranslation();
  const [show, setShow] = useState(values.current.indicateDays);
  const {colors} = useTheme() as any;
  const [select, setSelected] = useState(values.current.availableDays || []); // Use 'availableDays' from values

  const data = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const addAndRemoveItem = (item: string) => {
    const array = [...select];
    const index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    setSelected(array);
    handleChange(array, 'availableDays');
  };

  return (
    <View style={{marginBottom: rs(15)}}>
      <ActiveOrDisActive
        label={trans('Indicate Days')}
        defaultValue={show}
        onChange={(value: boolean) => {
          setShow(value);
          if (!value) {
            setSelected([]);
            handleChange([], 'availableDays');
          }
          handleChange(value, 'indicateDays');
        }}
        style={{marginBottom: rs(15)}}
      />

      {show && (
        <View style={{gap: rs(5)}}>
          {data.map((item, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={globalStyles.rowBetween}
              onPress={() => addAndRemoveItem(item)}>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {color: colors.primary},
                ]}>
                {item}
              </Text>
              <View
                style={{
                  width: rs(12),
                  height: rs(12),
                  borderRadius: 500,
                  backgroundColor: colors.gray5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {select.includes(item) && (
                  <View
                    style={{
                      width: rs(8),
                      height: rs(8),
                      borderRadius: 500,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const AddFrequentVisits: React.FC<{
  route: {
    params?: {
      edit: boolean;
      index: number;
      id: string;
      item: any;
      residentId: string;
    };
  };
}> = ({
  route: {
    params: {edit, index, id, residentId, item} = {
      edit: false,
      index: -1,
      id: '',
      residentId: '',
    },
  },
}) => {
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const [loadings, setLoading] = useState(false);
  const values = useRef({
    frequentVisitTypeId: null,
    name: '',
    note: '',
    qrCode: 'testing',
    availableDays: [],
    asset: false,
    resident: residentId,
    indicateDays: false,
    images: [],
  });
  // "frequentVisitTypeId": "66d70abfd05f20e7f6b230e9",
  // "name": "this is my data for true",
  // "note": "Rentals for the month for month",
  // "qrCode":"testing",
  // "indicateDays": true,
  // "asset": true,
  // "images": [
  //     "mmm"
  // ],
  // "resident":"671642f87214cd58eff0d6e0",
  // "availableDays":["Monday","Friday"]
  const handleChange = (value: any, field?: string) => {
    console.log('value', value, 'name', field);
    const oldValues = {...values.current};
    values.current = {...oldValues, [field as string]: value};
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      frequentVisitTypeId: values?.current?.frequentVisitTypeId?._id,
    };

    console.log('checking payload', payload);

    loading.current = true;
    const result = await (edit
      ? frequentVisitService.update(payload, id)
      : frequentVisitService.create(payload));
    const {status, body, message} = result as apiResponse;

    if (status) {
      edit
        ? dispatch(updateAction({item: body, index, id}))
        : dispatch(addAction(body));
      navigation.goBack();
    } else {
      showAlertWithOneAction({
        title: trans('Frequent Visit'),
        body: message,
      });
    }
    loading.current = false;
    setLoading(false);
  };

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await frequentVisitService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking details', body);
        if (status) {
          values.current = {
            frequentVisitTypeId: body?.visitType,
            name: body?.name,
            qrCode: body.qrCode,
            note: body?.note,
            resident: body?.resident,
            indicateDays: body?.indicateDays,
            asset: body?.asset || false,
            availableDays: body?.availableDays,
            images: body?.images,
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    frequentVisitService.delete(id);
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={edit ? trans('Edit Frequent Visit') : trans('Frequent Visits')}
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
            <Upload
              defaultValue={values?.current?.images}
              onChange={handleChange}
            />
            <VisitType
              //ScreenName="frequentVisit"
              defaultValue={values?.current.frequentVisitTypeId}
              onChange={handleChange}
              name="frequentVisitTypeId"
            />
            <LabelInput
              placeholder={trans('Name')}
              defaultValue={values?.current?.name}
              name="name"
              onChangeText={handleChange}
            />
            <MultiLineInput
              placeholder={trans('Note')}
              defaultValue={values.current.note}
              name="note"
              onChangeText={handleChange}
            />
            <ActiveOrDisActive
              label={trans('Asset')}
              defaultValue={values?.current?.asset}
              name="asset"
              onChange={handleChange}
              style={{marginBottom: rs(10)}}
            />
            <IndicateDays values={values} handleChange={handleChange} />
            {edit ? (
              <View>
                <Button
                  text="See History"
                  style={{marginTop: rs(20), backgroundColor: colors.tertiary}}
                  onPress={() =>
                    global.showBottomSheet({
                      flag: true,
                      component: SeeHistory,
                      componentProps: {
                        data: item,
                        onClose: () => {},
                      },
                    })
                  }
                />
                <Button
                  text="Eliminate"
                  style={{
                    marginTop: rs(20),
                    backgroundColor: colors.eliminateBtn,
                  }}
                  textColor={colors.white}
                  onPress={handleDelete}
                />
              </View>
            ) : null}
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default AddFrequentVisits;
