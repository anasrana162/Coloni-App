import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import {useTheme} from '@react-navigation/native';
import ImagePreview from '../../../components/core/ImagePreview.core.component';
import imageLink from '../../../assets/images/imageLink';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import ReceiptsBottomSheet from '../bottomSheet/Receipts.bottomSheet';
import ArrowIcon from '../../../assets/images/svg/downArrow.svg';
import UploadIcon from '../../../assets/images/svg/uploadIcon.svg';
import {
  checkEmptyValues,
  formatDate,
  isEmpty,
  showAlertWithOneAction,
} from '../../../utilities/helper';
import {uriToBlob} from '../../../utilities/uriToBlob';
import documentPicker from '../../../packages/document-picker/documentPicker';
import CancelIcon from '../../../assets/images/svg/cancelIcon.svg';
import {documentTypes} from '../../../packages/document-picker/documentPicker.package';
import {pdfValidation} from '../../../services/validators/file.validator';
import s3Service from '../../../services/features/s3/s3.service';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import accountStatusService from '../../../services/features/accountStatus/accountStatus.service';
import {apiResponse} from '../../../services/features/api.interface';
import {updateAction} from '../../../state/features/accountStatus/accountStatus.slice';
import {customUseDispatch} from '../../../packages/redux.package';
import {useCustomNavigation} from '../../../packages/navigation.package';

const UploadImage = ({
  onChange,
  defaultValue,
  onUploadsComplete,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue?: any;
  onUploadsComplete?: () => void;
}) => {
  const {t: trans} = useTranslation();
  const [files, setFiles] = useState<any>(
    defaultValue &&
      defaultValue.uploadFiles &&
      defaultValue.uploadFiles.length > 0
      ? [
          {
            fileName: defaultValue?.uploadFilesName || 'Document',
            fileUrl: defaultValue?.uploadFiles,
            show: defaultValue?.uploadFiles,
          },
        ]
      : [],
  );
  useEffect(() => {
    if (
      defaultValue &&
      defaultValue.uploadFiles &&
      defaultValue.uploadFiles.length > 0
    ) {
      setFiles([
        {
          fileName: defaultValue?.uploadFilesName || 'Document',
          fileUrl: defaultValue?.uploadFiles,
          show: defaultValue?.uploadFiles,
        },
      ]);
    }
  }, [defaultValue]);
  const [uploading, setUploading] = useState(false);
  const {colors} = useTheme() as any;

  const documentSuccess = async (value: any, index?: number) => {
    if (value) {
      if (files.length >= 2) {
        showMessage({message: 'Maximum 2 files'});
        return;
      }
      setUploading(true);
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

          onChange && onChange(fileUrls, 'uploadFiles');
          onChange && onChange(fileName, 'uploadFilesName');

          onUploadsComplete && onUploadsComplete();
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        showMessage({message: 'Upload failed'});
      } finally {
        setUploading(false);
      }
    } else if (typeof index === 'number') {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);

      const fileUrls = updatedFiles.map(file => file.fileUrl);
      onChange && onChange(fileUrls, 'uploadFiles');
    }
  };
  return (
    <View style={{marginTop: rs(25)}}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={[
          globalStyles.flexRow,
          {
            ...customPadding(6, 10, 6, 10),
            borderWidth: rs(1),
            borderColor: colors.white,
            borderRadius: rs(20),
            width: rs(300),
            marginTop: rs(5),
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
          },
        ]}
        onPress={() =>
          documentPicker.select({
            success: documentSuccess,
            mediaType: documentTypes.pdf,
            multiple: true,
          })
        }>
        <View
          style={[
            globalStyles.justifyAlignCenter,
            {
              width: rs(32),
              height: rs(32),
              backgroundColor: colors.gray5,
              borderRadius: rs(50),
              marginRight: rs(8),
            },
          ]}>
          <UploadIcon height={rs(28)} width={rs(28)} />
        </View>
        <Text
          style={[typographies(colors).ralewayMedium10, {color: colors.white}]}>
          {trans('Support File')}
        </Text>
      </TouchableOpacity>

      {!isEmpty(files) && (
        <View style={{gap: rs(10)}}>
          {files.map((item: any, index: number) => (
            <View
              key={index}
              style={{
                position: 'relative',
                marginTop: rs(20),
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
    </View>
  );
};

interface props {
  item: any;
  index: number;
  status: string;
  isAdmin?: boolean; 
  onDataChange: (payload: any) => void;
}
const ListDetails: React.FC<props> = ({
  index,
  item,
  isAdmin, 
  status,
  onDataChange,
}) => {
  const {colors} = useTheme() as any;
  const mediaUrl = item?.resident?.images[0];
  const dispatch = customUseDispatch();
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const values = useRef<{
    uploadFiles: any[];
    uploadFilesName: string;
  }>({
    uploadFiles: [],
    uploadFilesName: '',
  });
  const id = item?._id;
  const calculateProfitLoss = (item: any) => {
    const profitLoss = item?.finalBalance - item?.initialBalance;
    return profitLoss;
  };
  useEffect(() => {
    if (uploadComplete) {
      const payload = {...values.current};

      onDataChange(payload);
    }
  }, [uploadComplete]);
  useLayoutEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const result = await accountStatusService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            uploadFiles: body?.uploadFiles,
            uploadFilesName: body?.uploadFilesName,
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
      } catch (error) {
        console.error('Fetching details failed:', error);
        showMessage({message: 'Error fetching details'});
      } finally {
        setFetching(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, navigation]);
  return (
    <>
      <View
        style={{
          ...customPadding(14, 12, 17, 12),
          borderTopRightRadius: rs(20),
          borderTopLeftRadius: rs(20),
          backgroundColor: colors.primary,
          alignItems: `${'center'}`,
          marginTop: rs(20),
        }}>
        <ImagePreview
          source={mediaUrl ? {uri: mediaUrl} : imageLink.profileImage}
          styles={{
            width: rs(57),
            height: rs(57),
            borderRadius: rs(50),
            borderWidth: rs(5),
            borderColor: colors.white,
          }}
        />
        <Text
          style={[
            typographies(colors).ralewayMedium14,
            {color: colors.white, marginTop: rs(8)},
          ]}>
          {formatDate(item?.period, 'MMM YYYY')}
        </Text>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.white, marginTop: rs(5)},
          ]}>
          {trans('SUMMARY OF MOVEMENTS')}
        </Text>
        <View
          style={[
            globalStyles.rowBetween,
            {
              backgroundColor: colors.white,
              ...customPadding(7, 9, 7, 9),
              borderRadius: rs(10),
              width: `${'100%'}`,
              marginTop: rs(20),
            },
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.black},
            ]}>
            {trans('Initial Balance')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.black},
            ]}>
            ${item?.initialBalance}
          </Text>
        </View>
        <View
          style={[
            globalStyles.rowBetween,
            {
              width: `${'95%'}`,
              marginTop: rs(5),
              borderBottomWidth: rs(1),
              paddingBottom: rs(8),
              borderBottomColor: colors.white,
            },
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            {trans('Income')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            global.showBottomSheet({
              flag: true,
              component: ReceiptsBottomSheet,
              componentProps: {id: id},
            })
          }
          style={[
            globalStyles.rowBetween,
            {
              width: `${'95%'}`,
              marginTop: rs(5),
              borderBottomWidth: rs(1),
              paddingBottom: rs(8),
              borderBottomColor: colors.white,
            },
          ]}>
          <Text
            style={[typographies(colors).ralewayBold10, {color: colors.white}]}>
            {trans('Share')}
          </Text>
          <View style={[globalStyles.flexRow, {gap: rs(4)}]}>
            <Text
              style={[
                typographies(colors).ralewayBold10,
                {color: colors.white},
              ]}>
              ${Math.round(item?.totalIncome)}
            </Text>
            <View style={{transform: [{rotate: '-90deg'}]}}>
              <ArrowIcon />
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={[
            globalStyles.rowBetween,
            {
              width: `${'95%'}`,
              marginTop: rs(5),
              paddingBottom: rs(8),
              borderBottomWidth: rs(1),
              borderBottomColor: colors.white,
            },
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            {trans('Total Income')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            ${item?.totalIncome}
          </Text>
        </View>
        <View
          style={[
            globalStyles.rowBetween,
            {
              width: `${'95%'}`,
              marginTop: rs(5),
              paddingBottom: rs(8),
              borderBottomWidth: rs(1),
              borderBottomColor: colors.white,
            },
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            {trans('Bills')}
          </Text>
        </View>
        <View
          style={[
            globalStyles.rowBetween,
            {
              width: `${'95%'}`,
              marginTop: rs(5),
              paddingBottom: rs(8),
              borderBottomWidth: rs(1),
              borderBottomColor: colors.white,
            },
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            {trans('Total Spends')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            ${item?.totalExpense}
          </Text>
        </View>
        <View
          style={[
            globalStyles.rowBetween,
            {
              width: `${'95%'}`,
              marginTop: rs(5),
              paddingBottom: rs(8),
              borderBottomWidth: rs(1),
              borderBottomColor: colors.white,
            },
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            {trans('Finaly balance')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            ${item?.finalBalance}
          </Text>
        </View>
        <View
          style={[
            globalStyles.rowBetween,
            {
              width: `${'95%'}`,
              marginTop: rs(5),
              paddingBottom: rs(8),
              borderBottomWidth: rs(1),
              borderBottomColor: colors.white,
            },
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            {trans('Profit / Loss')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white},
            ]}>
            ${calculateProfitLoss(item)}
          </Text>
        </View>
        {isAdmin ? (
          <UploadImage
            onChange={handleChange}
            defaultValue={values?.current}
            onUploadsComplete={() => setUploadComplete(true)}
          />
        ) : (
          <View
            style={{
              width: '90%',
              height: 50,
              backgroundColor: colors.gray3,
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginTop: 15,
              paddingHorizontal: 10,
            }}>
            <Text style={typographies(colors).montserratNormal16}>
              {values.current.uploadFilesName}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default ListDetails;
