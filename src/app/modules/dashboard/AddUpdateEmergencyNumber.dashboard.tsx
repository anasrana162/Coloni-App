/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import LabelInput from '../../components/app/LabelInput.app';
import {
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import emergencyNumberService from '../../services/features/emergencyNumber/emergencyNumber.service';
import {apiResponse} from '../../services/features/api.interface';
import {customUseDispatch} from '../../packages/redux.package';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CameraIcon from '../../assets/icons/Camera.icon';
import IconCircle from '../../components/app/IconCircle.app';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {useTheme} from '@react-navigation/native';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {isEmpty} from '../../utilities/helper';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/emergencyNumber/emergencyNumber.slice';
import {showMessage} from 'react-native-flash-message';
import Badge from '../../components/app/Badge.app';
import {colors} from '../../assets/global-styles/color.assets';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
  edit?: boolean;
}) => {
  const [images, setImages] = useState<any>(defaultValue || []);
  const [key, setKey] = useState<any>(0);
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const success = async (image: any, index?: any) => {
    if (image) {
      const validate = imageValidation(image, trans);
      if (validate) {
        const uploadFile = (value: any) => {
          // const updateArray = [...images, value];
          onChange && onChange([value], 'images');
          setImages([value]);
        };

        const newFile = Array.isArray(image) ? image[0] : image;
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

          // const payload = {
          //   fileName,
          //   fileUrl: fetchImageLink?.Location,
          //   fileSize: newFile?.size,
          //   fileType: contentType,
          //   fileKey: fetchImageLink?.Key,
          //   show: newFile.path
          // };
          uploadFile(fetchImageLink?.Location);
        } catch (error) {
          console.error('Error uploading file:', error);
          showMessage({message: trans('Upload failed')});
          throw error; // Ensure the error is thrown to handle it outside
        }
      }
    } else {
      // const updateArray = [...images];
      // updateArray.splice(index, 1);
      console.log('deleting');
      onChange && onChange([], 'images');
      setImages([]);
    }
  };
  useEffect(() => {
    setImages(defaultValue);
    setKey(key + 1);
  }, [defaultValue]);
  return (
    <View key={key} style={{marginTop: rs(25)}}>
      <View style={[globalStyles.rowBetween, {alignItems: 'center'}]}>
        <IconCircle
          icon={<CameraIcon />}
          onPress={() =>
            global.showBottomSheet({
              flag: true,
              component: ImagePickerBottomSheet,
              componentProps: {success, multiple: true},
            })
          }
          keyboardType="default"
        />
        {!isEmpty(images) ? (
          <View
            style={{flexDirection: 'row', gap: rs(10), position: 'relative'}}>
            {images.map((item: any, index: number) => {
              return (
                <View
                  key={index}
                  style={{
                    position: `${'relative'}`,
                    alignSelf: `${'flex-start'}`,
                    marginTop: rs(15),
                    backgroundColor: colors.primary,
                    borderRadius: 40,
                  }}>
                  <Image
                    source={{uri: item}}
                    style={{height: 70, width: 70}}
                    // resizeMode={'contain'}
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
        ) : (
          <>
            <View style={{flexDirection: 'row', gap: 5}}>
              <ImagePreview source={imageLink.demoImage} />
            </View>
          </> //
        )}
      </View>
    </View>
  );
};

const AddUpdateEmergencyNumber: React.FC<{
  route: {params?: {edit?: boolean; index?: number; id?: string}};
}> = ({
  route: {
    params: {edit, index, id} = {
      edit: false,
      index: -1,
      id: '',
    },
  },
}) => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const [loadings, setLoading] = useState(false);
  const nameRef = useRef<any>('');
  const phoneRef = useRef<any>('');
  const [key, setKey] = useState<any>(0);
  const dispatch = customUseDispatch();
  const [values, setValues] = useState<{
    name: string;
    phone: string;
    images: any[];
  }>({
    name: '',
    phone: '',
    images: [],
  });
  const handleChange = (value: string, name?: string) => {
    setValues({...values, [name || '']: value});
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (values.name && values.phone) {
      if (!loading.current) {
        loading.current = true;
        const object = {...values};
        console.log('Object:', object);
        const result = await (edit
          ? emergencyNumberService.update(object, id)
          : emergencyNumberService.create(object));
        const {status, body, message} = result as apiResponse;
        if (status) {
          edit
            ? dispatch(updateAction({id, index, item: body}))
            : dispatch(addAction(body));
          navigation.goBack();
        } else {
          showMessage({message});
        }
        loading.current = false;
      }
    } else {
      showAlertWithOneAction({
        title: trans('Emergency Numbers'),
        body: trans('Please fill-up correctly'),
      });
    }
    setLoading(false);
  };
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await emergencyNumberService.delete(id);
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this number?'),
      onPressAction: confirm,
    });
  };
  useEffect(() => {
    if (id && edit) {
      (async () => {
        const result = await emergencyNumberService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          try {
            setValues({
              name: body?.name,
              phone: body?.phone,
              images: body.images,
            });

            nameRef.current?.setNativeProps({text: body?.name});
            phoneRef.current?.setNativeProps({text: body?.phone});
            // set;
          } catch (_) {}
        } else {
          showMessage({message});
          navigation.goBack();
        }
      })();
    }
  }, [id]);

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={
            edit
              ? trans('Edit Emergency Number')
              : trans('Add Emergency Numbers')
          }
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />

        <View style={{...customPadding(0, 20, 0, 20)}}>
          <LabelInput
            placeholder={trans('Name')}
            onChangeText={value => setValues({...values, name: value})}
            defaultValue={values.name}
            label={trans('Name')}
            keyboardType="default"
          />
          <LabelInput
            placeholder={trans('Phone')}
            onChangeText={value => setValues({...values, phone: value})}
            defaultValue={values.phone}
            label={trans('Phone')}
            keyboardType="number-pad"
          />
          <UploadImage
            defaultValue={values.images}
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
              onPress={() => handleDelete(index ?? -1, id ?? '')}
            />
          )}
        </View>
      </Container>
    </>
  );
};

export default AddUpdateEmergencyNumber;
