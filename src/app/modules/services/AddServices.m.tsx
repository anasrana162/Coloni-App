import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
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
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {
  updateAction,
  addAction,
} from '../../state/features/services/services.slice';
import {showMessage} from 'react-native-flash-message';
import {useTheme} from '@react-navigation/native';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import servicesService from '../../services/features/services/services.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {colors} from '../../assets/global-styles/color.assets';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import Badge from '../../components/app/Badge.app';
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
          const updateArray = [...images, value];
          onChange && onChange(updateArray, 'images');
          setImages(updateArray);
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
      const updateArray = [...images];
      updateArray.splice(index, 1);
      console.log('deleting');
      onChange && onChange(updateArray, 'images');
      setImages(updateArray);
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
                  }}>
                  <ImagePreview
                    source={{uri: item}}
                    styles={{height: 60, width: 60}}
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
              <ImagePreview source={imageLink.demoImage} />
              <ImagePreview source={imageLink.demoImage} />
            </View>
          </> //
        )}
      </View>
    </View>
  );
};
const AddService: React.FC<{
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
  const [loadings, setLoading] = useState(false);

  const loading = useRef(false);
  const [fetching, setFetching] = useState(edit ? true : false);
  const values = useRef<{
    name: string;
    notificationMessage: string;
    active: boolean;
    images: any[];
  }>({
    name: '',
    notificationMessage: '',
    active: false,
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
    };
    if (checkEmptyValues(payload, 'files')) {
      loading.current = true;
      const result = await (edit
        ? servicesService.update({...payload}, id)
        : servicesService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        console.log('{item: body, index, id}', {item: body, index, id});
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Services Registration'),
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
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await servicesService.details(id);
        console.log('details', result);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            name: body?.name,
            notificationMessage: body?.notificationMessage,
            active: body?.active,
            images: body?.images,
          };
          setIsActive(body?.active);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isActive, setIsActive] = useState<boolean>(false);

  const handlePress = () => {
    setIsActive(prevState => !prevState);
  };

  const handleDelete = (index: number) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        console.log('id', id);
        // dispatch(deleteAction({index, id: values?.current?._id}));
        await servicesService.delete(id);
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this service?'),
      onPressAction: confirm,
    });
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Services Registration')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        {!fetching ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
            <LabelInput
              placeholder={trans('Name')}
              defaultValue={values.current.name}
              onChangeText={handleChange}
              name="name"
            />
            <MultiLineInput
              placeholder={trans('Notification Message')}
              defaultValue={values.current.notificationMessage}
              onChangeText={handleChange}
              name="notificationMessage"
            />
            <ActiveOrDisActive
              label={trans(isActive ? 'Active' : 'Inactive')}
              defaultValue={values.current.active}
              name="active"
              onChange={(value, name) => {
                handleChange(value, name);
                handlePress();
              }}
              style={{marginBottom: rs(10)}}
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
        ) : (
          <EmptyContent forLoading={fetching} />
        )}
      </Container>
    </>
  );
};

export default AddService;
