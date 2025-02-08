import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import Container from '../../layouts/Container.layout';
import AmountCard from '../../components/app/AmountCard.app';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import IconCircle from '../../components/app/IconCircle.app';
import CameraIcon from '../../assets/icons/Camera.icon';
import { approvePaymentStyles as styles } from '../bills/styles/approvePayment.styles';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  formatDate,
  isEmpty,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import { apiResponse } from '../../services/features/api.interface';
import { useCustomNavigation } from '../../packages/navigation.package';
import { showMessage } from 'react-native-flash-message';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { momentTimezone } from '../../packages/momentTimezone.package';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import { imageValidation } from '../../services/validators/file.validator';
import s3Service from '../../services/features/s3/s3.service';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import incidentsService from '../../services/features/incidents/incidents.service';
import { colors } from '../../assets/global-styles/color.assets';
import Badge from '../../components/app/Badge.app';
import Button from '../../components/core/button/Button.core';
import { customMargin } from '../../assets/global-styles/global.style.asset';
import OnlyTextInput from '../../components/core/text-input/OnlyTextInput.core';
import CustomSelect from '../../components/app/CustomSelect.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import {
  deleteAction,
  updateAction,
} from '../../state/features/incidents/incidents.slice';
import { userStates } from '../../state/allSelector.state';
import { userRoles } from '../../assets/ts/core.data';

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
  const { colors } = useTheme() as any;
  const { t: trans } = useTranslation();

  const success = async (image: any, index?: any) => {
    if (image) {
      if (images?.length >= 1) {
        showMessage({ message: trans('Maximum 1 file') });
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
          showMessage({ message: trans('Upload failed') });
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
          { alignItems: 'center', marginTop: rs(25) },
        ]}>
        <IconCircle
          icon={<CameraIcon />}
          onPress={() =>
            global.showBottomSheet({
              flag: true,
              component: ImagePickerBottomSheet,
              componentProps: { success, multiple: true },
            })
          }
        />
        {!isEmpty(images) && !edit ? (
          <View
            style={{ flexDirection: 'row', gap: rs(10), position: 'relative' }}>
            {images.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  position: 'relative',
                  alignSelf: 'flex-start',
                  marginTop: rs(15),
                }}>
                <ImagePreview
                  source={{ uri: item }}
                  styles={{ height: rs(49), width: rs(49) }}
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
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <ImagePreview source={imageLink.demoImage} />
          </View>
        )}
      </View>
    </View>
  );
};

const DetailReportedIncidents: React.FC<{
  route: { params: { index: number; item: any; status: string } };
}> = ({
  route: {
    params: { item, index, status },
  },
}) => {
    console.log('checking items ', item);
    const handleDelete = () => {
      const confirm = async (value: string) => {
        if (value === 'confirm') {
          dispatch(deleteAction({ index, id: item._id }));
          incidentsService.delete(item._id);
          navigation.goBack()
        }
      };
      showAlertWithTwoActions({
        title: trans('Delete'),
        body: trans('Are you want to delete this incident?'),
        onPressAction: confirm,
      });
    };
    // const values = useRef<{ affair: string; note: string, status:string }>({ affair: item?.affair, note:item?.note ,status});
    //update code starts from hre
    const values = useRef<any>({});
    const handleChange = (value: any, name?: any) => {
      values.current = { ...values.current, [name]: value };
    };

    console.log('checking handle change', values);

    const { colors } = useTheme() as any;
    const { t: trans } = useTranslation();
    const [loading, setLoading] = useState(true);
    const navigation = useCustomNavigation<any>();
    const dispatch = customUseDispatch();
    const { userInfo } = customUseSelector(userStates);
    const handleSubmit = async () => {
      const payload = {
        ...values.current,
      };
      incidentsService.update({ ...payload }, item?._id);
      dispatch(updateAction({ item: item, index, id: item._id }));
      navigation.goBack();
      console.log('checking payload', payload);
    };

    const modifiedData = useRef<any>({});
    useLayoutEffect(() => {
      if (item?._id) {
        (async () => {
          setLoading(true);
          const result = await incidentsService.details(item._id);
          const { status, body, message } = result as apiResponse;

          if (status) {
            values.current = body;
            modifiedData.current = {
              data: [
                { type: trans('Guy'), value: body?.incidentType },
                {
                  type: trans('Resident'),
                  value: `${body?.resident?.street?.name
                      ? trans(body?.resident?.street?.name)
                      : trans('')
                    } ${trans(body?.resident?.home)}`,
                },
                {
                  type: trans('Day'),
                  value: formatDate(body?.updatedAt, 'DD/MM/YYYY'),
                },
              ],
              affair: body?.affair,
              header: body?.status,
              code: body?.code,
              note: body?.note,
              reviewResponse: body?.reviewResponse,
            };
          } else {
            navigation.goBack();
            showMessage({ message });
          }
          setLoading(false);
        })();
      }
    }, [item?._id]);
    console.log('checking data....');

    return (
      <Container statusBarBg={colors.white}>
        <Header text={trans('Incidents')} showBg={false} />
        {loading ? (
          <EmptyContent forLoading={loading} />
        ) : (
          <ScrollView
            contentContainerStyle={{ ...customPadding(30, 25, 40, 25) }}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always">
            <AmountCard
              amount={modifiedData.current.affair}
              data={modifiedData.current.data}
              header={modifiedData.current.header}
            />
            <View style={reportedIncidents.descriptionTextContainer}>
              <View
                style={{
                  ...globalStyles.flexRow,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium12,
                    color: colors.gray3,
                  }}>
                  {trans('Incident Description')} :
                </Text>
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium12,
                    color: colors.gray3,
                  }}>
                  {modifiedData.current.note}
                </Text>
              </View>
              <View
                style={{
                  ...globalStyles.flexRow,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium12,
                    color: colors.gray3,
                  }}>
                  {trans('Change to Status')} :
                </Text>
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium12,
                    color: colors.gray3,
                  }}>
                  {modifiedData.current.header}
                </Text>
              </View>
              <View
                style={{
                  ...globalStyles.flexRow,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium12,
                    color: colors.gray3,
                  }}>
                  {trans('Incident Code')}:
                </Text>
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium12,
                    color: colors.gray3,
                  }}>
                  {modifiedData.current?.code}
                </Text>
              </View>
            </View>
            <CustomSelect
              placeholder={trans('Change to status')}
              onChange={handleChange}
              defaultValue={values?.current.status}
              name="status"
              data={[trans('Reviewed'), trans('Closed')]}
            />
            <MultiLineInput
              placeholder={trans('Write your review response')}
              name="response"
              defaultValue={
                values?.current.reviewResponse || values?.current.note
              }
              onChangeText={value => handleChange(value, 'response')}
            />
            <UploadImage defaultValue={item?.images} onChange={handleChange} />
            <View style={customPadding(36)}></View>
            <Button
              style={{ ...customMargin(10) }}
              text={
                values?.current?.status === 'Pending'
                  ? trans('Review Incident')
                  : values?.current?.status === 'Reviewed'
                    ? trans('Close')
                    : trans('Close Incident')
              }
              onPress={handleSubmit}
            />
            {userInfo?.role == userRoles?.RESIDENT && <Button
              text="Eliminate"
              style={{ marginTop: rs(20), backgroundColor: '#CE2222' }}
              textColor={colors.white}
              onPress={handleDelete}
            />}
          </ScrollView>
        )}
      </Container>
    );
  };

const reportedIncidents = StyleSheet.create({
  descriptionTextContainer: {
    marginTop: rs(20),
    gap: rs(2),
    ...customPadding(12, 12, 12, 12),
  },
});
export default DetailReportedIncidents;
