import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import CustomSelect from '../../components/app/CustomSelect.app';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import UploadIcon from '../../assets/images/svg/uploadIcon.svg';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import moment from 'moment';
import {checkEmptyValues, isEmpty} from '../../utilities/helper';
import documentsService from '../../services/features/documents/documents.service';
import {useCustomNavigation} from '../../packages/navigation.package';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {uriToBlob} from '../../utilities/uriToBlob';
import {showMessage} from 'react-native-flash-message';
import {pdfValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import IconCircle from '../../components/app/IconCircle.app';
import documentPicker from '../../packages/document-picker/documentPicker';
import {documentTypes} from '../../packages/document-picker/documentPicker.package';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const UploadFile = ({
  onChange,
  defaultValue,
  defaultFileName,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
  defaultFileName: string;
  edit?: boolean;
}) => {
  const [files, setFiles] = useState<any>(
    defaultValue[0]
      ? [
          {
            fileName: defaultFileName || 'Document',
            fileUrl: defaultValue,
            show: defaultValue,
          },
        ]
      : [],
  );

  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();

  useEffect(() => {
    setFiles(
      defaultValue[0]
        ? [
            {
              fileName: defaultFileName || 'Document',
              fileUrl: defaultValue,
              show: defaultValue,
            },
          ]
        : [],
    );
  }, [defaultFileName, defaultValue]);

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

          // Sending only URLs in the payload
          const fileUrls = updatedFiles.map(file => file.fileUrl);
          // const fileName = updatedFiles[0]?.fileName

          onChange && onChange(fileUrls, 'uploadfile');
          onChange && onChange(updatedFiles[0]?.fileName, 'uploadfileName');
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
      onChange && onChange('', 'uploadfileName');
    }
  };
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: colors.white,
        marginTop: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // alignSelf: 'center',
      }}>
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
        <View
          style={{
            // width: '0%',
            alignSelf: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red',
          }}>
          {files.map((item: any, index: number) => (
            <View
              style={{
                // width: '50%',
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'flex-end',
                // backgroundColor: colors.gray3,
              }}>
              <Image
                source={imageLink.pdfIcon}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
              <Text
                numberOfLines={1}
                style={[
                  typographies(colors).montserratNormal12,
                  {marginTop: 5, textAlign: 'right', width: '30%'},
                ]}>
                {item?.fileName || defaultFileName}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => documentSuccess('', index)}
                style={{
                  position: `${'absolute'}`,
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

const ResidentAddUpdateDocument: React.FC<{
  route: {
    params?: {
      ResidentName?: string;
      item: any;
      index: number;
      update: boolean;
      resident_id: string;
    };
  };
}> = ({
  route: {
    params: {ResidentName, item, index, update, resident_id} = {
      ResidentName: '',
      item: {},
      index: -1,
      update: false,
      resident_id: '',
    },
  },
}) => {
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();
  const [docTypes, setDocTypes] = useState([]);
  const [loadings, setLoading] = useState(false);

  const [values, setValues] = useState<any>({
    resident: resident_id,
    document: '',
    documentTypes: 'residentDocType',
    qualification: '',
    date: moment().format('YYYY-MM-DD'),
    note: '',
    requestReview: false,
    uploadfile: [],
    uploadfileName: '',
  });

  useLayoutEffect(() => {
    fetchDocumentsType();
    console.log('Item:', item);
    if (update) {
      setValues({
        resident: resident_id,
        document: item?.document,
        documentTypes: 'residentDocType',
        qualification: item?.qualification,
        date:
          moment(item?.date).format('YYYY-MM-DD') ||
          moment().format('YYYY-MM-DD'),
        note: item?.note,
        requestReview: item?.requestReview,
        uploadfile: item?.uploadfile,
        uploadfileName: item?.uploadfileName,
      });
    }
  }, []);

  const fetchDocumentsType = async () => {
    try {
      var types = await documentsService.residentDocumentTypes();
      console.log('types doc residents', types);
      var {body, status} = types;
      if (status) {
        setDocTypes(body);
      } else {
        console.log('Unable to fetch docs');
      }
    } catch (error) {
      console.log('Error fetching resident doc types', error);
    }
  };

  const handleChange = (value: any, name: string) => {
    setValues((prev: any) => ({...prev, [name]: value}));
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log('Values', values);
    let payload = {
      ...values,
      document: values?.document?._id,
    };
    // return
    if (checkEmptyValues(values)) {
      try {
        let resp = update
          ? await documentsService.update(payload, item?._id)
          : await documentsService.create(payload);
        console.log('resp Submitiing Document', resp);
        navigation.goBack();
      } catch (error) {
        if (update) {
          Alert.alert(trans('Error'), trans('Error updating document'));
        } else {
          console.log('Error submiting document', error);
          Alert.alert(trans('Error'), trans('Error submiting document'));
        }
      }
    } else {
      Alert.alert(trans('Error'), trans('Missing data in feilds'));
    }
    setLoading(false);
  };
  function isObject(variable: any) {
    return variable !== null && typeof variable === 'object';
  }
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={ResidentName || ''}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={() => handleSubmit()}
        />
        <ScrollView
          style={{...customPadding(20, 20, 0, 20)}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <CustomSelect
            placeholder={trans('Select Option')}
            data={docTypes}
            isDataObject={true}
            defaultValue={trans(
              isObject(values.document)
                ? values.document?.name
                : values.document,
            )}
            onChange={(item: any) => handleChange(item, 'document')}
          />
          <LabelInput
            placeholder={trans('Title')}
            defaultValue={values.qualification}
            onChangeText={(txt: any) => handleChange(txt, 'qualification')}
          />
          <DateTimeInput
            defaultValue={values.date}
            onChange={(date: any) =>
              handleChange(moment(date).format('YYYY-MM-DD'), 'date')
            }
          />
          <MultiLineInput
            placeholder={trans('Note')}
            defaultValue={values.note}
            onChangeText={(txt: any) => handleChange(txt, 'note')}
          />
          <ActiveOrDisActive
            label={trans('Request Review')}
            style={{...customMargin(15, 0, 20)}}
            defaultValue={values?.requestReview}
            onChange={handleChange}
            name="requestReview"
          />
          <UploadFile
            defaultValue={values?.uploadfile}
            defaultFileName={values?.uploadfileName}
            onChange={(item: any, name) => handleChange(item, name)}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default ResidentAddUpdateDocument;
