import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {showMessage} from 'react-native-flash-message';
import maintenanceService from '../../services/features/maintenance/maintenance.service';
import {apiResponse} from '../../services/features/api.interface';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/maintenance/maintenance.slice';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CameraIcon from '../../assets/icons/Camera.icon';
import IconCircle from '../../components/app/IconCircle.app';
import s3Service from '../../services/features/s3/s3.service';
import {imageValidation} from '../../services/validators/file.validator';
import {useTheme} from '@react-navigation/native';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import FillCheckIcon from '../../assets/icons/FillCheck.icon';
import {colors} from '../../assets/global-styles/color.assets';
import {registrationExpensesStyles as styles} from '../bills/styles/registrationExpenses.styles';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import Badge from '../../components/app/Badge.app';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const {width} = Dimensions.get('screen');
const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
  edit?: boolean;
}) => {
  const [images, setImages] = useState<any>(defaultValue || '');
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

const AddUpdateMaintenance: React.FC<{
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
  const loading = useRef(false);
  const [loadings, setLoading] = useState(false);
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const [fetching, setFetching] = useState(edit ? true : false);
  const values = useRef<{
    _id: string;
    name: string;
    description: string;
    amount: string;
    cost: string;
    maintenanceFrequency: string;
    acquisitionDate: Date;
    days?: string[];
    asset: boolean;
    files: any[];
    images: string;
  }>({
    _id: '',
    name: '',
    description: '',
    amount: '',
    cost: '',
    maintenanceFrequency: '',
    asset: false,
    days: [],
    acquisitionDate: new Date(),
    files: [],
    images: '',
  });
  const [maintenanceFrequency, setMaintenanceFrequency] = useState<string>(
    values.current.maintenanceFrequency || '',
  );
  var [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const handleChange = (value: any, name?: any) => {
    if (name === 'maintenanceFrequency') {
      setMaintenanceFrequency(value);
    }
    values.current = {...values.current, [name]: value};
    console.log('handleChange', values.current);
  };
  console.log('edit', edit);

  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };
    delete payload?._id;
    if (checkEmptyValues(payload, 'files')) {
      loading.current = true;
      if (edit == false) {
        if (maintenanceFrequency == 'Weekly') {
          if (selectedWeekDays.length === 0) return;
          const days: string[] = selectedWeekDays.map(day => day);
          console.log('Days', days);
          payload.days = days;
        }
      } else {
        if (maintenanceFrequency == 'Weekly') {
          const days: string[] = selectedWeekDays.map(day => day);
          console.log('Days', days);
          payload.days = [];
          payload.days = days;
        }
      }
      const result = await (edit
        ? maintenanceService.update({...payload}, id)
        : maintenanceService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Maintenance'),
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

  const addWeekDay = (item?: any) => {
    console.log('item receiving', item);
    if (item) {
      setSelectedWeekDays(prevWeekDays => {
        const itemIndex = prevWeekDays.findIndex(
          existingItem => existingItem === item,
        );
        console.log('itemIndex', itemIndex);
        if (itemIndex !== -1) {
          return prevWeekDays.filter((_, index) => index !== itemIndex);
        } else {
          return [...prevWeekDays, item];
        }
      });
    }
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await maintenanceService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            _id: body?._id,
            name: body?.name,
            description: body?.description,
            acquisitionDate: body?.acquisitionDate || new Date(),
            amount: body?.amount,
            cost: body?.cost,
            maintenanceFrequency: body?.maintenanceFrequency,
            days: body.days,
            asset: body?.asset || false,
            files: body?.media || [],
            images: body?.images || 'imageUrl',
          };
          setSelectedWeekDays(body?.days);
          setMaintenanceFrequency(body?.maintenanceFrequency);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        console.log('id', values.current._id);
        // dispatch(deleteAction({ index, id:values?.current?._id }));
        await maintenanceService.delete(values.current._id);
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this maintenance?'),
      onPressAction: confirm,
    });
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Asset Registration')}
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
            {edit === false ? (
              <>
                <LabelInput
                  placeholder={trans('Name')}
                  name="name"
                  defaultValue={values.current.name}
                  onChangeText={handleChange}
                />
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.primary,
                    textAlign: 'center',
                    marginBottom: 20,
                  }}>
                  {values.current.name}
                </Text>
              </>
            )}

            <MultiLineInput
              placeholder={trans('Description')}
              style={{marginBottom: rs(10)}}
              name="description"
              defaultValue={values.current.description}
              onChangeText={handleChange}
            />
            <DateTimeInput
              placeholder={trans('Acquisition Date')}
              name="acquisitionDate"
              defaultValue={values.current.acquisitionDate}
              onChange={handleChange}
            />

            {edit === false && (
              <>
                <CustomSelect
                  data={[
                    trans('Weekly'),
                    trans('Monthly'),
                    trans('Annual'),
                    trans('Fee'),
                  ]}
                  placeholder={trans('Maintenance Frequency')}
                  defaultValue={values.current.maintenanceFrequency}
                  onChange={(value: string) =>
                    handleChange(value, 'maintenanceFrequency')
                  }
                />
                <LabelInput
                  placeholder={trans('Amount')}
                  name="amount"
                  defaultValue={values.current.amount}
                  onChangeText={handleChange}
                  inputProps={{inputMode: 'decimal'}}
                />
                <LabelInput
                  placeholder={trans('Cost')}
                  name="cost"
                  defaultValue={values.current.cost}
                  onChangeText={handleChange}
                  inputProps={{inputMode: 'decimal'}}
                />

                {maintenanceFrequency === 'Weekly' && (
                  <View
                    style={{
                      width: width - 50,
                      marginTop: 20,
                      marginBottom: 20,
                      alignSelf: 'center',
                    }}>
                    {weekdays.map((item, index) => {
                      const matched = selectedWeekDays.filter(
                        (data: any) => data == item,
                      )[0];
                      return (
                        <TouchableOpacity
                          onPress={() => addWeekDay(item)}
                          key={String(index)}
                          style={{
                            width: '100%',
                            paddingVertical: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '600',
                              color: colors.primary,
                            }}>
                            {trans(item)}
                          </Text>
                          {matched !== item ? (
                            <View
                              style={{
                                width: 25,
                                height: 25,
                                borderWidth: 2,
                                borderColor: colors.primary,
                                borderRadius: 30,
                              }}
                            />
                          ) : (
                            <FillCheckIcon
                              width={30}
                              height={30}
                              fill={colors.primary}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            )}
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
                onPress={() => handleDelete(index, id?._id)}
              />
            )}
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default AddUpdateMaintenance;
