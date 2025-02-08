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
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/reportActivity/reportActivity.slice';
import {showMessage} from 'react-native-flash-message';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {useTheme} from '@react-navigation/native';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import reportActivityService from '../../services/features/reportActivity/reportActivity.service';
import CustomSelect from '../../components/app/CustomSelect.app';
import {colors} from '../../assets/global-styles/color.assets';
import Button from '../../components/core/button/Button.core';
import DateTimeInputField from '../reported-incidents/DateTimeInputFeild';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
import {themeStates} from '../../state/allSelector.state';
import moment from 'moment';
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
  const {colors} = useTheme() as any;
  const {theme} = customUseSelector(themeStates);
  const dispatch = customUseDispatch();
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

          setImages(uploadedFiles);

          onChange && onChange(uploadedFiles, 'images');
        } catch (error) {
          console.error('Error uploading files:', error);
          showMessage({message: trans('Upload failed')});
        }
      }
    } else {
      if (typeof index === 'number') {
        const updateArray = [...images];
        updateArray.splice(index, 1);
        setImages(updateArray);
        onChange && onChange(updateArray, 'images');
      }
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
                  source={{uri: item || defaultValue[0]}}
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
            <ImagePreview
              tintColor={theme === 'dark' ? 'white' : 'black'}
              source={imageLink.demoImage}
            />
          </View>
        )}
      </View>
    </View>
  );
};
const AddReportActivity: React.FC<{
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
  const [fetching, setFetching] = useState(false);
  const [loadings, setLoading] = useState(false);

  const values = useRef<{
    type: string;
    name: string;
    date: Date;
    description: string;
    status: string;
    images: any[];
  }>({
    type: '',
    name: '',
    date: new Date(),
    description: '',
    status: '',
    images: [],
  });
  console.log('values', values);
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };
    if (checkEmptyValues(payload)) {
      loading.current = true;

      const result = await (edit
        ? reportActivityService.update({...payload}, id)
        : reportActivityService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Report Activity'),
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
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    reportActivityService.delete(id);
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await reportActivityService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            type: body?.type,
            description: body?.description,
            name: body?.name,
            status: body?.status,
            date: body?.date || new Date(),
            images: body?.images || [],
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans(edit ? 'Report Activityss' : 'Add Report Activity')}
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
            <CustomSelect
              label={trans('Type')}
              data={[trans('General')]}
              defaultValue={values.current.type}
              placeholder={trans('General')}
              onChange={(value: string) => handleChange(value, 'type')}
            />
            <LabelInput
              label={trans('Name')}
              name="name"
              placeholder={trans('Name')}
              onChangeText={handleChange}
              defaultValue={values?.current?.name}
            />
            <DateTimeInputField
              label={trans('Date/Time')}
              defaultValue={values?.current?.date}
              name="date"
              placeholder={trans('Date')}
              onChange={handleChange}
              isReportActivity={true}
            />
            <MultiLineInput
              label={trans('Description Activity')}
              placeholder={trans('Description')}
              defaultValue={values?.current?.description}
              name="description"
              onChangeText={handleChange}
            />
            <CustomSelect
              label={trans('Status')}
              data={[trans('Process'), trans('Finished')]}
              defaultValue={values?.current?.status}
              placeholder={trans('Process')}
              onChange={(value: string) => handleChange(value, 'status')}
            />
            <UploadImage
              defaultValue={values?.current?.images}
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

export default AddReportActivity;
