import {View, ScrollView} from 'react-native';
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
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/otherIncome/otherIncome.slice';
import {showMessage} from 'react-native-flash-message';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {useTheme} from '@react-navigation/native';
import {imageValidation} from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import CustomSelect from '../../components/app/CustomSelect.app';
import PaymentType from '../bills/bottomSheet/PaymentType.bottomSheet';
import {userStates} from '../../state/allSelector.state';
import otherIncomeService from '../../services/features/otherIncome/otherIncome.service';
import {screens} from '../../routes/routeName.route';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import moment from 'moment';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
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
  const dispatch = customUseDispatch();
  const {t: trans} = useTranslation();
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await otherIncomeService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this income?'),
      onPressAction: confirm,
    });
  };
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
// interface Media {
//   fileName: string;
//   fileUrl: string;
//   fileSize: number;
//   fileType: string;
//   show?: string;
// }

const AddUpdateOtherIncome: React.FC<{
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

  const [fetching, setFetching] = useState(false);
  const {userInfo} = customUseSelector(userStates);
  const values = useRef<{
    paymentTypeId: any;
    paymentDate: string;
    amount: number;
    dueDate: string;
    note: string;
    status: string;
    residentId: string;
    images: {};
    //files: any[];
  }>({
    paymentTypeId: '',
    paymentDate: moment(new Date()).format('YYYY-MM-DD'),
    dueDate: moment(new Date()).format('YYYY-MM-DD'),
    note: '',
    status: '',
    amount: 0,
    residentId: userInfo?._id,
    images: [],
    //files: [],
  });
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    console.log('Before pay chnage', values.current);
    const payload = {
      ...values.current,
      paymentTypeId: values.current.paymentTypeId?._id,
      amount: parseInt(values.current.amount),
    };
    console.log('checking payload,', payload);
    loading.current = true;

    const result = await (edit
      ? otherIncomeService.update({...payload}, id)
      : otherIncomeService.create(payload));
    const {status, body, message} = result;

    console.log('checking api as response.. ', status, body, message);
    if (status) {
      edit
        ? dispatch(updateAction({item: body, index, id}))
        : dispatch(addAction(body));
      navigation.goBack();
    } else {
      showAlertWithOneAction({
        title: trans('Report Activity'),
        body: 'Something went wrong',
      });
    }
    loading.current = false;
    setLoading(false);
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await otherIncomeService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('checking body,', body);
        if (status) {
          values.current = {
            paymentTypeId: body?.paymentType,
            note: body?.note,
            paymentDate: body?.payDay,
            status: body?.status,
            dueDate: body?.dueDate,
            residentId: body?.createdBy,
            amount: body?.amount,
            images: body?.images,
            // files: body?.media.map((media: Media) => ({
            //   fileName: media.fileName,
            //   fileUrl: media.fileUrl,
            //   fileSize: media.fileSize,
            //   fileType: media.fileType,
            //   show: media.fileUrl,
            // })) || [],
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    otherIncomeService.delete(id);
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans(edit ? 'Edit Other Income' : 'Add Other Income')}
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
            <PaymentType
              label={trans('Payment Type')}
              defaultValue={values?.current?.paymentTypeId}
              onChange={(txt, name) => handleChange(txt, 'paymentTypeId')}
              ScreenName="otherIncome"
            />
            <DateTimeInput
              label={trans('Payment Date')}
              defaultValue={values.current.paymentDate}
              name="paymentDate"
              onChange={handleChange}
            />
            <DateTimeInput
              label={trans('Due Date')}
              defaultValue={values.current.dueDate}
              name="dueDate"
              onChange={handleChange}
            />
            <LabelInput
              label={trans('Amount')}
              defaultValue={values.current.amount}
              name="amount"
              onChangeText={handleChange}
              inputProps={{inputMode: 'decimal'}}
              placeholder="Amount"
            />
            <MultiLineInput
              label={trans('Note')}
              placeholder={trans('Description')}
              defaultValue={values.current.note}
              name="note"
              onChangeText={handleChange}
            />
            <CustomSelect
              data={['Earning', 'To Be Approved', 'Approved']}
              label={trans('Status')}
              defaultValue={values.current.status}
              placeholder={trans('Status')}
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

export default AddUpdateOtherIncome;
