import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import ColorSelection from '../../components/app/ColorSelection.app';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import blacklistService from '../../services/features/blacklist/blacklist.service';
import {apiResponse} from '../../services/features/api.interface';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/blacklist/blacklist.slice';
import {showMessage} from 'react-native-flash-message';
import {colorsArray} from '../../assets/ts/dropdown.data';
import {useTheme} from '@react-navigation/native';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import EmptyContent from '../../components/core/EmptyContent.core.component';

import {registrationExpensesStyles as styles} from '../bills/styles/registrationExpenses.styles';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import Badge from '../../components/app/Badge.app';
import {colors} from '../../assets/global-styles/color.assets';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const carManufacturers = [
  'Abarth',
  'Acura',
  'Alfa Romeo',
  'Aston Martin',
  'Audi',
  'BAIC',
  'Bentley',
  'BMW',
  'Buick',
  'Cadillac',
  "Chang'an",
  'Chevrolet', // Fixed typo from "Chervrolet" to "Chevrolet"
  'Chrysler',
  'Dodge',
  'FAW',
  'Ferrari',
  'Fiat',
  'Ford',
  'GMC',
  'Honda',
  'Hyundai',
  'Infiniti',
  'JAC',
  'Jaguar',
  'Jeep',
  'Kia',
  'Lamborghini',
  'Land Rover',
  'Lincoln',
  'Lotus',
  'Maserati',
  'Mazda',
  'McLaren Automotive',
  'Mini',
  'Mitsubishi',
  'Nissan Mexicana',
  'Peugeot', // Fixed typo from "Puegeot" to "Peugeot"
  'Porsche',
  'Ram',
  'Renault',
  'Rolls Royce Motor Cars',
  'SEAT',
  'Smart',
  'Subaru',
  'Suzuki',
  'Tesla, Inc',
  'Toyota',
  'Volkswagen',
  'Volvo Cars',
  'VUHL',
];

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
      console.log('Link image', fetchImageLink);

      uploadFile(fetchImageLink.Location);
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
    </View>
  );
};
const AddUpdateBlackList: React.FC<{
  route: {params?: {index?: number; edit?: boolean; id?: any}};
}> = ({
  route: {
    params: {index, id, edit} = {
      index: -1,
      id: '',
      edit: false,
    },
  },
}) => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const [fetching, setFetching] = useState(edit ? true : false);
  const [loadings, setLoading] = useState(false);
  const values = useRef<{
    tuition: string;
    brand: string;
    color: string;
    model: string;
    images: any[];
  }>({
    tuition: '',
    brand: '',
    color: colorsArray[0],
    model: '',
    images: [],
  });
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    console.log('Payload addupdate');
    const payload = {
      ...values.current,
    };
    if (checkEmptyValues(payload, 'files')) {
      loading.current = true;

      const result = await (edit
        ? blacklistService.update({...payload}, id)
        : blacklistService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('BlackList'),
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

  const handleDelete = (index: number) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        console.log('id', id);
        dispatch(deleteAction({index, id}));
        await blacklistService.delete(id);
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this vehicle?'),
      onPressAction: confirm,
    });
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await blacklistService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            tuition: body?.tuition,
            model: body?.model,
            brand: body?.brand,
            color: body?.color || colorsArray[0],
            images: body?.images || [],
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={
            edit
              ? trans('Edit Restricted Vehicle')
              : trans('Add Restricted List')
          }
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
            <LabelInput
              label={trans('Tuition')}
              placeholder={trans('Tuition')}
              defaultValue={values.current.tuition}
              onChangeText={handleChange}
              name="tuition"
            />
            <CustomSelect
              label={trans('Brand')}
              placeholder={trans('select')}
              data={carManufacturers}
              defaultValue={values.current.brand}
              onChange={handleChange}
              name="brand"
            />
            <LabelInput
              label={trans('Model')}
              placeholder={trans('Model')}
              defaultValue={values.current.model}
              onChangeText={handleChange}
              name="model"
            />
            <ColorSelection
              color={values.current?.color}
              name="color"
              onChange={handleChange}
            />
            <UploadImage
              defaultValue={values.current.images}
              onChange={handleChange}
              edit={edit}
            />
            {edit && (
              <Badge
                text={trans('Eliminate')}
                style={{
                  borderRadius: rs(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: `${'70%'}`,
                  height: 45,
                  marginTop: 30,
                }}
                bgColor={colors.error1}
                onPress={() => handleDelete(index)}
              />
            )}
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default AddUpdateBlackList;
