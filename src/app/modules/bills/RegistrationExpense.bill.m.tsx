/* eslint-disable react-native/no-inline-styles */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import OnlyTextInput from '../../components/core/text-input/OnlyTextInput.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import CustomSwitch from '../../components/core/CustomSwitch.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import CameraIcon from '../../assets/icons/Camera.icon';
import FileIcon from '../../assets/icons/File.icon';
import {registrationExpensesStyles as styles} from './styles/registrationExpenses.styles';
import IconCircle from '../../components/app/IconCircle.app';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ExpensesType from './bottomSheet/ExpensesType.bottomSheet';
import {momentTimezone} from '../../packages/momentTimezone.package';
import useRegistrationExpenses from './hooks/useRegistrationExpense.hook';
import {
  imageValidation,
  pdfValidation,
} from '../../services/validators/file.validator';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {isEmpty} from '../../utilities/helper';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import documentPicker from '../../packages/document-picker/documentPicker';
import {documentTypes} from '../../packages/document-picker/documentPicker.package';
import {showMessage} from 'react-native-flash-message';
import s3Service from '../../services/features/s3/s3.service';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import CustomSelect from '../../components/app/CustomSelect.app';
import {uriToBlob} from '../../utilities/uriToBlob';
import SelectExpenseTypes from './selectExpenseTypes';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import Badge from '../../components/app/Badge.app';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const UploadImage = ({
  onChange,
  defaultValue,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
}) => {
  const [images, setImages] = useState<any>(defaultValue?.images || []);
  const [files, setFiles] = useState<any>([defaultValue?.uploadfile] || []);
  const [fileName, setFileName] = useState<any>(
    [defaultValue?.uploadfileName] || [],
  );
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length >= 2) {
        showMessage({message: trans('Maximum 2 files')});
        return;
      }
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
        const fetchImageLink = await s3Service.uploadFileToS3(
          'coloni-app',
          fileName,
          fileContent,
          contentType,
        );
        console.log('Link image', fetchImageLink);
        uploadFile(fetchImageLink?.Location);
      }
    } else {
      const updateArray = [...images];
      updateArray.splice(index, 1);
      onChange && onChange(updateArray, 'images');
      setImages(updateArray);
    }
  };
  const documentSuccess = async (value: any, index?: any) => {
    if (value) {
      if (files?.length >= 2) {
        showMessage({message: trans('Maximum 2 files')});
        return;
      }
      const validate: any = pdfValidation(value, trans);
      if (validate) {
        const uploadFile = (file: any, fileName: string) => {
          const updateArray = [file];
          onChange && onChange(updateArray, 'uploadfile');
          onChange && onChange(fileName, 'uploadfileName');

          setFileName([fileName]);
        };
        // const newFile = Array.isArray(value) ? value[0] : value;
        // let fileName = '';
        // let fileContent: any = null; // Placeholder for file content
        // let contentType = ''; // Placeholder for content type
        // let ext = newFile?.mime;
        // let ext2 = newFile?.type;

        // if (ext) {
        //   fileName = newFile?.path?.split('/').pop(); // Use .pop() to get the last segment
        //   fileContent = await fetch(newFile.path).then(res => res.blob());
        //   contentType = ext; // Use MIME type as content type
        // } else if (ext2) {
        //   fileName = newFile?.name;
        //   fileContent = await fetch(newFile.path).then(res => res.blob());
        //   contentType = ext2; // Use MIME type as content type
        // }
        const newFile = Array.isArray(value) ? value[0] : value;
        console.log('Files selected', newFile);
        const fileName = newFile?.name;
        const fileUrl = newFile?.uri || newFile?.fileUrl;

        const fileData = await uriToBlob(fileUrl);
        const fetchFileLink = await s3Service.uploadFileToS3(
          'coloni-app',
          fileName,
          fileData,
          newFile?.mime || 'unknown',
        );
        console.log('Link image', fetchFileLink);
        uploadFile(fetchFileLink?.Location, fileName);
      }
    } else {
      onChange && onChange([], 'uploadfile');
      onChange && onChange('', 'uploadfileName');
      setFiles([]);
      setFileName([]);
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
        <View style={styles.center}>
          <IconCircle
            icon={<FileIcon />}
            onPress={() =>
              documentPicker.select({
                success: documentSuccess,
                mediaType: documentTypes.pdf,
                multiple: true,
              })
            }
          />
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {marginTop: rs(22), color: colors.primary},
            ]}>
            {trans('File Upload')}
          </Text>
        </View>
      </View>
      {!isEmpty(images) && (
        <View style={{flexDirection: 'row', gap: rs(10)}}>
          {images.map((item: any, index: number) => (
            <View
              key={index}
              style={{
                position: `${'relative'}`,
                alignSelf: `${'flex-start'}`,
                marginTop: rs(15),
              }}>
              <ImagePreview
                source={{uri: item}}
                styles={{height: rs(49), width: rs(49)}}
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
          ))}
        </View>
      )}
      {!isEmpty(fileName) && (
        <>
          {fileName[0] == '' || fileName[0] == undefined ? null : (
            <View style={{gap: rs(10)}}>
              {console.log(fileName)}
              {fileName.map((item: any, index: number) => (
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
                      {item}
                    </Text>
                  </View>
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
        </>
      )}
    </View>
  );
};
const RegistrationExpense: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string}};
}> = ({
  route: {
    params: {edit, index, id} = {
      edit: false,
      index: -1,
      id: '',
    },
  },
}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const {
    handleSubmit,
    onChange,
    values,
    loading,
    fetching,
    expenseTypes,
    handleDelete,
  } = useRegistrationExpenses(edit, index, id);

  return (
    <>
      {loading && <LoadingComp />}
      <Container statusBarBg={colors.white}>
        <Header
          text={trans('Registration of Expenses')}
          showBg={false}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={!loading ? handleSubmit : undefined}
        />
        {fetching ? (
          <View style={globalStyles.emptyFlexBox}>
            <EmptyContent forLoading={fetching} />
          </View>
        ) : (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{...customPadding(10, 20, 0, 20)}}>
            <SelectExpenseTypes
              placeholder={trans('Expense Type')}
              data={expenseTypes}
              defaultValue={values.expenseType}
              onSelect={(item: any) => onChange(item, 'expenseType')}
            />
            <DateTimeInput
              defaultValue={values.expenseDate}
              onChange={onChange}
              name={'expenseDate'}
              placeholder={momentTimezone().format('DD/MM/YYYY')}
              style={{marginBottom: rs(15)}}
            />
            <OnlyTextInput
              placeholder={trans('Amount')}
              inputProps={{keyboardType: 'numeric'}}
              name={'expenseAmount'}
              defaultValue={values.expenseAmount}
              onChangeText={onChange}
              style={{marginBottom: rs(15)}}
            />
            <OnlyTextInput
              placeholder={trans('Note')}
              name={'note'}
              defaultValue={values.note}
              onChangeText={onChange}
              style={{marginBottom: rs(15)}}
            />
            <View style={styles.middleContainer}>
              <View style={styles.middleTextContainer}>
                <Text
                  style={[
                    typographies(colors).ralewayMedium14,
                    {color: colors.primary},
                  ]}>
                  {trans('Visible Resident')}
                </Text>
                <ActiveOrDisActive
                  defaultValue={values.visibleToResident}
                  onChange={onChange}
                  name={'visibleToResident'}
                />
              </View>
              <View style={styles.middleTextContainer}>
                <Text
                  style={[
                    typographies(colors).ralewayMedium14,
                    {color: colors.primary},
                  ]}>
                  {trans('Made')}
                </Text>
                <ActiveOrDisActive
                  defaultValue={values.made}
                  onChange={onChange}
                  name={'made'}
                />
              </View>
            </View>
            <UploadImage onChange={onChange} defaultValue={values} />

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
                onPress={() => handleDelete(index, id?._id)}
              />
            )}
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default RegistrationExpense;
