import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import React, { useState } from 'react';
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
import EmptyContent from '../../components/core/EmptyContent.core.component';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import { useTheme } from '@react-navigation/native';
import { isEmpty } from '../../utilities/helper';
import { imageValidation } from '../../services/validators/file.validator';
import { useTranslation } from 'react-i18next';
import useAddPets from './hooks/useAddPets.hook';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import { showMessage } from 'react-native-flash-message';
import s3Service from '../../services/features/s3/s3.service';
import { registrationExpensesStyles as styles } from '../bills/styles/registrationExpenses.styles';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { customUseSelector } from '../../packages/redux.package';
import { userStates } from '../../state/allSelector.state';
import CustomSelect from '../../components/app/CustomSelect.app';
import { userRoles } from '../../assets/ts/core.data';

interface props {
  route: {
    params?: {
      edit?: boolean;
      id?: string;
      index?: number;
      disabledEditing: boolean;
      item?: any
    };
  };
}

const UploadImage = ({
  onChange,
  defaultValue,
  editable,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
  editable: boolean;
}) => {
  const [images, setImages] = useState<any>(defaultValue || []);
  const { colors } = useTheme() as any;
  const { t: trans } = useTranslation();
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
      showMessage({ message: trans('Upload failed') });
      throw error; // Ensure the error is thrown to handle it outside
    }
  };
  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length >= 2) {
        showMessage({ message: trans('Maximum 2 files') });
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
        {editable && (
          <View style={styles.center}>
            <IconCircle
              icon={<CameraIcon />}
              onPress={() =>
                global.showBottomSheet({
                  flag: true,
                  component: ImagePickerBottomSheet,
                  componentProps: { success, multiple: true },
                })
              }
            />
            <Text
              style={[
                typographies(colors).ralewayMedium14,
                { marginTop: rs(22), color: colors.primary },
              ]}>
              {trans('Image Upload')}
            </Text>
          </View>
        )}
        {!isEmpty(images) && (
          <View style={{ flexDirection: 'row', gap: rs(10) }}>
            {images.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  position: `${'relative'}`,
                  alignSelf: `${'flex-start'}`,
                  marginTop: rs(15),
                }}>
                <Image
                  source={{ uri: item?.show ? item?.show : item }}
                  style={{ height: rs(49), width: rs(49) }}
                />
                {editable && (
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
          </View>
        )}
      </View>
    </View>
  );
};

const AddPets: React.FC<props> = ({
  route: { params: { edit = false, id, index = -1, item, disabledEditing = false } = {} },
}) => {
  const { loading, values, trans, handleChange, save, handleSubmit } = useAddPets(
    {
      edit,
      id,
      index,
    },
  );
  const { userInfo } = customUseSelector(userStates);
  return (
    <Container>
      <Header
        text={edit ? userInfo?.role === userRoles.RESIDENT ? trans("My Pets") : `${item?.resident?.street?.name} ${item?.resident?.home}` : trans('Add Pet')}
        rightIcon={
          !disabledEditing ? null : <ImagePreview source={imageLink.saveIcon} />
        }
        rightControl={() =>
          !disabledEditing ? () => { } : !save ? handleSubmit(id) : undefined
        }
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
          contentContainerStyle={{ ...customPadding(17, 20, 20, 20) }}>
          <LabelInput
            label={trans('Name')}
            placeholder={trans('Name')}
            defaultValue={values?.current?.name}
            name={'name'}
            editable={disabledEditing}
            onChangeText={handleChange}
          />
          {!disabledEditing ?
            <LabelInput
              label={trans('Pet Type')}
              placeholder={trans('Pet Type')}
              defaultValue={values?.current?.petType}
              editable={disabledEditing}
            />
            : <CustomSelect
              label={trans('Pet Type')}
              placeholder={trans('Pet Type')}
              data={['Dog', 'Cat', 'Hamster', 'Rabbit', 'Bird']}
              onChange={handleChange}
              name={'petType'}
              defaultValue={values.current?.petType}
            />}
          {!disabledEditing ?
            <LabelInput
              label={trans('Sex')}
              placeholder={trans('Sex')}
              defaultValue={values.current?.sex}
              editable={disabledEditing}
            /> :
            <CustomSelect
              label={trans('Sex')}
              placeholder={trans('Sex')}
              name={'sex'}
              data={['Male', 'Female']}
              defaultValue={values.current?.sex}
              onChange={handleChange}
            />}
          <LabelInput
            label={trans('Breed')}
            placeholder={trans('Breed')}
            onChangeText={handleChange}
            name={'breed'}
            editable={disabledEditing}
            defaultValue={values.current?.breed}
          />
          <LabelInput
            label={trans('Color')}
            placeholder={trans('Color')}
            onChangeText={handleChange}
            name={'color'}
            editable={disabledEditing}
            defaultValue={values.current?.color}
          />
          <ActiveOrDisActive
            label={trans('is Lost?')}
            style={{ marginBottom: rs(15) }}
            name={'isLost'}
            disabled={true}
            defaultValue={values.current.isLost}
            onChange={disabledEditing ? () => { } : handleChange}
          />
          {!disabledEditing ?
            <View style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 20,
              marginTop: 20
            }}>
              {values.current?.images?.length > 0 &&
                values?.current.images.map((images: any) => {
                  return (
                    <Image
                      source={{ uri: images }}
                      style={{ width: 70, height: 70 }}
                    />
                  )
                })
              }
            </View>

            :
            <UploadImage
              onChange={handleChange}
              editable={disabledEditing}
              defaultValue={values.current.images}
            />
          }
        </ScrollView>
      )}
    </Container>
  );
};

export default AddPets;
