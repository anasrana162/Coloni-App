import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextStyle,
  ToastAndroid,
  Image,
  Platform,
} from 'react-native';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {showMessage} from 'react-native-flash-message';
import {apiResponse} from '../../services/features/api.interface';
import {
  checkEmptyValues,
  formatDate,
  showAlertWithOneAction,
} from '../../utilities/helper';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/frequentVisit/frequentVisit.slice';
import {isEmpty} from '../../utilities/helper';
import {customUseDispatch} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import {useTheme} from '@react-navigation/native';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import eventualVisitsVisitlogsService from '../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import DismissVisitServices from '../../services/features/DismissVisits/DismissVisitServices';
const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
  isRemoved = true,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue?: any;
  edit?: boolean;
  isRemoved?: boolean;
}) => {
  const [images, setImages] = useState<string[]>(
    defaultValue && defaultValue.length ? [defaultValue[0]] : [],
  );
  useEffect(() => {
    if (defaultValue?.length > 0) {
      setImages(defaultValue);
    }
  }, [defaultValue]);
  const {colors} = useTheme() as any;
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
                {isRemoved && (
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
                )}
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
const DismissVisitFireVig: React.FC<{
  route: {
    params?: {
      edit: boolean;
      index: number;
      id: string;
      item: any;
    };
  };
}> = ({
  route: {
    params: {edit, index, id, item} = {
      edit: false,
      index: -1,
      id: '',
      item: '',
    },
  },
}) => {
  console.log('myItem', item);
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const [Resident, setResident] = useState('');
  const [Visit, setVisit] = useState('');
  const [date, setDate] = useState('');
  const [profileImg, setProfileImg] = useState([]);

  useEffect(() => {
    const residentInfo = item?.resident?.streetHome;
    // const residentInfo = `${item?.visit?.resident?.street?.name || ''} ${
    //   item?.visit?.resident?.home || ''
    // }`;
    setProfileImg(item?.images);
    setResident(residentInfo);
    setVisit(item?.visitorName || item?.visit?.visitorName);
    setDate(item?.date);
  }, [item]);
  const values = useRef({
    outputNote: '',
    images: item?.images,
    dismiss: item?._id,
  });
  const handleChange = (value: any, field?: string) => {
    const oldValues = {...values.current};
    values.current = {...oldValues, [field as string]: value};
  };
  const handleSubmit = async () => {
    const payload = {
      ...values.current,
      visit: item?.visit?._id,
      visitType: item?.visitType,
      date: date,
    };
    console.log('checking payload', payload);

    loading.current = true;
    const result = await DismissVisitServices.createExit(payload);
    const {status, body, message} = result as apiResponse;

    if (status) {
      {
        Platform.OS === 'android'
          ? ToastAndroid.show(message, ToastAndroid.SHORT)
          : showMessage({
              message: message,
            });
      }
      navigation.goBack();
    } else {
      showAlertWithOneAction({
        title: trans('Dismiss Visit'),
        body: message,
      });
    }
    loading.current = false;
  };
  return (
    <Container>
      <Header text={trans('Dismiss Visit')} />
      {fetching ? (
        <EmptyContent forLoading={fetching} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
          <View style={styles.container}>
            <Image
              source={{uri: profileImg[0]}}
              style={{
                width: rs(80),
                height: rs(80),
                borderRadius: rs(50),
                resizeMode: 'cover',
              }}
            />
            <Text style={[styles.topText, {marginTop: 10}]}>🏠{Resident}</Text>
            <Text style={styles.topText}>{trans('Expected Date')}</Text>
            <Text style={styles.topText}>
              {formatDate(date, 'DD/MM/YYYY hh:mm A')}
            </Text>
          </View>
          <MultiLineInput
            label={trans('Exit Note')}
            defaultValue={values?.current?.outputNote}
            onChangeText={value => handleChange(value, 'outputNote')}
            placeholder="Exit Note"
          />
          <UploadImage
            defaultValue={values?.current?.images}
            onChange={handleChange}
            isRemoved={false}
          />
        </ScrollView>
      )}
      <Button
        onPress={handleSubmit}
        text="Dismiss"
        style={{
          margin: rs(20),
          backgroundColor: colors.primary,
        }}
        textColor={colors.white}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontWeight: 'bold',
    marginBottom: 10,
    ...typographies(colors).ralewayBold15,
    color: colors.primary,
  },
});
export default DismissVisitFireVig;
