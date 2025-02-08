import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Container from '../../../layouts/Container.layout';
import Header from '../../../components/core/header/Header.core';
import ImagePreview from '../../../components/core/ImagePreview.core.component';
import imageLink from '../../../assets/images/imageLink';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {customUseDispatch} from '../../../packages/redux.package';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../../assets/global-styles/color.assets';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import LabelInput from '../../../components/app/LabelInput.app';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {imageValidation} from '../../../services/validators/file.validator';
import s3Service from '../../../services/features/s3/s3.service';
import IconCircle from '../../../components/app/IconCircle.app';
import ImagePickerBottomSheet from '../../../components/app/ImagePicker.bottomSheet.app.component';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
} from '../../../utilities/helper';
import CancelIcon from '../../../assets/images/svg/cancelIcon.svg';
import CameraIcon from '../../../assets/icons/Camera.icon';
import {apiResponse} from '../../../services/features/api.interface';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../../state/features/Assist/AssistsSlice';
import AssistService from '../../../services/features/Assist/Assist.service';
import Button from '../../../components/core/button/Button.core';
const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue?: string[];
  edit?: boolean;
}) => {
  const [images, setImages] = useState<string[]>(
    defaultValue && defaultValue.length ? [defaultValue[0]] : [],
  );
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  useEffect(() => {
    if (defaultValue?.length > 0) {
      setImages(defaultValue);
    }
  }, [defaultValue]);
  console.log('checking image.....', images);
  console.log('checking default value...', defaultValue);
  const success = async (image: any, index?: any) => {
    if (image) {
      if (images.length >= 1) {
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
        const updatedArray = [...images];
        updatedArray.splice(index, 1);
        setImages(updatedArray);
        onChange && onChange(updatedArray, 'images');
      }
    }
  };

  return (
    <View>
      <Text style={[styles.heading, {marginLeft: 10}]}>{trans('Access Image')}</Text>
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
        {images.length > 0 ? (
          <View
            style={{flexDirection: 'row', gap: rs(10), position: 'relative'}}>
            {images.map((item: string, index: number) => (
              <View
                key={index}
                style={{
                  position: 'relative',
                  alignSelf: 'flex-start',
                  marginTop: rs(15),
                }}>
                <ImagePreview
                  source={{uri: item || defaultValue?.[0]}}
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
  options?: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  heading?: string;
}
const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  heading,
}) => {
  const {t: trans} = useTranslation();
  return (
    <View style={{margin: 10}}>
      <View>
        <Text style={styles.heading}>{heading}</Text>
      </View>
      <View style={styles.RadioContainer}>
        {options?.map((option, index) => (
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
    </View>
  );
};

const AddUpdateAssistVig: React.FC<{
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
  const [selectedOption, setSelectedOption] = useState<string>('');
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const values = useRef<{
    name: string;
    note: string;
    accessType: string;
    images: any[];
  }>({
    name: '',
    note: '',
    accessType: '',
    images: [],
  });
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const handleSelect = (value: string) => {
    setSelectedOption(value);
    let AccessType;

    switch (value) {
      case 'Entrance':
        AccessType = 'Entrance';
        break;
      case 'Exit':
        AccessType = 'Exit';
        break;
      default:
        AccessType = '';
    }
    handleChange(AccessType, 'accessType');
  };
  const handleSubmit = async () => {
    const payload = {
      ...values.current,
    };
    if (checkEmptyValues(payload)) {
      loading.current = true;

      const result = await (edit
        ? AssistService.update({...payload}, id)
        : AssistService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Assist'),
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
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await AssistService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking body', body);
        if (status) {
          values.current = {
            name: body?.name,
            note: body?.note,
            accessType: body?.accessType,
            images: body?.images,
          };
          setSelectedOption(body?.accessType);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, [edit, id, navigation]);
  return (
    <Container>
      <Header text={trans('Assits')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        // keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
        <View style={styles.container}>
          <Text style={styles.topText}>
            {trans('CANNOT REGISTER ATTENDANCE')}
          </Text>
        </View>
        <Text style={styles.topText2}>
          {trans(
            'It is very far from your privacy. It is located 8,837.36 km from the private. It must be at least 1,000.00 m',
          )}
        </Text>
        <LabelInput
          placeholder={trans('Write your name')}
          label={trans('Write you name')}
          onChangeText={(value: string) => handleChange(value, 'name')}
          defaultValue={values?.current?.name}
        />
        <RadioButtonGroup
          options={['Entrance', 'Exit']}
          selectedValue={selectedOption}
          onSelect={handleSelect}
          //onChangeText={(value: string) => handleChange(value, 'accessType')}
          heading={trans('Access Type')}
        />
        <UploadImage
          defaultValue={values?.current?.images}
          //defaultValue= {defaultValue}
          onChange={handleChange}
          edit={edit}
        />
        <LabelInput
          style={{marginTop: 10}}
          placeholder={trans('Write a note')}
          label={trans('Write a note')}
          onChangeText={(value: string) => handleChange(value, 'note')}
          defaultValue={values?.current?.note}
        />
      </ScrollView>
      <Button
        text={trans('Register Attendance')}
        style={{backgroundColor: colors.tertiary, margin: rs(20)}}
        onPress={handleSubmit}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.eliminateBtn,
    padding: 10,
    borderRadius: 10,
  },
  RadioContainer: {
    ...customMargin(10, 10, 10, 10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topText: {
    ...typographies(colors).ralewayMedium14,
    color: colors.white,
  },
  topText2: {
    ...typographies(colors).ralewayMedium12,
    padding: 6,
    marginBottom: 10,
    color: colors.primary,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
    ...typographies(colors).ralewayMedium14,
    color: colors.primary,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.gray5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 16,
  },
  radioButton: {
    flexDirection: 'row',
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
    color: colors.gray7,
    //padding:10,
  },
});
export default AddUpdateAssistVig;
