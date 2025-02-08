import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {themeStates, userStates} from '../../state/allSelector.state';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
} from '../../utilities/helper';
import QrReaderServices from '../../services/features/QrReader/QrReader.Services';
import {apiResponse} from '../../services/features/api.interface';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import {
  addAction,
  updateAction,
  deleteAction,
} from '../../state/features/EventualVisit/EventualVisit.slice';
import {NetworkInfo} from 'react-native-network-info';
import {showMessage} from 'react-native-flash-message';
import ResidentField from '../optional-configuration/Components/ResidentFeild';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import IconCircle from '../../components/app/IconCircle.app';
import {useTheme} from '@react-navigation/native';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import CameraIcon from '../../assets/icons/Camera.icon';
import frequentVisitService from '../../services/features/frequentVisit/frequentVisit.service';
import VisitType from '../frequent-visits/bottomSheet/VisitType.bottomSheet';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import eventualVisitsVisitlogsService from '../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import DateTimeInputField from '../reported-incidents/DateTimeInputFeild';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const IndicateDays = ({
  values,
  handleChange,
}: {
  values: any;
  handleChange: (value: any, field: string) => void;
}) => {
  const {t: trans} = useTranslation();
  const [show, setShow] = useState(values.current.indicateDays);
  const {colors} = useTheme() as any;
  const [select, setSelected] = useState(values.current.availableDays || []);

  const data = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const addAndRemoveItem = (item: string) => {
    const array = [...select];
    const index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    setSelected(array);
    handleChange(array, 'availableDays');
  };

  return (
    <View style={{marginBottom: rs(15)}}>
      <ActiveOrDisActive
        label={trans('Indicate Days')}
        defaultValue={show}
        onChange={(value: boolean) => {
          setShow(value);
          if (!value) {
            setSelected([]);
            handleChange([], 'availableDays');
          }
          handleChange(value, 'indicateDays');
        }}
        style={{marginBottom: rs(15)}}
      />

      {show && (
        <View style={{gap: rs(5)}}>
          {data.map((item, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={globalStyles.rowBetween}
              onPress={() => addAndRemoveItem(item)}>
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
                {select.includes(item) && (
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
          ))}
        </View>
      )}
    </View>
  );
};
const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue?: any;
  edit?: boolean;
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
  const {theme} = customUseSelector(themeStates);

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
                  styles={{
                    height: rs(49),
                    width: rs(49),
                  }}
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
              source={imageLink.demoImage}
              tintColor={theme == 'dark' ? colors.gray : colors.black}
            />
          </View>
        )}
      </View>
    </View>
  );
};
const AddUpdateEventsVig: React.FC<{
  route: {
    params?: {edit: boolean; index: number; id: string; screenName?: string};
  };
}> = ({
  route: {
    params: {edit, index, id, screenName} = {
      edit: false,
      index: -1,
      id: '',
      screenName: 'EventualVisit',
    },
  },
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [ipGateway, setIpGateway] = useState<string>('');
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const {userInfo} = customUseSelector(userStates);

  const dispatch = customUseDispatch();
  const [Residents, setResidents] = useState([]);

  const [ResidentIds, setResidentIds] = useState<any>([]);
  const [fetching, setFetching] = useState(false);
  const values = useRef<{
    visitorName: string;
    authorizes: string;
    marWork: string;
    date: Date;
    note: string;
    resident: any[];
    images: [];
  }>({
    note: '',
    resident: [],
    images: [],
    visitorName: '',
    authorizes: '',
    marWork: '',
    date: new Date(),
  });

  const handleChange = (selectedResident: any) => {
    const isSelected = Residents.some(
      resident => resident?._id === selectedResident._id,
    );
    if (isSelected) {
      const updatedResidents = Residents.filter(
        resident => resident?._id !== selectedResident._id,
      );
      setResidents(updatedResidents);
      values.current.resident = updatedResidents;
    } else {
      const updatedResidents = [...Residents, selectedResident];
      setResidents(updatedResidents);
      values.current.resident = updatedResidents;
    }
  };

  const [loadings, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      resident: values?.current?.resident.map(resident => resident._id), // Send selected IDs
      colony: userInfo?.colony,
      // frequentVisitTypeId: values?.current?.frequentVisitTypeId?._id,
    };

    loading.current = true;
    const result = await (screenName === 'frequent'
      ? edit
        ? frequentVisitService.update(payload, id)
        : frequentVisitService.create(payload)
      : edit
      ? eventualVisitsVisitlogsService.update(payload, id)
      : eventualVisitsVisitlogsService.create(payload));
    const {status, body, message} = result as apiResponse;
    if (status) {
      edit
        ? dispatch(updateAction({item: body, index, id}))
        : dispatch(addAction(body));
      navigation.goBack();
    } else {
      showAlertWithOneAction({
        title: trans('Frequent Visit'),
        body: message,
      });
    }
    loading.current = false;
    setLoading(false);
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await eventualVisitsVisitlogsService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            visitorName: body?.visitorName,
            authorizes: body?.authorizes,
            marWork: body?.marWork,
            date: body?.date,
            note: body?.note,
            resident: body?.resident,
            images: body?.images,
          };
          const residentInfo: string = `${body?.resident?.street?.name || ''} ${
            body?.resident?.home || ''
          }`;
          setResidents(residentInfo);
          setResidentIds(body?.resident?._id);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, [edit, id, navigation, userInfo?._id]);
  // const handleDelete = () => {
  //   dispatch(deleteAction({ index, id: id }));
  //   navigation.goBack();
  //   QrReaderServices.delete(id);
  // };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Eventual Visits')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <ResidentField
            onChange={handleChange} // Directly pass handleChange
            selectedValues={Residents} // Pass selected values to display
            label={trans('Resident')}
          />
          <LabelInput
            placeholder={trans('Enter the name of the Visitor')}
            label={trans('Enter the name of the Visitor')}
            onChangeText={value => handleChange(value, 'visitorName')}
            defaultValue={values?.current?.visitorName}
          />
          <LabelInput
            placeholder={trans('Write Who Authorizes')}
            label={trans('Write Who Authorizes')}
            onChangeText={value => handleChange(value, 'authorizes')}
            defaultValue={values?.current?.authorizes}
          />
          <LabelInput
            placeholder={trans('Labor')}
            label={trans('labor')}
            onChangeText={value => handleChange(value, 'marWork')}
            defaultValue={values?.current?.marWork}
          />
          <DateTimeInputField
            label={trans('Date / Entery Time')}
            defaultValue={values?.current?.date}
            name="date"
            placeholder={trans('Date')}
            onChange={handleChange}
          />
          <LabelInput
            placeholder={trans('Enter Note')}
            label={trans('Enter Note')}
            defaultValue={values?.current?.note}
            onChangeText={value => handleChange(value, 'note')}
          />
          {screenName === 'FrequentVisit' && (
            <VisitType
              ScreenName="frequentVisit"
              // label
              //defaultValue={values?.current.frequentVisitTypeId}
              onChange={handleChange}
              name="frequentVisitTypeId"
            />
          )}
          {screenName === 'FrequentVisit' && (
            <LabelInput
              label={trans('Name')}
              placeholder={trans('Name')}
              //defaultValue={values?.current?.name}
              name="name"
              onChangeText={handleChange}
            />
          )}
          {screenName === 'FrequentVisit' && (
            <ActiveOrDisActive
              label={trans('Asset')}
              defaultValue={values?.current?.asset}
              name="asset"
              onChange={handleChange}
              style={{marginBottom: rs(10)}}
            />
          )}
          {screenName === 'FrequentVisit' && (
            <IndicateDays
              values={values}
              handleChange={handleChange}
              //  defaultValue={values?.current?.indicateDays}
            />
          )}
          <UploadImage
            defaultValue={values?.current?.images}
            onChange={handleChange}
            //   edit={edit}
          />
        </ScrollView>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
    color: colors.gray7,
  },
});

export default AddUpdateEventsVig;
