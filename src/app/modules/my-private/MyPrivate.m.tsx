import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import CameraIcon from '../../assets/icons/Camera.icon';
import OnlyTextInput from '../../components/core/text-input/OnlyTextInput.core';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {myPrivateStyles as styles} from './styles/myPrivate.styles';
import UploadIcon from '../../assets/images/svg/uploadIcon.svg';
import Button from '../../components/core/button/Button.core';
import CustomSelect from '../../components/app/CustomSelect.app';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import LengthIcon from '../../assets/images/svg/lengthIcon.svg';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {myPrivateEndPoints} from '../../services/features/endpoint.api';
import myprivateService from '../../services/features/myPrivate/myprivate.service';
import {
  imageValidation,
  pdfValidation,
} from '../../services/validators/file.validator';
import {showMessage} from 'react-native-flash-message';

import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import s3Service from '../../services/features/s3/s3.service';
import {storeUserData} from '../../state/features/auth/authSlice';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {uriToBlob} from '../../utilities/uriToBlob';
import streetService from '../../services/features/street/street.service';
import expenseTypesService from '../../services/features/expenseTypes/expenseTypes.service';
import paymentService from '../../services/features/payment/payment.service';
import visitsTypesService from '../../services/features/visitTypes/visitsTypes.service';
import documentsService from '../../services/features/documents/documents.service';
import IconCircle from '../../components/app/IconCircle.app';
import {showAlertWithTwoActions} from '../../utilities/helper';

const ListInput = ({
  label,
  placeholder,
  lists = [],
  rightIcon,
  onChange,
  name,
  isExpenseType,
  colonyId,
  myPrivateData,
}: {
  label?: string;
  placeholder?: string;
  lists?: any[];
  rightIcon?: any;
  name?: any;
  isExpenseType?: any;
  colonyId?: any;
  myPrivateData?: any;
  onChange: (value: any, name: string, runUpdate?: boolean) => {};
}) => {
  const {colors} = useTheme() as any;
  const [items, setItems] = React.useState<any[]>(lists);
  const [newItemName, setNewItemName] = React.useState<String>('');
  const {t: trans} = useTranslation();
  var {userInfo} = customUseSelector(userStates);
  const handleAddItem = async () => {
    if (newItemName.trim() === '') return;

    console.log(newItemName, '  name:', name, ' Added');
    let payload = {};

    switch (name) {
      case 'streetList':
        console.log(newItemName, 'Added street');
        payload = {
          name: newItemName,
          description: 'Nothing was the same',
        };
        break;

      case 'privateExpenditureType':
        payload = {expenseType: newItemName};
        break;

      case 'paymentConcept':
        payload = {
          name: newItemName,
          screen: [
            'income',
            'massive',
            'outstanding',
            'monthCharges',
            'otherIncome',
            'Amenity',
            'annualIncome',
          ],
          colony: colonyId,
        };
        console.log('Payload paymentConcept', payload);
        break;

      case 'frequentVisitType':
        payload = {name: newItemName};
        console.log('Payload frequentVisitType', payload);
        break;
      case 'eventualVisitType':
        payload = {name: newItemName};
        console.log('Payload eventualVisitType', payload);
        break;
      case 'documentTypes':
        payload = {name: newItemName};
        console.log('Payload documentTypes', payload);
        break;
      case 'residentaialDocType':
        payload = {name: newItemName};
        console.log('Payload residentaialDocType', payload);
        break;

      default:
        return;
    }

    try {
      const serviceMap: any = {
        streetList: streetService.create,
        privateExpenditureType: expenseTypesService.create,
        paymentConcept: paymentService.createType,
        frequentVisitType: visitsTypesService.create,
        eventualVisitType: visitsTypesService.createEventual,
        documentTypes: documentsService.documentTypesCreate,
        residentaialDocType: documentsService.residentDocTypesCreate,
      };

      const res = await serviceMap[name](payload);
      console.log(`Res added ${name}:`, res);
      const {body, message, status} = res;

      if (status) {
        const newItem = {
          _id: body?._id,
          [isExpenseType ? 'expenseType' : 'name']: newItemName,
        };
        console.log('item new', body);
        setItems(prevItems => [...prevItems, newItem]);
        setNewItemName('');
        const ids = [...items, newItem].map(item => item?._id);
        console.log('IDS', ids);
        onChange(ids, name, true);
      } else {
        console.log(`Error adding ${name}: `, message);
      }
    } catch (err) {
      console.log(`Error adding ${name}`, err);
    }
  };

  const handleRemoveItem = async (index: any, _id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        try {
          const serviceMap: any = {
            streetList: streetService.delete,
            privateExpenditureType: expenseTypesService.delete,
            paymentConcept: paymentService.deleteType,
            frequentVisitType: visitsTypesService.delete,
            eventualVisitType: visitsTypesService.deleteEventual,
            documentTypes: documentsService.docTypesDelete,
            residentaialDocType: documentsService.residentDocTypesDelete,
          };

          console.log('res delete:', _id);
          const res = await serviceMap[name](_id);
          console.log('res delete:', res);
          const {body, message, status} = res;

          if (status) {
            setItems(prevItems => prevItems.filter((_, i) => i !== index));
            const ids = items
              .filter((_, i) => i !== index)
              .map(item => item?._id);
            console.log('IDS delete', ids);
            onChange(ids, name, true);
          } else {
            console.log(`Error deleting ${name}: `, message);
          }
        } catch (err) {
          console.log(`Error deleting ${name}`, err);
        }
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this ?'),
      onPressAction: confirm,
    });
  };

  return (
    <View style={{marginBottom: rs(13)}}>
      <Text
        style={[typographies(colors).ralewayMedium14, {color: colors.primary}]}>
        {label}
      </Text>
      <View style={styles.listBorder} />
      <View style={globalStyles.rowBetween}>
        <OnlyTextInput
          placeholder={placeholder}
          style={globalStyles.flexGrow1}
          // rightIcon={rightIcon}
          defaultValue={newItemName}
          onChangeText={setNewItemName}
        />
        <TouchableOpacity onPress={handleAddItem}>
          <ImagePreview source={imageLink.addIcon} />
        </TouchableOpacity>
      </View>
      <View style={{gap: rs(4), ...customMargin(14, 0, 0, 6)}}>
        {items.map((item, index: number) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() => handleRemoveItem(index, item?._id)}>
                <ImagePreview
                  source={imageLink.optionIcon}
                  styles={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {...customMargin(0, 0, 3, 0)},
                  {color: colors.gray3},
                ]}>
                {trans(`${item?.name ?? item?.expenseType}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MyPrivate = (props: any) => {
  var {userInfo} = customUseSelector(userStates);

  const {latitude, longitude} = props.route.params ?? {};

  const {colors} = useTheme() as any;
  const navigation = useCustomNavigation();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadMessage2, setUploadMessage2] = useState('');
  const [renderK, setRenderK] = useState(false);
  var [myPrivateData, setMyPrivateData] = useState<any>(null);
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchMyPrivateData();
    }
  }, [isFocused]);

  const fetchMyPrivateData = async () => {
    var result = await myprivateService.list();
    let list = result?.body?.list[0];
    console.log(
      '{...list, length: longitude, latitude}:',
      props.route.params,
      '  ',
      {
        length: longitude == undefined ? list.length : longitude,
        latitude: latitude == undefined ? list?.latitude : latitude,
      },
    );

    console.log('Manage device :', list);
    setMyPrivateData({
      ...list,
      length: longitude == undefined ? list.length : longitude,
      latitude: latitude == undefined ? list?.latitude : latitude,
    });
    setTimeout(() => {
      setRenderK(true);
    });
  };

  const handleFileUpload = async (name: string, LinkName: string) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('File Picked :', res);

      const newFile = Array.isArray(res) ? res[0] : res;
      const fileName = newFile?.name;
      const fileUrl = newFile?.uri || newFile?.fileUrl;

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

        await handleChange([uploadedFileUrl], LinkName);
        await handleChange(fileName, name);
        setUploadMessage2('File uploaded successfully!');
      } else {
        showMessage({message: trans('Upload failed')});
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setUploadMessage2('Please Uploaded file');
      } else {
        setUploadMessage2('File upload failed. Please try again.');
      }
    }
  };
  const handleChange = async (value: any, name?: any, runUpdate?: boolean) => {
    setImmediate(() => {
      setMyPrivateData((prev: any) => ({...prev, [name]: value}));
      if (runUpdate) {
        handleUpdate(runUpdate, {...myPrivateData, [name]: value});
      }
    });
  };

  const success = async (image: any) => {
    console.log('Data on Image Pick', image);
    const newFile = Array.isArray(image) ? image[0] : image;
    setSelectedImage({uri: newFile?.path});
    let fileName = '';
    let fileContent: any = null; // Placeholder for file content
    let contentType = ''; // Placeholder for content type
    let ext = newFile?.mime;
    let ext2 = newFile?.type;

    if (ext) {
      fileName = newFile?.path?.split('/').pop(); // Use .pop() to get the last segment
      fileContent = await fetch(newFile.path).then(res => res.blob());
      contentType = ext; // Use MIME type as content type
    } else if (ext2) {
      fileName = newFile?.name;
      fileContent = await fetch(newFile.path).then(res => res.blob());
      contentType = ext2; // Use MIME type as content type
    }

    try {
      const fetchImageLink = await s3Service.uploadFileToS3(
        'coloni-app',
        fileName,
        fileContent,
        contentType,
      );

      await handleChange([fetchImageLink?.Location], 'images');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Ensure the error is thrown to handle it outside
    }
  };

  const handleUpdate = async (runUpdate?: any, data?: any) => {
    const fetchID = myPrivateData?._id;
    var obj = runUpdate
      ? data
      : {
          ...myPrivateData,
        };
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    delete obj?._id;
    var putData = await myprivateService.update(obj, fetchID);
    if (putData?.status == true) {
      var new_obj = {
        ...userInfo,
      };
      new_obj.images = obj?.images;
      dispatch(storeUserData(new_obj));
      global.changeState(screens.home);
      if (runUpdate) {
        console.log('Working runUpdate');
        return;
      }
      navigation.navigate(screens.home as never);
    }
  };

  if (renderK) {
    // return;
    return (
      <Container bottomTab={false}>
        <Header
          text={trans('My Private')}
          rightBg={colors.primary}
          rightIcon={<CameraIcon />}
          rightControl={() =>
            global.showBottomSheet({
              flag: true,
              component: ImagePickerBottomSheet,
              componentProps: {success, multiple: true},
            })
          }
        />
        <ScrollView
          contentContainerStyle={{...customPadding(0, 13, 20, 13)}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <ImagePreview
              source={
                !selectedImage
                  ? myPrivateData?.images.length == 0
                    ? imageLink.demoImage
                    : {uri: myPrivateData?.images[0]}
                  : selectedImage
              }
              // source={uri: userInfo?.images[0]}
              styles={{
                height: rs(70),
                width: rs(70),
                marginTop: rs(15),
                borderRadius: 40,
              }}
            />
          </View>
          <LabelInput
            label={'Email'}
            defaultValue={myPrivateData?.email}
            placeholder={'example@admin.com'}
            name={'email'}
            onChangeText={handleChange}
          />
          <LabelInput
            label={'Name'}
            name={'name'}
            onChangeText={handleChange}
            defaultValue={myPrivateData?.name}
          />
          <ListInput
            label={trans('Street List')}
            // placeholder={trans('Name')}
            rightIcon={<DownArrow />}
            lists={myPrivateData?.streetList}
            name="streetList"
            myPrivateData={myPrivateData}
            onChange={handleChange}
          />
          <ListInput
            label={trans('Types of Private Expenditure')}
            rightIcon={<DownArrow />}
            lists={myPrivateData?.privateExpenditureType}
            isExpenseType={true}
            myPrivateData={myPrivateData}
            name="privateExpenditureType"
            onChange={handleChange}
          />
          <ListInput
            label={trans('Resident Payment Concepts')}
            // placeholder={trans('Name')}
            rightIcon={<DownArrow />}
            lists={myPrivateData?.paymentConcept}
            name="paymentConcept"
            myPrivateData={myPrivateData}
            colonyId={myPrivateData?.colony?._id}
            onChange={handleChange}
          />
          <ListInput
            label={trans('Types of Frequent Visit')}
            rightIcon={<DownArrow />}
            myPrivateData={myPrivateData}
            lists={myPrivateData?.frequentVisitType}
            name="frequentVisitType"
            onChange={handleChange}
          />
          <ListInput
            label={trans('Types of Eventual Visit')}
            rightIcon={<DownArrow />}
            myPrivateData={myPrivateData}
            lists={myPrivateData?.eventualVisitType || []}
            name="eventualVisitType"
            onChange={handleChange}
          />
          <ListInput
            label={trans('Documents Types')}
            rightIcon={<DownArrow />}
            myPrivateData={myPrivateData}
            lists={myPrivateData?.documentTypes}
            name="documentTypes"
            onChange={handleChange}
          />
          <ListInput
            label={trans('Types of Resident Documents:')}
            rightIcon={<DownArrow />}
            myPrivateData={myPrivateData}
            lists={myPrivateData?.residentaialDocType}
            name="residentaialDocType"
            onChange={handleChange}
          />
          <LabelInput
            label={trans('Tolerance hours for eventual visits')}
            placeholder="24"
            name="toleranceHours"
            defaultValue={myPrivateData?.toleranceHours}
            onChangeText={handleChange}
          />
          <LabelInput
            label={trans('Maximum Event Guests')}
            placeholder="85"
            name="maxEventGuests"
            defaultValue={myPrivateData?.maxEventGuests}
            onChangeText={handleChange}
          />
          <View style={globalStyles.rowBetween}>
            <LabelInput
              label={trans('Length')}
              labelIcon={<LengthIcon />}
              editable={false}
              style={globalStyles.flexGrow1}
              defaultValue={myPrivateData?.length?.toFixed(4)}
              name="length"
              onChangeText={handleChange}
            />

            <LabelInput
              label={trans('Latitude')}
              labelIcon={<LengthIcon />}
              style={globalStyles.flexGrow1}
              editable={false}
              defaultValue={myPrivateData?.latitude?.toFixed(4)}
              name="latitude"
              onChangeText={handleChange}
            />
            <View
              style={[
                globalStyles.justifyAlignCenter,
                {
                  width: rs(29),
                  height: rs(29),
                  borderRadius: rs(50),
                  backgroundColor: colors.primary,
                },
              ]}>
              <Pressable
                onPress={() => navigation.navigate(screens.customMap as never)}>
                <ImagePreview source={imageLink.locationIcon} />
              </Pressable>
            </View>
          </View>

          <LabelInput
            label={trans('Telephone')}
            defaultValue={myPrivateData?.telephone}
            name="telephone"
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Resident Payment Data')}
            placeholder={trans('Resident Payment Data')}
            defaultValue={myPrivateData?.paymentData}
            name="paymentData"
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Collection Text')}
            placeholder={trans('Collection Text')}
            defaultValue={myPrivateData?.collectionText}
            name="collectionText"
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Resident Name')}
            style={{flexWrap: 'wrap'}}
            placeholder="Vecino {residenteNombre}, tiene {cantidad} pagos pendientes, por un importe de {saldo}. Esperamos contar pronto con su apoyo."
            name="test"
            defaultValue={myPrivateData?.test}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Text of the regulation when sharing QR')}
            placeholder={trans('Text of the regulation when sharing QR')}
            name="regulation"
            defaultValue={myPrivateData?.regulation}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Text when sharing QR')}
            placeholder={trans('Text when sharing QR')}
            name="text"
            defaultValue={myPrivateData?.text}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Visitor Name')}
            placeholder="Estimado: {visitanombre}, tienes un  acceso a la privada {privadanombre}. Proporciona la direccion: {residentedomicilio} y tu nombre."
            name="text2"
            defaultValue={myPrivateData?.text2}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Visitor Event Key')}
            name="eventKey"
            placeholder="EVENT KEY: {visiteventkey}. You are invited to the event {visitaname}, in the private {privadaname}. Provides the Event key"
            defaultValue={myPrivateData?.eventKey}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Commercial Address')}
            placeholder={trans('Commercial address')}
            name="commercialAddress"
            defaultValue={myPrivateData?.commercialAddress}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Not Supportive')}
            name="notSupportive"
            placeholder={trans('Not supportive')}
            defaultValue={myPrivateData?.notSupportive}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Number of Charges for Defaulters')}
            inputProps={{inputMode: 'numeric'}}
            placeholder="2"
            name="noChargesDefaulters"
            defaultValue={myPrivateData?.noChargesDefaulters}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Amount off Charges for Defaulters')}
            inputProps={{inputMode: 'numeric'}}
            placeholder="1000098"
            name="amountChargeDefaulters"
            defaultValue={myPrivateData?.amountChargeDefaulters}
            onChangeText={handleChange}
          />

          <LabelInput
            label={trans('Monthly Fee')}
            inputProps={{inputMode: 'numeric'}}
            placeholder="700"
            name="monthFee"
            defaultValue={myPrivateData?.monthFee}
            onChangeText={handleChange}
          />

          <CustomSelect
            label="Type Payment Fee"
            placeholder="Share"
            data={[
              'Share',
              'Positive',
              'Amenity',
              'Surcharge',
              'Penalty Fee',
              'Card/Tag',
              'Extraordinary Fee',
            ]}
            defaultValue={myPrivateData?.typePaymentFee?.name}
            name="typePaymentFee"
            onChange={handleChange}
          />

          <CustomSelect
            label="Type Payment Advance Installment"
            placeholder="Positive Balance"
            data={[
              'Share',
              'Positive',
              'Amenity',
              'Surcharge',
              'Penalty Fee',
              'Card/Tag',
              'Extraordinary Fee',
              'Balance in Favor',
            ]}
            name="typePaymentInstallment"
            defaultValue={myPrivateData?.typePaymentInstallment?.name}
            onChange={handleChange}
          />

          <CustomSelect
            label="Tip Payment Surcharge"
            placeholder="Surcharge"
            data={[
              'Share',
              'Positive',
              'Amenity',
              'Surcharge',
              'Penalty Fee',
              'Card/Tag',
              'Extraordinary Fee',
            ]}
            defaultValue={myPrivateData?.tipPaymentSurCharge?.name}
            name="tipPaymentSurCharge"
            onChange={handleChange}
          />

          <CustomSelect
            label="Surcharge Type"
            placeholder="Percentage"
            data={['Percentage', 'Amount']}
            defaultValue={myPrivateData?.surchargeType}
            name="surchargeType"
            onChange={handleChange}
          />

          <LabelInput
            label="% Surcharge"
            placeholder="0%"
            name="surcharge"
            defaultValue={myPrivateData?.surcharge}
            onChange={handleChange}
          />

          <LabelInput
            label="Expiration Day"
            placeholder="0"
            name="expDate"
            defaultValue={moment(myPrivateData?.expDate).format('DD/MM/YYYY')}
            onChange={handleChange}
          />

          <LabelInput
            label="Surcharge Label"
            placeholder="Surcharge"
            name="surchargeLabel"
            defaultValue={myPrivateData?.surchargeLabel}
            onChange={handleChange}
          />

          <CustomSelect
            label="Timezone"
            placeholder="America/Monterrey"
            data={[
              'America/Mexico_City',
              'America/Juarez City',
              'America/Cancun',
              'America/Chihuahua',
              'America/Tijuana',
              'America/Mazatlan',
              'America/Monterrey',
            ]}
            name="timeZone"
            defaultValue={myPrivateData?.timeZone}
            onChange={handleChange}
          />
          <View>
            <ActiveOrDisActive
              label="Manage Devices"
              name="manageDevice"
              defaultValue={myPrivateData?.manageDevice}
              onChange={handleChange}
            />
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.gray3, marginTop: rs(15)},
              ]}>
              {trans("You can now manage the resident's devices in Extras")}
              {'>'}
              {trans('Residents')}
            </Text>
          </View>
          <View
            style={[
              globalStyles.rowBetween,
              {marginTop: 30, marginBottom: 10},
            ]}>
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.primary},
              ]}>
              {trans('General Regulations')}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                width: '70%',
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                onPress={() =>
                  handleFileUpload('generalRegulationName', 'generalRegulation')
                }
                activeOpacity={0.6}
                style={[
                  globalStyles.justifyAlignCenter,
                  {
                    height: rs(35),
                    width: rs(35),
                    borderRadius: rs(35),
                    backgroundColor: colors.gray5,
                    marginRight: 10,
                  },
                ]}>
                {myPrivateData?.generalRegulationName ? (
                  <ImagePreview
                    source={imageLink.pdfIcon}
                    styles={{
                      height: rs(40),
                      width: rs(40),
                      borderRadius: 500,
                    }}
                    borderRadius={500}
                  />
                ) : (
                  <UploadIcon />
                )}
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={[
                  typographies(colors).ralewayMedium14,
                  {color: colors.primary, width: '60%'},
                ]}>
                {myPrivateData?.generalRegulationName}
              </Text>
            </View>
          </View>
          {uploadMessage ? ( //  show message file upload
            <Text style={{color: colors.success, marginTop: rs(10)}}>
              {uploadMessage}
            </Text>
          ) : null}

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: rs(12),
            }}>
            <View style={{width: '50%'}}>
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  globalStyles.flexShrink1,
                  {color: colors.primary},
                ]}
                numberOfLines={2}>
                {trans('Terms and Conditions for online payment')}
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => handleFileUpload('tosFileName', 'tosFile')} /// file upload
                activeOpacity={0.6}
                style={[
                  globalStyles.justifyAlignCenter,
                  {
                    height: rs(35),
                    width: rs(35),
                    borderRadius: rs(35),
                    backgroundColor: colors.gray5,
                    marginRight: 10,
                  },
                ]}>
                {myPrivateData?.tosFileName ? (
                  <ImagePreview
                    source={imageLink.pdfIcon}
                    styles={{
                      height: rs(40),
                      width: rs(40),
                      borderRadius: 500,
                    }}
                    borderRadius={500}
                  />
                ) : (
                  <UploadIcon />
                )}
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={[
                  typographies(colors).ralewayMedium14,
                  {color: colors.primary, width: '60%'},
                ]}>
                {myPrivateData?.tosFileName}
              </Text>
            </View>
          </View>

          {uploadMessage2 ? ( //  show message file upload
            <Text style={{color: colors.success, marginTop: rs(10)}}>
              {uploadMessage2}
            </Text>
          ) : null}
          <Button
            onPress={() => handleUpdate()}
            text={trans('Update')}
            style={{marginTop: rs(22)}}
          />
        </ScrollView>
      </Container>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    );
  }
};

export default MyPrivate;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
