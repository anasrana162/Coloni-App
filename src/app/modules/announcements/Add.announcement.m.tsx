import {View, Text, ScrollView} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import AlertIcon from '../../assets/images/svg/alertIcon.svg';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import UploadIcon from '../../assets/images/svg/uploadIcon.svg';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import announcementsService from '../../services/features/announcements/announcements.service';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/announcements/announcements.slice';
import {showMessage} from 'react-native-flash-message';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {useTheme} from '@react-navigation/native';
import {
  imageValidation,
  pdfValidation,
} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import documentPicker from '../../packages/document-picker/documentPicker';
import {documentTypes} from '../../packages/document-picker/documentPicker.package';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import CustomSelect from '../../components/app/CustomSelect.app';
import Button from '../../components/core/button/Button.core';
import {uriToBlob} from '../../utilities/uriToBlob';
import ResidentField from '../optional-configuration/Components/ResidentFeild';
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
  const [images, setImages] = useState<any>(
    defaultValue?.images
      ? defaultValue.images.map((url: string) => ({show: url}))
      : [],
  );
  console.log('checking def...', defaultValue);
  const [files, setFiles] = useState<any>(
    defaultValue?.uploadfile[0]
      ? [
          {
            fileName: defaultValue?.uploadfileName || 'Document',
            fileUrl: defaultValue.uploadfile,
            show: defaultValue.uploadfile,
          },
        ]
      : [],
  );

  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();

  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length > 3) {
        showMessage({message: trans('Maximum 3 files')});
        return;
      }
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
          var imagetoUpload = Array.isArray(image) ? image : [image];
          const uploadedFiles = await Promise.all(
            imagetoUpload.map(uploadFile),
          );
          const updatedArray = [...images, ...uploadedFiles];
          setImages(updatedArray);
          const imageUrls = uploadedFiles.map(file => file.fileUrl);
          onChange && onChange(imageUrls, 'images');
        } catch (error) {
          console.error('Error uploading files:', error);
        }
      }
    } else {
      if (typeof index === 'number') {
        const updateArray = [...images];
        updateArray.splice(index, 1);
        setImages(updateArray);
        onChange &&
          onChange(
            updateArray.map(img => img.fileUrl),
            'images',
          );
      }
    }
  };

  const documentSuccess = async (value: any, index?: number) => {
    if (value) {
      console.log('files', files);
      if (files.length > 1) {
        showMessage({message: trans('Maximum 1 files')});
        return;
      }
      const newFile = Array.isArray(value) ? value[0] : value;
      const fileName = newFile?.name;
      const fileUrl = newFile?.uri || newFile?.fileUrl;

      try {
        const fileData = await uriToBlob(fileUrl);

        const validate = pdfValidation(newFile, trans);
        if (validate) {
          const uploadResult = await s3Service.uploadFileToS3(
            'coloni-app',
            fileName,
            fileData,
            newFile?.mime || 'unknown',
          );
          const uploadedFileUrl = uploadResult?.Location;

          console.log('updatedFiles', files);
          const updatedFiles = [{fileName, fileUrl: uploadedFileUrl}];

          setFiles(updatedFiles);

          const fileUrls = updatedFiles.map(file => file.fileUrl);
          console.log('fileUrls', fileUrls);
          onChange && onChange(fileUrls, 'uploadfile');
          onChange && onChange(fileName, 'uploadfileName');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        showMessage({message: trans('Upload failed')});
      }
    } else if (typeof index === 'number') {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);

      const fileUrls = updatedFiles.map(file => file.fileUrl);
      onChange && onChange(fileUrls, 'uploadfile');
    }
  };

  return (
    <View>
      <View
        style={[
          globalStyles.rowBetween,
          {alignItems: 'center', marginTop: rs(25)},
        ]}>
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
            {images.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  position: 'relative',
                  alignSelf: 'flex-start',
                  marginTop: rs(15),
                }}>
                <ImagePreview
                  source={{uri: item?.show}}
                  styles={{height: rs(49), width: rs(49)}}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => success('', index)}
                  style={{
                    position: 'absolute',
                    right: rs(-5),
                    top: rs(-60),
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
        ) : (
          !edit && (
            <View style={{flexDirection: 'row', gap: 5}}>
              <ImagePreview source={imageLink.demoImage} />
              <ImagePreview source={imageLink.demoImage} />
              <ImagePreview source={imageLink.demoImage} />
            </View>
          )
        )}
      </View>

      <Text />
      <IconCircle
        icon={<UploadIcon height={rs(60)} width={rs(40)} />}
        shadow={false}
        bgColor={colors.gray5}
        onPress={() =>
          documentPicker.select({
            success: documentSuccess,
            mediaType: documentTypes.pdf,
            multiple: true,
          })
        }
      />
      {!isEmpty(files) && (
        <View style={{gap: rs(10), position: 'relative'}}>
          {files.map((item: any, index: number) => (
            <View
              key={index}
              style={{
                position: `${'relative'}`,
                marginTop: rs(15),
              }}>
              <View
                style={{
                  ...customPadding(10, 10, 10, 10),
                  backgroundColor: colors.gray3,
                }}>
                <Text style={typographies(colors).montserratNormal16}>
                  {item?.fileName}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => documentSuccess('', index)}
                style={{
                  position: `${'absolute'}`,
                  right: rs(-8),
                  top: rs(-55),
                }}>
                <CancelIcon
                  fill={colors.error1}
                  height={rs(20)}
                  width={rs(20)}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const AddAnnouncement: React.FC<{
  route: {params?: {index?: number; edit?: boolean; id?: any; item: any}};
}> = ({
  route: {
    params: {index, id, edit, item} = {
      index: -1,
      id: '',
      edit: false,
    },
  },
}) => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const [notify, setNotify] = useState(false);
  const values = useRef<{
    sendTo: string;
    qualification: string;
    date: Date;
    note: string;
    images: [];
    uploadfile: [];
    uploadfileName: string;
    notify?: boolean;
    //residentId?: string;
  }>({
    sendTo: '',
    qualification: '',
    date: new Date(),
    note: '',
    images: [],
    uploadfile: [],
    uploadfileName: '',
    notify: false,
    //residentId: ''
  });
  const [sendToValue, setSendToValue] = useState(values.current.sendTo);
  const [Resident, setResident] = useState('');
  const [ResidentId, setResidentId] = useState('');
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
    if (name === 'sendTo') {
      setSendToValue(value);
    }
  };
  const handleBellPress = async () => {
    setNotify(!notify);
    values.current.notify = !notify;
    const payload = {
      notify: values.current.notify,
      note: values?.current?.note,
      sendTo: values.current.sendTo,
      qualification: values?.current.qualification,
    };

    try {
      const result = await announcementsService.createNotify(payload);
      const {status, message, body} = result;
      if (status) {
        console.log('Notification created successfully');
      } else {
        console.error('Failed to create notification:', message);
        showAlertWithOneAction({
          title: trans('Notification Error'),
          body: message,
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      showAlertWithOneAction({
        title: trans('Notification Error'),
        body: trans('Failed to create notification'),
      });
    }
  };
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    announcementsService.delete(item?._id);
  };
  const dispatch = customUseDispatch();

  const [loadings, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    // if (values.current.files.length > 0) {

    const payload = {
      ...values.current,

      ...(sendToValue === trans('Resident') && {
        residentId: values?.current?.residentId?._id || ResidentId,
      }),
    };
    console.log('checking payloads........', payload);
    const isValid =
      checkEmptyValues(payload, 'files') &&
      (sendToValue !== trans('Resident') || payload.residentId);

    if (isValid) {
      loading.current = true;

      loading.current = true;

      const result = await (edit
        ? announcementsService.update(payload, id)
        : announcementsService.create(payload));
      const {status, body, message} = result as apiResponse;

      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Announcements'),
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
        const result = await announcementsService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('body', body);
        if (status) {
          values.current = {
            sendTo: body?.sendTo,
            note: body?.note,
            qualification: body?.qualification,
            date: body?.date || new Date(),
            images: body?.images || [],
            uploadfile: body?.uploadfile || [],
            uploadfileName: body?.uploadfileName,
            //residentId: body?.residentId
          };
          setSendToValue(body?.sendTo);
          const residentInfo = `${body?.resident?.street?.name || ''} ${
            body?.resident?.home || ''
          }`;
          console.log('residentInfo', residentInfo);
          setResident(residentInfo);
          setResidentId(body?.resident?._id);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);
  const defaultValue = {
    images: values?.current.images,
    uploadfile: values?.current.uploadfile,
    uploadfileName: values?.current?.uploadfileName,
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans(edit ? 'Edit Announcements' : 'Add Announcements')}
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
            <View
              style={{
                ...customPadding(11, 14, 11, 14),
                backgroundColor: colors.primary,
                borderRadius: rs(10),
              }}>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {color: colors.white},
                ]}>
                {trans('Information')}
              </Text>
            </View>
            {edit ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    typographies(colors).ralewayMedium12,
                    {
                      color: colors.gray1,
                      marginTop: rs(4),
                      marginLeft: rs(8),
                      width: '80%',
                    },
                  ]}>
                  {trans(
                    'Upon saving, the statement will be sent to all residents.',
                  )}
                </Text>
                <View
                  style={[
                    globalStyles.justifyAlignCenter,
                    {
                      alignSelf: `${'flex-end'}`,
                      backgroundColor: notify ? colors.gray7 : colors.gray2,
                      borderWidth: notify ? 2 : 0,
                      borderColor: notify ? colors.primary : colors.gray2,
                      height: rs(50),
                      width: rs(50),
                      borderRadius: rs(50),
                      marginTop: rs(18),
                      marginBottom: rs(5),
                    },
                  ]}>
                  <TouchableOpacity onPress={handleBellPress}>
                    <AlertIcon />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {!edit ? <View style={{marginTop: rs(10)}}></View> : null}
            <CustomSelect
              placeholder={trans('private')}
              label={trans('Send to')}
              data={[trans('Private'), trans('Resident')]}
              onChange={(text: any) => handleChange(text, 'sendTo')}
              defaultValue={sendToValue}
            />
            {sendToValue === trans('Resident') && (
              <ResidentField
                onChange={value => handleChange(value, 'residentId')}
                defaultValue={Resident}
                label={trans('Resident')}
              />
            )}
            <LabelInput
              label={trans('Title')}
              placeholder={trans('Title')}
              name="qualification"
              onChangeText={handleChange}
              defaultValue={values.current.qualification}
            />
            <DateTimeInput
              label={trans('Date')}
              defaultValue={values.current.date}
              name="date"
              onChange={handleChange}
            />
            <MultiLineInput
              label={trans('Note')}
              defaultValue={values.current.note}
              placeholder={trans('Note')}
              name="note"
              onChangeText={handleChange}
            />
            <UploadImage
              defaultValue={defaultValue}
              onChange={handleChange}
              edit={edit}
            />
            {edit ? (
              <Button
                text="Eliminate"
                style={{
                  marginTop: rs(20),
                  backgroundColor: colors.eliminateBtn,
                }}
                textColor={colors.white}
                onPress={handleDelete}
              />
            ) : null}
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default AddAnnouncement;
