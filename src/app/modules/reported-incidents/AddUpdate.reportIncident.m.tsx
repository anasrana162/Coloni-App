/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useTranslation} from 'react-i18next';
import AskIcon from '../../assets/images/svg/ask.svg';
import AchivementIcon from '../../assets/images/svg/achivement.svg';
import MediumIcon from '../../assets/images/svg/medium.svg';
import SuggestionIcon from '../../assets/images/svg/sugesstion.svg';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {
  checkEmptyValues,
  showAlertWithOneAction,
  isEmpty,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import incidentsService from '../../services/features/incidents/incidents.service';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/incidents/incidents.slice';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {showMessage} from 'react-native-flash-message';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {themeStates, userStates} from '../../state/allSelector.state';
import {screens} from '../../routes/routeName.route';
import {userRoles} from '../../assets/ts/core.data';
import {colors} from '../../assets/global-styles/color.assets';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
import Button from '../../components/core/button/Button.core';
const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue?: string[];
  edit?: boolean;
}) => {
  const {theme} = customUseSelector(themeStates);
  const [images, setImages] = useState<string[]>(
    defaultValue && defaultValue.length ? [defaultValue[0]] : [],
  );
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) {
      setImages(defaultValue);
    }
  }, [defaultValue]);
  const success = async (image: any, index?: any) => {
    if (image) {
      const imageArray = Array.isArray(image) ? image : [image];

      if (images?.length >= 1) {
        showMessage({message: trans('Maximum 1 file')});
        return;
      }
      const validate = imageArray.every(img => imageValidation(img, trans));
      if (!validate) {
        console.error('Validation failed for images:', imageArray);
        return;
      }
      if (validate) {
        try {
          const uploadedFiles = await Promise.all(
            imageArray.map(async (file: any) => {
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
        {images.length > 0 ? (
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

const AddUpdateReportIncident: React.FC<{
  route: {
    params?: {
      index?: number;
      edit?: boolean;
      item?: any;
      id: any;
      status: string;
    };
  };
}> = ({
  route: {
    params: {index, item, edit, id, status} = {
      index: -1,
      item: {},
      edit: false,
      id: '',
      status: '',
    },
  },
}) => {
  console.log('checking recieved status..........', item?.status);
  const {t: trans} = useTranslation();
  const {userInfo} = customUseSelector(userStates);
  const {colors} = useTheme() as any;
  const [selectType, setSelectType] = useState<string>();
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const {theme} = customUseSelector(themeStates);

  const types = [
    {icon: <AskIcon />, name: trans('Ask')},
    {icon: <SuggestionIcon />, name: trans('Suggestion')},
    {icon: <MediumIcon />, name: trans('Medium')},
    {icon: <AchivementIcon />, name: trans('Achievement')},
  ];
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation();
  const values = useRef<{affair: string; note: string; images: []}>({
    affair: '',
    note: '',
    images: [],
  });
  const handleChange = (value: string, name?: string) => {
    if (name) {
      values.current = {...values.current, [name]: value};
    }
  };
  const [loadings, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      incidentType: selectType,
      resident: edit ? item?._id : userInfo?._id,
    };

    console.log('Payload:', payload);
    if (checkEmptyValues(payload)) {
      loading.current = true;
      const result = await (edit
        ? incidentsService.update({...payload}, item?._id)
        : incidentsService.create(payload));

      const {status, body, message} = result as apiResponse;

      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id: item._id}))
          : dispatch(addAction(body));
        navigation.navigate(screens.reportedIncidents as never);
      } else {
        showAlertWithOneAction({
          title: trans('Reported incident'),
          body: message,
        });
      }
      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Reported incident'),
        body: 'Please fill-up correctly!',
      });
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await incidentsService.details(item?._id);
        const {status, message, body} = result as apiResponse;
        console.log('body...', body);
        if (status) {
          values.current = {
            affair: body?.affair,
            note: body?.note,
            images: body?.images,
          };
          setSelectType(body?.incidentType);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log('item', item);
  const handleDelete = () => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id: item._id}));
        incidentsService.delete(item._id);
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this incident?'),
      onPressAction: confirm,
    });
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Report Incident')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={!loading.current ? handleSubmit : undefined}
        />
        {fetching ? (
          <EmptyContent forLoading={fetching} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
            <View>
              {(userInfo?.role === userRoles.VIGILANT ||
                userInfo?.role === userRoles.RESIDENT) &&
                edit && (
                  <View style={stylesIncident.topContainer}>
                    <View style={stylesIncident.ActiveContainer}>
                      <Text style={stylesIncident.ActiveText}>
                        {item?.status}
                      </Text>
                    </View>
                  </View>
                )}

              <Text
                style={[
                  typographies(colors).ralewayBold10,
                  {
                    ...customPadding(5, 10, 5, 10),
                    backgroundColor: colors.primary,
                    color: colors.pureWhite,
                    borderRadius: 5,
                    marginBottom: rs(20),
                  },
                ]}>
                {trans('Incident Type')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: rs(20),
                  flexWrap: 'wrap',
                  marginBottom: rs(20),
                }}>
                {types.map((_item, _index: number) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSelectType(_item.name)}
                      key={_index}
                      style={{
                        width: '40%',
                        flexGrow: 1 / 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 9,
                        borderRadius: 10,
                        padding: 5,
                      }}>
                      <View
                        style={{
                          width: selectType === _item.name ? rs(35) : rs(28),
                          height: selectType === _item.name ? rs(35) : rs(28),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth:
                            selectType === _item.name ? 2 : undefined,
                          borderColor:
                            selectType === _item.name
                              ? colors.primary
                              : undefined,
                          backgroundColor:
                            theme === 'dark' ? 'lightgrey' : colors.gray5,
                          borderRadius: 500,
                        }}>
                        {_item.icon}
                      </View>
                      <Text style={typographies(colors).ralewayBold10}>
                        {_item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <LabelInput
                placeholderColor={'grey'}
                // txtInputStyle={{
                //   backgroundColor:
                //     theme === 'dark' ? 'lightgrey' : colors.graySoft,
                // }}
                placeholder={trans('Subject')}
                defaultValue={values.current.affair}
                onChangeText={handleChange}
                name={'affair'}
              />
              <MultiLineInput
                textInputStyle={{
                  backgroundColor:
                    theme === 'dark' ? 'lightgrey' : colors.graySoft,
                }}
                placeholderTextColor="grey"
                placeholder={trans('Note')}
                defaultValue={values.current.note}
                onChangeText={handleChange}
                name={'note'}
              />
              <UploadImage
                defaultValue={values.current.images}
                onChange={handleChange}
                edit={edit}
              />
            </View>
            {userInfo?.role == userRoles?.RESIDENT && edit && (
              <Button
                text="Eliminate"
                style={{
                  marginTop: 40,
                  backgroundColor: '#CE2222',
                  width: 160,
                  alignSelf: 'center',
                }}
                textColor={colors.white}
                onPress={handleDelete}
              />
            )}
          </ScrollView>
        )}
      </Container>
    </>
  );
};
const stylesIncident = StyleSheet.create({
  ActiveContainer: {
    backgroundColor: colors.brightGreen,
    width: 100,
    height: 24,
    // ...customPadding(2, 2, 2, 2),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  ActiveText: {
    ...typographies(colors).ralewayBold10,
    color: colors.white,
  },
  topContainer: {
    marginBottom: 20,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
export default AddUpdateReportIncident;
