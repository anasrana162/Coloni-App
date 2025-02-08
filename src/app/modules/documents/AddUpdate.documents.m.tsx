import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';

import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import IconCircle from '../../components/app/IconCircle.app';
import UploadIcon from '../../assets/images/svg/uploadIcon.svg';
import {colors} from '../../assets/global-styles/color.assets';
import Button from '../../components/core/button/Button.core';
import {showMessage} from 'react-native-flash-message';
import {apiResponse} from '../../services/features/api.interface';
import documentsService from '../../services/features/documents/documents.service';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {
  updateAction,
  addAction,
  searchingAction,
  deleteAction,
} from '../../state/features/documents/documents.slice';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import documentPicker from '../../packages/document-picker/documentPicker';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {documentTypes} from '../../packages/document-picker/documentPicker.package';
import {useTheme} from '@react-navigation/native';
import {pdfValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import CustomSelect from '../../components/app/CustomSelect.app';
import SearchInput from '../../components/app/SearchInput.app';
import {uriToBlob} from '../../utilities/uriToBlob';
import {userStates} from '../../state/allSelector.state';
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

  const documentSuccess = async (value: any, index?: number) => {
    if (value) {
      if (files.length >= 1) {
        showMessage({message: trans('Maximum 1 file')});
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
const AddUpdateDocuments: React.FC<{
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
  const {userInfo} = customUseSelector(userStates);
  const loading = useRef(false);
  const [fetching, setFetching] = useState(edit ? true : false);
  const [loadings, setLoading] = useState(false);
  const [docTypes, setDocTypes] = useState([]);
  const values: any = useRef<{
    resident: string;
    qualification: string;
    date: Date;
    document: string;
    documentTypes: string;
    note: string;
    requestReview: boolean;
    uploadfile: any[];
    uploadfileName: string;
  }>({
    resident: '',
    qualification: '',
    date: new Date(),
    document: '',
    documentTypes: 'documentType',
    note: '',
    requestReview: false,
    uploadfile: [],
    uploadfileName: '',
  });
  const handleSearch = (text: string) => {
    dispatch(searchingAction({search: text}));
  };
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };

  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      resident: userInfo?._id,
      document: values?.current.document?._id,
    };
    if (checkEmptyValues(payload, 'files')) {
      loading.current = true;

      const result = await (edit
        ? documentsService.update({...payload}, id)
        : documentsService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Documents'),
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
      fetchDocumentTypes();
      if (edit) {
        const result = await documentsService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking the body', status, message, body);
        if (status) {
          values.current = {
            resident: body?.resident,
            note: body?.note,
            document: body?.document,
            documentTypes: body?.documentTypes,
            qualification: body?.qualification,
            date: body?.date || new Date(),
            requestReview: body?.requestReview || false,
            uploadfile: body?.uploadfile,
            uploadfileName: body?.uploadfileName,
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

  const fetchDocumentTypes = async () => {
    try {
      var documents = await documentsService.documentTypes();
      var {status, body, message}: any = documents;
      console.log('documents: ', documents);
      if (status) {
        console.log('Document Type: ', documents);
        setDocTypes(body);
      } else {
        Alert.alert(trans('Error'), trans('Unable to fetch documnet types'));
      }
    } catch (error) {
      Alert.alert(trans('Error'), trans('Unable to fetch documnet types'));
    }
  };

  const handleDelete = () => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        documentsService.delete(id);
        dispatch(deleteAction({index, id: id}));
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this documents?'),
      onPressAction: confirm,
    });
  };
  const defaultValue = {
    uploadfile: values?.current.uploadfile,
    uploadfileName: values?.current?.uploadfileName,
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Documents')}
          rightControl={handleSubmit}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
        />
        {!fetching ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{...customPadding(17, 20, 0, 20)}}>
            <CustomSelect
              placeholder="Bill"
              label={trans('Type')}
              data={docTypes}
              isDataObject={true}
              onChange={(text: any) => handleChange(text, 'document')}
              defaultValue={values.current?.document?.name}
            />

            <LabelInput
              label={trans('Title')}
              defaultValue={values.current?.qualification}
              name="qualification"
              placeholder="January Santander account statement"
              onChangeText={handleChange}
            />
            <DateTimeInput
              label={trans('Date')}
              defaultValue={values.current?.date}
              name="date"
              onChange={handleChange}
            />
            <LabelInput
              label={trans('Note')}
              defaultValue={values.current?.note}
              name="note"
              placeholder="Bank Account Statement February 2023"
              onChangeText={handleChange}
            />
            <ActiveOrDisActive
              label={trans('Request Review')}
              defaultValue={values.current?.requestReview}
              name="requestReview"
              onChange={handleChange}
            />
            <UploadImage
              onChange={handleChange}
              defaultValue={defaultValue}
              edit={edit}
            />

            {edit ? (
              <Button
                text="Eliminate"
                style={{
                  marginVertical: rs(20),
                  backgroundColor: colors.eliminateBtn,
                }}
                textColor={colors.white}
                onPress={handleDelete}
              />
            ) : null}
          </ScrollView>
        ) : (
          <EmptyContent forLoading={fetching} />
        )}
      </Container>
    </>
  );
};

export default AddUpdateDocuments;
