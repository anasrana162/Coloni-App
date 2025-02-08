import {View, ScrollView, TouchableOpacity, Text, Image} from 'react-native';
import React, {useState} from 'react';
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
import useAddVehicle from './hooks/useAddVehicles.hook';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import ColorSelection from '../../components/app/ColorSelection.app';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {useTheme} from '@react-navigation/native';
import {isEmpty} from '../../utilities/helper';
import {imageValidation} from '../../services/validators/file.validator';
import {useTranslation} from 'react-i18next';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import s3Service from '../../services/features/s3/s3.service';
import {showMessage} from 'react-native-flash-message';
import {registrationExpensesStyles as styles} from '../bills/styles/registrationExpenses.styles';
import CustomSelect from '../../components/app/CustomSelect.app';
import {useSelector} from 'react-redux';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import Badge from '../../components/app/Badge.app';
import {colors} from '../../assets/global-styles/color.assets';
import useVehicles from './hooks/useVehicles.hook';
import {userRoles} from '../../assets/ts/core.data';
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
interface props {
  route: {params?: {edit?: boolean; id?: string; index?: number}};
}
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
const AddUpdateVehicles: React.FC<props> = ({
  route: {params: {edit = false, id, index = -1} = {}},
}) => {
  const {
    loading,
    values,
    trans,
    handleChange,
    onDelete,
    save,
    handleSubmit,
    residents,
    userInfo,
  } = useAddVehicle({
    edit,
    id,
    index,
  });
  function isObject(variable: any) {
    return variable !== null && typeof variable === 'object';
  }
  return (
    <>
      {loading && <LoadingComp />}
      <Container>
        <Header
          text={
            edit === true
              ? trans('Edit Vehicles')
              : trans('Vehicles Registration')
          }
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={() => (!save ? handleSubmit() : undefined)}
        />
        {edit && loading ? (
          <View style={globalStyles.emptyFlexBox}>
            <EmptyContent forLoading={loading} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
            {(userInfo?.role == userRoles?.ADMIN ||
              userInfo?.role == userRoles.SUPER_ADMIN) && (
              <CustomSelect
                placeholder={trans('Resident')}
                label={trans('Resident')}
                data={residents}
                // defaultValue={trans(
                //   isObject(values.guy) ? values.guy?.name : values.guy,
                // )}
                defaultValue={values.current?.residentId?.name}
                onChange={(value: string) => handleChange(value, 'residentId')}
                isDataObject={true}
              />
            )}
            <CustomSelect
              label={trans('Brand')}
              placeholder={trans('select')}
              data={carManufacturers}
              defaultValue={values.current.carBrand}
              onChange={handleChange}
              name="carBrand"
            />
            <LabelInput
              label={trans('Model')}
              placeholder={trans('Model')}
              onChangeText={handleChange}
              name={'carModel'}
              defaultValue={values.current?.carModel}
            />
            <LabelInput
              label={trans('Registration Plate')}
              placeholder={trans('Registration Plate')}
              onChangeText={handleChange}
              name={'registrationPlate'}
              defaultValue={values.current?.registrationPlate}
            />
            <LabelInput
              label={trans('Card/Tag')}
              placeholder={trans('Card/Tag')}
              onChangeText={handleChange}
              name={'tag'}
              defaultValue={values.current?.tag}
            />
            <ColorSelection
              color={values.current?.color}
              name="color"
              onChange={handleChange}
            />
            <UploadImage
              onChange={handleChange}
              defaultValue={values.current.images}
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
                // onPress={() => handleDelete()}
                onPress={() => onDelete(index, id)}
              />
            )}
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default AddUpdateVehicles;
