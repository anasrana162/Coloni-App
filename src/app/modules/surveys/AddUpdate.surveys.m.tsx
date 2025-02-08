import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import {
  customMargin,
  customPadding,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import IconCircle from '../../components/app/IconCircle.app';
import UploadIcon from '../../assets/images/svg/uploadIcon.svg';
import {colors} from '../../assets/global-styles/color.assets';
import {showMessage} from 'react-native-flash-message';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/surveys/surveys.slice';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import surveysService from '../../services/features/surveys/surveys.service';
import {apiResponse} from '../../services/features/api.interface';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {documentTypes} from '../../packages/document-picker/documentPicker.package';
import documentPicker from '../../packages/document-picker/documentPicker';
import s3Service from '../../services/features/s3/s3.service';
import {pdfValidation} from '../../services/validators/file.validator';
import {useTheme} from '@react-navigation/native';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {uriToBlob} from '../../utilities/uriToBlob';
import Button from '../../components/core/button/Button.core';
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
  console.log('checking default value', defaultValue);
  const [files, setFiles] = useState<any>(
    defaultValue?.uploadFile?.length > 0
      ? defaultValue.uploadFile.map((file: any) => ({
          fileName: defaultValue.uploadFilesName || 'Document',
          fileUrl: file,
          fileSize: file.fileSize || 0,
          fileType: file.fileType || 'unknown',
          show: file,
        }))
      : [],
  );
  // const [files, setFiles] = useState<any>(
  //   defaultValue?.uploadFiles?.length > 0
  //     ? defaultValue.uploadFiles.map((file: any) => ({
  //         fileName: defaultValue.uploadFilesName || "Document",
  //         fileUrl: file,
  //         fileSize: file.fileSize || 0,
  //         fileType: file.fileType || "unknown",
  //         show: file,
  //       }))
  //     : []
  // );
  useEffect(() => {
    if (defaultValue?.uploadFiles?.length > 0) {
      setFiles(
        defaultValue.uploadFiles.map((file: any) => ({
          fileName: defaultValue.uploadFilesName || 'Document',
          fileUrl: file,
          show: file,
        })),
      );
    }
  }, [defaultValue]);

  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();

  const documentSuccess = async (value: any, index?: number) => {
    if (value) {
      if (files.length >= 2) {
        showMessage({message: trans('Maximum 2 files')});
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

          const updatedFiles = [...files, {fileName, fileUrl: uploadedFileUrl}];
          setFiles(updatedFiles);
          const fileUrls = updatedFiles.map(file => file.fileUrl);
          onChange && onChange(fileUrls, 'uploadFiles');
          onChange && onChange(fileName, 'uploadFilesName');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        showMessage({message: trans('Upload failed')});
      }
    } else if (typeof index === 'number') {
      // Handle file removal logic
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      const fileUrls = updatedFiles.map(file => file.fileUrl);
      onChange && onChange(fileUrls, 'uploadFiles');
    }
  };

  return (
    <View style={{marginTop: rs(25)}}>
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
                position: 'relative',
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
                  position: 'absolute',
                  right: rs(-8),
                  top: rs(-8),
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
const AddUpdateSurveys: React.FC<any> = ({
  route: {
    params: {index, id, edit} = {
      index: -1,
      id: '',
      edit: false,
    },
  },
}) => {
  const [fetching, setFetching] = useState(false);
  const {t: trans} = useTranslation();
  const [loadings, setLoading] = useState(false);

  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const values = useRef<{
    question: string;
    isActive: boolean;
    allowComments: boolean;
    options: string[];
    // files: any[];
    uploadFiles: any[];
    dueDate: Date;
    asset: boolean;
    uploadFilesName: string;
  }>({
    question: '',
    isActive: false,
    allowComments: false,
    options: ['', '', '', '', ''],
    uploadFiles: [],
    dueDate: new Date(),
    asset: false,
    uploadFilesName: '',
  });
  const handleChange = (value: any, name?: any) => {
    if (name.startsWith('option')) {
      const index = parseInt(name.replace('option', '')) - 1;
      const newOptions = [...values.current.options];
      newOptions[index] = value;
      values.current.options = newOptions;
    } else {
      values.current = {...values.current, [name]: value};
    }
  };
  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };
    console.log('checking payload', payload);
    // return
    if (checkEmptyValues(payload, 'files')) {
      loading.current = true;

      const result = await (edit
        ? surveysService.update({...payload}, id)
        : surveysService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Surveys'),
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
        const result = await surveysService.detailByID(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking api response,,,', body);
        if (status) {
          values.current = {
            question: body?.[0]?.question,
            isActive: body?.[0]?.isActive,
            allowComments: body?.[0]?.Comments,
            options: body?.[0]?.options,
            uploadFilesName: body?.[0]?.uploadFilesName,
            uploadFiles: body?.[0]?.uploadFiles,
            dueDate: body?.[0]?.dueDate,
            asset: body?.[0].asset,
          };
          console.log('checking update.', values.current);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);
  // const handleDelete = (index: any, id: any) => {
  //   const confirm = async (value: string) => {
  //     if (value === 'confirm') {
  //       dispatch(deleteAction({ index, id }));
  //       await surveysService.delete(id);
  //     }
  //   };
  //   showAlertWithTwoActions({
  //     title: trans('Delete'),
  //     body: trans('Are you want to delete this survey?'),
  //     onPressAction: confirm,
  //   });
  // };
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    surveysService.delete(id);
  };
  const defaultValue = {
    uploadFiles: values.current?.uploadFiles,
    uploadFilesName: values?.current?.uploadFilesName,
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Surveys Registration')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(5, 20, 20, 20)}}>
          <MultiLineInput
            label={trans('Ask')}
            placeholder={trans('Write the question')}
            name="question"
            defaultValue={values.current.question}
            onChangeText={handleChange}
          />
          <LabelInput
            placeholder={trans('Option 1')}
            name="option1"
            defaultValue={values.current.options[0]}
            onChangeText={value => handleChange(value, 'option1')}
          />
          <LabelInput
            placeholder={trans('Option 2')}
            name="option2"
            defaultValue={values.current.options[1]}
            onChangeText={value => handleChange(value, 'option2')}
          />
          <LabelInput
            placeholder={trans('Option 3')}
            name="option3"
            defaultValue={values.current.options[2]}
            onChangeText={value => handleChange(value, 'option3')}
          />
          <LabelInput
            placeholder={trans('Option 4')}
            name="option4"
            defaultValue={values.current.options[3]}
            onChangeText={value => handleChange(value, 'option4')}
          />
          <LabelInput
            placeholder={trans('Option 5')}
            name="option5"
            defaultValue={values.current.options[4]}
            onChangeText={value => handleChange(value, 'option5')}
          />
          <DateTimeInput
            onChange={value => handleChange(value, 'dueDate')}
            defaultValue={values?.current?.dueDate}
          />
          <ActiveOrDisActive
            label={trans('Activate validity')}
            style={{marginBottom: rs(10)}}
            defaultValue={values.current.isActive}
            name="isActive"
            onChange={handleChange}
          />
          <ActiveOrDisActive
            label={trans('Assets')}
            style={{marginBottom: rs(10)}}
            defaultValue={values.current.asset}
            name="asset"
            onChange={handleChange}
          />
          <UploadImage defaultValue={defaultValue} onChange={handleChange} />
          {edit ? (
            <Button
              text={trans('Eliminate')}
              style={{
                backgroundColor: colors.eliminateBtn,
                ...customMargin(20, 10, 20, 10),
              }}
              textColor={colors.white}
              onPress={handleDelete}
            />
          ) : null}
        </ScrollView>
      </Container>
    </>
  );
};

export default AddUpdateSurveys;
