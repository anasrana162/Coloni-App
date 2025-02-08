import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
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
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import UploadIcon from '../../assets/images/svg/uploadIcon.svg';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import amenitiesService from '../../services/features/amenities/amenities.service';
import {apiResponse} from '../../services/features/api.interface';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/amenities/amenities.slice';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {
  imageValidation,
  pdfValidation,
} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import {showMessage} from 'react-native-flash-message';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import documentPicker from '../../packages/document-picker/documentPicker';
import {documentTypes} from '../../packages/document-picker/documentPicker.package';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import PaymentType from '../bills/bottomSheet/PaymentType.bottomSheet';
import Button from '../../components/core/button/Button.core';
import {uriToBlob} from '../../utilities/uriToBlob';
import {colors} from '../../assets/global-styles/color.assets';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
interface valuesInterface {
  paymentType: any;
  amenityName: string;
  description: string;
  price: number;
  maxGuests: number;

  daily: number;
  weekly: number;
  monthly: number;
  annually: number;
  maxReservations: {};
  minDays: number;
  maxDays: number;
  daysBeforeReserve: {};
  startTime: boolean;
  endTime: boolean;
  requestSchedules: {};
  schedules: string;
  additionalCosts: string;
  availableDays: string[];
  eventTypes: string;
  isAsset: boolean;
  currentMonthOnly: boolean;
  approval: boolean;
  media: any;
  //name: '',
  images: any[];
  uploadfile: any[];
  uploadfileName: string;
}
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
    defaultValue?.images?.length > 0
      ? defaultValue.images.map((image: string) => ({show: image}))
      : [],
  );

  const [files, setFiles] = useState<any>(
    defaultValue?.uploadfile?.length > 0
      ? defaultValue.uploadfile.map((file: any) => ({
          fileName: defaultValue.uploadfileName || 'Document',
          fileUrl: file,
          fileSize: file.fileSize || 0,
          fileType: file.fileType || 'unknown',
          show: file,
        }))
      : [],
  );

  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();

  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length >= 1) {
        showMessage({message: trans('Maximum 1 file')});
        return;
      }
      const validate = imageValidation(image, trans);
      if (validate) {
        try {
          const uploadedFiles = await Promise.all(
            image.map(async (file: any) => {
              const newFile = Array.isArray(file) ? file[0] : file;
              const fileName = newFile?.path?.split('/').pop();
              const fileContent = await fetch(newFile.path).then(res =>
                res.blob(),
              );
              const contentType = newFile?.mime || newFile?.type;

              const fetchImageLink = await s3Service.uploadFileToS3(
                'coloni-app',
                fileName,
                fileContent,
                contentType,
              );

              return fetchImageLink?.Location;
            }),
          );

          const updatedImages = [
            ...images,
            ...uploadedFiles.map(url => ({show: url})),
          ];
          setImages(updatedImages);
          onChange &&
            onChange(
              updatedImages.map(item => item.show),
              'images',
            );
        } catch (error) {
          console.error('Error uploading files:', error);
          showMessage({message: trans('Upload failed')});
        }
      }
    } else if (typeof index === 'number') {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
      onChange &&
        onChange(
          updatedImages.map(item => item.show),
          'images',
        );
    }
  };

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
      <Text
        style={[
          typographies(colors).ralewayMedium12,
          {color: colors.primary, marginBottom: rs(10)},
        ]}>
        {trans('Regulations of Use')}
      </Text>

      {!isEmpty(files) && (
        <View style={{gap: rs(10)}}>
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
      <View
        style={[
          globalStyles.rowBetween,
          {alignItems: 'center', marginTop: rs(5)},
        ]}>
        <View>
          <IconCircle
            icon={<CameraIcon />}
            style={{marginTop: rs(25)}}
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
              typographies(colors).ralewayMedium12,
              {color: colors.primary, marginBottom: rs(10)},
            ]}>
            {trans('Image of the amenity')}
          </Text>
        </View>
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
                  source={{uri: item.show}}
                  styles={{height: rs(49), width: rs(49)}}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => success('', index)}
                  style={{
                    position: 'absolute',
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
        ) : (
          <View style={{flexDirection: 'row', gap: 5}}>
            <ImagePreview source={imageLink.demoImage} />
          </View>
        )}
      </View>
    </View>
  );
};

const AvailableDay = ({
  values,
  handleChange,
}: {
  values: any;
  handleChange: (value: any, field: string) => void;
}) => {
  const {t: trans} = useTranslation();
  const [show, setShow] = useState(
    !isEmpty(values.current.availableDays) ? true : false,
  );
  const {colors} = useTheme() as any;
  const [select, setSelected] = useState(values.current.availableDays || []);
  const data = [
    trans('Sunday'),
    trans('Monday'),
    trans('Tuesday'),
    trans('Wednesday'),
    trans('Thursday'),
    trans('Friday'),
    trans('Saturday'),
  ];
  const addAndRemoveItem = (item: string) => {
    const array = [...select];
    const index = (array as any).indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
      setSelected(array);
      handleChange(array, 'availableDays');
    } else {
      (array as any).push(item);
      setSelected(array);
      handleChange(array, 'availableDays');
    }
  };
  return (
    <View style={{marginBottom: rs(15)}}>
      <ActiveOrDisActive
        label={trans('Indicate Available Days')}
        defaultValue={show}
        onChange={(value: boolean) => {
          handleChange([], 'availableDays');
          setShow(value);
          !value && setSelected([]);
        }}
        style={{marginBottom: rs(15)}}
      />
      <View style={{gap: rs(5)}}>
        {show &&
          data.map((item, index: number) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={globalStyles.rowBetween}
                onPress={() => addAndRemoveItem(item)}
                key={index}>
                <Text
                  style={[
                    typographies(colors).ralewayMedium12,
                    {color: colors.primary},
                  ]}>
                  {item}
                </Text>
                <View
                  style={{
                    width: rs(12),
                    height: rs(12),
                    borderRadius: 500,
                    backgroundColor: colors.gray5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {(select as any)?.includes(item) && (
                    <View
                      style={{
                        width: rs(8),
                        height: rs(8),
                        borderRadius: 500,
                        backgroundColor: colors.primary,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};
const AddUpdateAmenities: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string}};
}> = ({
  route: {params: {edit, index, id} = {edit: false, index: -1, id: ''}},
}) => {
  const {t: trans} = useTranslation();
  // const { colors } = useTheme() as any;
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(edit ? true : false);
  const [loadings, setLoadings] = useState<boolean>(false);

  const values = useRef<valuesInterface>({
    paymentType: '',
    amenityName: '',
    description: '',
    price: 0,
    maxGuests: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    annually: 0,
    maxReservations: {},
    minDays: 0,
    maxDays: 0,
    daysBeforeReserve: {},
    startTime: false,
    endTime: false,
    requestSchedules: {},
    schedules: '',
    additionalCosts: '',
    availableDays: [],
    eventTypes: '',
    isAsset: false,
    currentMonthOnly: false,
    approval: false,
    media: [],
    // name: '',
    images: [],
    uploadfile: [],
    uploadfileName: '',
  });

  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    amenitiesService.delete(id);
  };
  const handleChange = (value: any, field?: string, extra?: string) => {
    const oldValues = {...values.current};
    if (extra) {
      values.current = {
        ...oldValues,
        [extra]: {...(values.current as any)[extra], [field as string]: value},
      };
    } else {
      values.current = {...oldValues, [field as string]: value};
    }
  };

  const handleSubmit = async () => {
    setLoadings(true);
    loading.current = true;
    const payload = {
      ...values.current,
      paymentType: values.current.paymentType?._id || '',
      eventTypes: [values.current?.eventTypes],
    };
    // delete payload.maxReservations;
    console.log('checking payload', payload, '  ', id);
    // if (checkEmptyValues(payload)) {
    loading.current = true;
    const result = await (edit
      ? amenitiesService.update({...payload}, id)
      : amenitiesService.create(payload));
    const {status, body, message} = result as apiResponse;
    if (status) {
      edit
        ? dispatch(updateAction({item: body, index, id}))
        : dispatch(addAction(body));
      navigation.goBack();
    } else {
      showAlertWithOneAction({
        title: trans('Alta de Amenidad'),
        body: message,
      });
    }
    loading.current = false;
    // } else {
    //   showAlertWithOneAction({
    //     title: trans('Alta de Amenidad'),
    //     body: 'Please fill-up correctly!',
    //   });
    // }
    setLoadings(false);
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await amenitiesService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking body...', result);
        if (status) {
          values.current = {
            maxReservations: body?.maxReservations,
            daily: body?.maxReservations?.daily,
            weekly: body?.maxReservations?.weekly,
            monthly: body?.maxReservations?.monthly,
            annually: body?.maxReservations?.annually,
            minDays: body?.daysBeforeReserve?.minDays,
            maxDays: body?.daysBeforeReserve?.maxDays,
            daysBeforeReserve: body?.daysBeforeReserve,
            startTime: body?.requestSchedules?.startTime,
            endTime: body?.requestSchedules?.endTime,
            //endTime: false,
            requestSchedules: body?.requestSchedules?.name,
            amenityName: body?.amenityName,
            description: body?.description,
            price: body?.price,
            maxGuests: body?.maxGuests,
            eventTypes: body?.eventTypes[0],
            currentMonthOnly: body?.currentMonthOnly,
            isAsset: body?.isAsset,
            availableDays: body?.availableDays,
            media: body?.media,
            additionalCosts: body?.additionalCosts.name || '',
            paymentType: body?.paymentType,
            approval: body?.approval || false,
            schedules: body?.schedules?.name || '',
            //name: body?.schedules?.name,
            images: body?.images || [],
            uploadfile: body?.uploadfile || [],
            uploadfileName: body?.uploadfileName,
          };
          console.log('checking values of current', values.current);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);

  const defaultValue = {
    images: values.current?.images || '',
    uploadfile: values.current?.uploadfile || '',
    uploadfileName: values?.current?.uploadfileName || '',
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Alta de Amenidad')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={!loading.current ? handleSubmit : () => {}}
        />
        {fetching ? (
          <EmptyContent forLoading={fetching} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
            <PaymentType
              onChange={handleChange}
              defaultValue={values.current?.paymentType}
              ScreenName="Amenity"
            />
            <LabelInput
              placeholder={trans('Name')}
              name="amenityName"
              onChangeText={handleChange}
              defaultValue={values.current?.amenityName}
            />
            <MultiLineInput
              placeholder={trans('Description')}
              style={{marginBottom: rs(10)}}
              name="description"
              onChangeText={handleChange}
              defaultValue={values.current?.description}
            />
            <LabelInput
              placeholder={trans('Price')}
              inputProps={{inputMode: 'numeric'}}
              name="price"
              onChangeText={handleChange}
              // defaultValue={values.current?.price}
              defaultValue={
                values.current?.price ? values.current?.price.toString() : ''
              }
            />
            <LabelInput
              placeholder={trans('Maximum Guests')}
              inputProps={{inputMode: 'numeric'}}
              name="maxGuests"
              onChangeText={handleChange}
              //defaultValue={values.current?.maxGuests}
              defaultValue={
                values.current?.maxGuests
                  ? values.current?.maxGuests.toString()
                  : ''
              }
            />
            <View>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {
                    paddingBottom: rs(7),
                    color: colors.primary,
                    borderBottomWidth: rs(1),
                    borderBottomColor: colors.gray5,
                    marginBottom: rs(10),
                  },
                ]}>
                {trans('Maximum Reservations per Resident') + ':'}
              </Text>
              <View style={globalStyles.rowBetween}>
                <LabelInput
                  label={trans('Day') + ':'}
                  style={globalStyles.flexGrow1}
                  inputProps={{inputMode: 'numeric'}}
                  //defaultValue={values.current?.maxReservations?.daily}
                  defaultValue={
                    values.current?.daily
                      ? values.current?.daily.toString()
                      : ''
                  }
                  onChangeText={(text: string) => handleChange(text, 'daily')}
                />
                <LabelInput
                  label={trans('Week') + ':'}
                  style={globalStyles.flexGrow1}
                  inputProps={{inputMode: 'numeric'}}
                  //defaultValue={values.current?.maxReservations?.weekly}
                  defaultValue={
                    values.current?.weekly
                      ? values.current?.weekly.toString()
                      : ''
                  }
                  onChangeText={(text: string) => handleChange(text, 'weekly')}
                />
              </View>
              <View style={globalStyles.rowBetween}>
                <LabelInput
                  label={trans('Month') + ':'}
                  inputProps={{inputMode: 'numeric'}}
                  //defaultValue={values.current?.maxReservations?.monthly}
                  defaultValue={
                    values.current?.monthly
                      ? values.current?.monthly.toString()
                      : ''
                  }
                  onChangeText={(text: string) => handleChange(text, 'monthly')}
                  style={globalStyles.flexGrow1}
                />
                <LabelInput
                  //defaultValue={values.current?.maxReservations?.annually}
                  defaultValue={
                    values.current?.annually
                      ? values.current?.annually.toString()
                      : ''
                  }
                  label={trans('Year') + ':'}
                  inputProps={{inputMode: 'numeric'}}
                  onChangeText={(text: string) =>
                    handleChange(text, 'annually')
                  }
                  style={globalStyles.flexGrow1}
                />
              </View>
            </View>
            <View>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {
                    paddingBottom: rs(7),
                    color: colors.primary,
                    borderBottomWidth: rs(1),
                    borderBottomColor: colors.gray5,
                    marginBottom: rs(10),
                  },
                ]}>
                {trans('Days in Advance to Reserve') + ':'}
              </Text>
              <View style={globalStyles.rowBetween}>
                <LabelInput
                  label={trans('Minimum')}
                  inputProps={{inputMode: 'numeric'}}
                  defaultValue={
                    values.current?.minDays
                      ? values.current?.minDays.toString()
                      : ''
                  }
                  onChangeText={(text: string) => handleChange(text, 'minDays')}
                  style={globalStyles.flexGrow1}
                />
                <LabelInput
                  label={trans('Maximum')}
                  inputProps={{inputMode: 'numeric'}}
                  //efaultValue={values.current?.annually ?values.current?.annually.toString() : ''}
                  defaultValue={
                    values.current?.maxDays
                      ? values.current?.maxDays.toString()
                      : ''
                  }
                  onChangeText={(text: string) => handleChange(text, 'maxDays')}
                  style={globalStyles.flexGrow1}
                />
              </View>
            </View>
            <View>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {
                    paddingBottom: rs(7),
                    color: colors.primary,
                    borderBottomWidth: rs(1),
                    borderBottomColor: colors.gray5,
                    marginBottom: rs(10),
                  },
                ]}>
                {trans('Schedules/Agenda Blocks')}
              </Text>
              <LabelInput
                label={trans('Name')}
                defaultValue={values.current?.schedules}
                onChangeText={(text: string) => handleChange(text, 'schedules')}
              />
            </View>
            <View>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {
                    paddingBottom: rs(7),
                    color: colors.primary,
                    borderBottomWidth: rs(1),
                    borderBottomColor: colors.gray5,
                    marginBottom: rs(10),
                  },
                ]}>
                {trans('Additional Costs (Optional)') + ':'}
              </Text>
              <LabelInput
                label={trans('Name')}
                defaultValue={values.current?.additionalCosts}
                onChangeText={(text: string) =>
                  handleChange(text, 'additionalCosts')
                }
              />
            </View>
            <View>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {
                    paddingBottom: rs(7),
                    color: colors.primary,
                    borderBottomWidth: rs(1),
                    borderBottomColor: colors.gray5,
                    marginBottom: rs(10),
                  },
                ]}>
                {trans('Event Types (Optional)') + ':'}
              </Text>
              <LabelInput
                label={trans('Name')}
                defaultValue={values.current.eventTypes}
                onChangeText={(text: string) =>
                  handleChange(text, 'eventTypes')
                }
              />
            </View>
            <View>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {
                    paddingBottom: rs(7),
                    color: colors.primary,
                    borderBottomWidth: rs(1),
                    borderBottomColor: colors.gray5,
                    marginBottom: rs(10),
                  },
                ]}>
                {trans('Request Schedules (Optional)') + ':'}
              </Text>
              <View
                style={[
                  globalStyles.rowBetween,
                  {
                    marginBottom: rs(10),
                    borderBottomWidth: rs(1),
                    borderBottomColor: colors.gray5,
                    paddingBottom: rs(10),
                  },
                ]}>
                <ActiveOrDisActive
                  label={trans('Start Time')}
                  style={globalStyles.flexGrow1}
                  defaultValue={values.current?.startTime}
                  onChange={(value: boolean) =>
                    handleChange(value, 'startTime')
                  }
                />
                <ActiveOrDisActive
                  label={trans('End Time')}
                  defaultValue={values.current?.endTime}
                  onChange={(value: boolean) => handleChange(value, 'endTime')}
                  style={globalStyles.flexGrow1}
                />
              </View>
              <ActiveOrDisActive
                label={trans('Automatic Approval')}
                defaultValue={values.current?.approval}
                onChange={(value: boolean) => handleChange(value, 'approval')}
                style={{marginBottom: rs(15)}}
              />
              <ActiveOrDisActive
                label={trans('Current Month Only')}
                defaultValue={values.current?.currentMonthOnly}
                onChange={(value: boolean) =>
                  handleChange(value, 'currentMonthOnly')
                }
                style={{marginBottom: rs(2)}}
              />
              <Text
                style={[
                  typographies(colors).ralewayMedium10,
                  {color: colors.gray3, marginBottom: rs(15)},
                ]}>
                {trans('Not available by default. request activation')}
              </Text>
              <ActiveOrDisActive
                label={trans('Asset')}
                style={{marginBottom: rs(15)}}
                defaultValue={values.current?.isAsset}
                onChange={(value: boolean) => handleChange(value, 'isAsset')}
              />
              <AvailableDay values={values} handleChange={handleChange} />
            </View>
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

export default AddUpdateAmenities;
