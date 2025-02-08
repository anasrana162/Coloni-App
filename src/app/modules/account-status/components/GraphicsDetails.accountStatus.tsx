import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import {
  checkEmptyValues,
  formatDate,
  isEmpty,
  showAlertWithOneAction,
} from '../../../utilities/helper';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import AnimatedCircle from '../../../components/app/AnimatedCircle.app';
import {momentTimezone} from '../../../packages/momentTimezone.package';
import {calculateCash} from '../../../utilities/helper';
import UploadIcon from '../../../assets/images/svg/uploadIcon.svg';
import {uriToBlob} from '../../../utilities/uriToBlob';

import documentPicker from '../../../packages/document-picker/documentPicker';
import CancelIcon from '../../../assets/images/svg/cancelIcon.svg';
import {documentTypes} from '../../../packages/document-picker/documentPicker.package';

import {pdfValidation} from '../../../services/validators/file.validator';
import s3Service from '../../../services/features/s3/s3.service';
import IconCircle from '../../../components/app/IconCircle.app';

import {showMessage} from 'react-native-flash-message';
import accountStatusService from '../../../services/features/accountStatus/accountStatus.service';
import {apiResponse} from '../../../services/features/api.interface';
import {updateAction} from '../../../state/features/expenses/expense.slice';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {customUseDispatch} from '../../../packages/redux.package';
import AnimatedCircleAccountStatus from './IncomeVsExpense.m';
import IncomeVsExpense from './IncomeVsExpense.m';
import RevenueByCatagory from './RevenueByCatagory.m';
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
            borderColor: colors.primary,
            borderRadius: rs(20),
            width: rs(300),
            marginHorizontal: rs(10),
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
          style={[
            typographies(colors).ralewayMedium10,
            {color: colors.primary},
          ]}>
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
const GraphicsDetails: React.FC<props> = ({
  index,
  item,
  status,
  isAdmin, 
  onDataChange,
}) => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [Label, setLabel] = useState<any>(null);
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const [Data, setData] = useState({
    totalIncome: 0,
    incomePercentage: 0,
    totalExpense: 0,
    expensePercentage: 0,
  });

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
  useEffect(() => {
    if (uploadComplete) {
      const payload = {...values.current};

      onDataChange(payload);
    }
  }, [uploadComplete]);
  const handleCategorySelect = ({
    label,
    typeDetails,
  }: {
    label: string;
    typeDetails: any;
  }) => {
    setLabel(label);
    setSelectedCategory(typeDetails);
  };

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
          setData(body);
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
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  return (
    <View>
      <View style={{marginTop: rs(25), alignItems: `${'center'}`}}>
        <Text
          style={[
            typographies(colors).ralewaySemibold20,
            {
              color: colors.primary,
              textAlign: `${'center'}`,
              marginBottom: rs(25),
            },
          ]}>
          {trans('Income vs Expenses')}
        </Text>
        <IncomeVsExpense
          data={Data}
          middleText={momentTimezone().format('MMMM YYYY')}
          bottomText={`Profit ${calculateCash(32800)}`}
          size={rs(202)}
        />
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.flexShrink1,
            {marginTop: rs(25)},
          ]}>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              globalStyles.flexShrink1,
              {
                color: colors.dark,
                ...customPadding(10, 10, 10, 10),
                backgroundColor: colors.tertiary,
                borderRadius: rs(20),
                textAlign: `${'center'}`,
              },
            ]}>
            {' '}
            {`${trans('Income')} ${Math.round(Data?.totalIncome) || 0} (${
              Math.round(Data?.incomePercentage) || 0
            }%)`}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              globalStyles.flexShrink1,
              {
                color: colors.dark,
                ...customPadding(10, 10, 10, 10),
                backgroundColor: colors.gray5,
                borderRadius: rs(20),
                textAlign: `${'center'}`,
              },
            ]}>
            {' '}
            {`${trans('Expense')} ${Math.round(Data?.totalExpense) || 0} (${
              Math.round(Data?.expensePercentage) || 0
            }%)`}
          </Text>
        </View>
      </View>
      <View style={{marginTop: rs(25), alignItems: `${'center'}`}}>
        <Text
          style={[
            typographies(colors).ralewaySemibold20,
            {
              color: colors.primary,
              textAlign: `${'center'}`,
              marginBottom: rs(25),
            },
          ]}>
          {trans('Revenue by Category')}
        </Text>
        <RevenueByCatagory
          size={rs(202)}
          data={Data}
          onCategorySelect={handleCategorySelect}
        />
        {Label || selectedCategory ? (
          <Text
            style={[
              typographies(colors).ralewayMedium12,
              globalStyles.flexShrink1,
              {
                color: colors.dark,
                marginTop: 10,
                ...customPadding(10, 10, 10, 10),
                backgroundColor: colors.tertiary,
                borderRadius: rs(20),
                textAlign: 'center',
              },
            ]}>
            {`${Label || 'Tag/Card'} ${
              selectedCategory?.total || 0
            } (${Math.round(selectedCategory?.percentage || 0)}%)`}
          </Text>
        ) : null}
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
            alignSelf: 'center',
          }}>
          <Text style={typographies(colors).montserratNormal16}>
            {values.current.uploadFilesName}
          </Text>
        </View>
      )}
    </View>
  );
};

export default GraphicsDetails;
