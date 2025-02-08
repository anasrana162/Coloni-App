import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customPadding,
  globalStyles,
  customMargin,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {SurveillanceStates, userStates} from '../../state/allSelector.state';
import {apiResponse} from '../../services/features/api.interface';
import SurveillanceServices from '../../services/features/Surveillance/Surveillance.services';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/Surveillance/Surveillance.slice';
import {useCustomNavigation} from '../../packages/navigation.package';
import Button from '../../components/core/button/Button.core';
import LoadingComp from './Components/LoadingComp';
const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue?: any;
  edit?: boolean;
}) => {
  const [images, setImages] = useState<any>(defaultValue || []);
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  useEffect(() => {
    setImages(defaultValue || []);
  }, [defaultValue]);
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
            <ImagePreview source={imageLink.demoImage} />
          </View>
        )}
      </View>
    </View>
  );
};
interface RadioButtonGroupProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  heading: string;
}
const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  heading,
}) => {
  const {t: trans} = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => onSelect(option)}>
          <View style={styles.radioButton}>
            {selectedValue === option && <View style={styles.selectedDot} />}
          </View>
          <Text style={styles.optionText}>{trans(option)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const AddSurveillanceCameraOptional: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string; item: any}};
}> = ({
  route: {params: {edit, index, id, item} = {edit: false, index: -1, id: ''}},
}) => {
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const [loadings, setLoading] = useState(false);
  const {list} = customUseSelector(SurveillanceStates);
  const [device, setDevice] = useState('');
  const values = useRef<{
    name: string;
    device: string;
    description: string;
    webhost: string;
    delay: number;
    localhost: string;
    asset: boolean;
    residentTypePermit: string;
    images: any;
  }>({
    name: '',
    device: '',
    description: '',
    webhost: '',
    delay: 0,
    localhost: '',
    asset: false,
    residentTypePermit: '',
    images: [],
  });
  const generateDevice = () => {
    const itemCount = list.length + 1;
    return `device ${itemCount}`;
  };
  useEffect(() => {
    if (!edit && list?.length >= 0) {
      const newDevice = generateDevice();
      setDevice(device);
      handleChange(newDevice, 'device');
    }
  }, [list, edit]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const handleChange = (value: any, field?: string) => {
    const oldValues = {...values.current};
    values.current = {...oldValues, [field as string]: value};
    if (field === 'device') {
      setDevice(value);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };
    if (checkEmptyValues(payload)) {
      loading.current = true;
      const result = await (edit
        ? SurveillanceServices.update(payload, id)
        : SurveillanceServices.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Survelliance Camera'),
          body: message,
        });
      }
      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Survelliance Camera'),
        body: 'Please fill-up correctly!',
      });
    }
    setLoading(false);
  };

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    let residentTypePermit = '';

    switch (value) {
      case 'Administrator':
        residentTypePermit = 'Administrator';
        break;
      case 'Resident':
        residentTypePermit = 'Resident';
        break;
      case 'Vigilant':
        residentTypePermit = 'Vigilant';
        break;
      default:
        residentTypePermit = '';
    }
    handleChange(residentTypePermit, 'residentTypePermit');
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await SurveillanceServices.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            name: body?.name,
            device: body?.device,
            description: body?.description,
            webhost: body?.webhost,
            delay: body?.delay,
            localhost: body?.localhost,
            asset: body?.asset,
            residentTypePermit: body?.residentTypePermit,
            images: body?.images,
          };
          setSelectedOption(body?.residentTypePermit);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    SurveillanceServices.delete(id);
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Surveillance Camera')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <LabelInput
            placeholder="Device 1"
            style={{...customMargin(0)}}
            label={trans('Device')}
            onChangeText={value => handleChange(value, 'device')}
            defaultValue={device || values?.current?.device}
            editable={false}
          />
          <Text
            style={{
              ...typographies(colors).ralewayMedium12,
              color: colors.gray7,
              ...customMargin(0, 10, 10, 10),
            }}>
            {trans('This camera will be linked to device 1')}
          </Text>
          <LabelInput
            placeholder={trans('Name')}
            label={trans('Name')}
            onChangeText={value => handleChange(value, 'name')}
            defaultValue={values.current.name}
          />
          <MultiLineInput
            placeholder={trans('Description')}
            label={trans('Description')}
            onChangeText={value => handleChange(value, 'description')}
            defaultValue={values.current.description}
          />
          <View style={styles.container}>
            <RadioButtonGroup
              options={['Administrator', 'Resident', 'Vigilant']}
              selectedValue={selectedOption}
              onSelect={handleSelect}
              heading="Resident Type Permit"
            />
          </View>
          <LabelInput
            placeholder={trans('Web Host')}
            label={trans('Web Host')}
            onChangeText={value => handleChange(value, 'webhost')}
            defaultValue={values.current.webhost}
          />
          <LabelInput
            placeholder={trans('Local Host')}
            label={trans('Local Host')}
            onChangeText={value => handleChange(value, 'localhost')}
            defaultValue={values.current.localhost}
          />
          <LabelInput
            placeholder={trans('Delay (Seconds)')}
            label={trans('Delay (Seconds)')}
            inputProps={{inputMode: 'numeric'}}
            onChangeText={value => handleChange(parseFloat(value), 'delay')}
            defaultValue={
              values.current?.delay ? values.current?.delay.toString() : ''
            }
          />
          <ActiveOrDisActive
            label={trans('Asset')}
            style={{marginTop: rs(10)}}
            onChange={value => handleChange(value, 'asset')}
            defaultValue={values.current.asset}
          />
          <UploadImage
            defaultValue={values?.current?.images}
            onChange={handleChange}
            edit={edit}
          />
        </ScrollView>
        {edit ? (
          <Button
            text={trans('Eliminate')}
            style={{
              backgroundColor: colors.eliminateBtn,
              ...customMargin(10, 20, 20, 20),
            }}
            textColor={colors.white}
            onPress={handleDelete}
          />
        ) : null}
      </Container>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 12,
    height: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
  },
});
export default AddSurveillanceCameraOptional;
