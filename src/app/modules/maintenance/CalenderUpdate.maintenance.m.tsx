import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {showMessage} from 'react-native-flash-message';
import maintenanceService from '../../services/features/maintenance/maintenance.service';
import {apiResponse} from '../../services/features/api.interface';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/maintenance/maintenance.slice';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import ImagePickerBottomSheet from '../../components/app/ImagePicker.bottomSheet.app.component';
import CameraIcon from '../../assets/icons/Camera.icon';
import IconCircle from '../../components/app/IconCircle.app';
import s3Service from '../../services/features/s3/s3.service';
import {imageValidation} from '../../services/validators/file.validator';
import {useTheme} from '@react-navigation/native';
import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import FillCheckIcon from '../../assets/icons/FillCheck.icon';
import {colors} from '../../assets/global-styles/color.assets';
import {registrationExpensesStyles as styles} from '../bills/styles/registrationExpenses.styles';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import moment from 'moment';
import {config} from '../../../Config';
import Badge from '../../components/app/Badge.app';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const {width} = Dimensions.get('screen');
const UploadImage = ({
  onChange,
  defaultValue,
  edit = false,
}: {
  onChange?: (value: any, name: string) => void;
  defaultValue: any;
  edit?: boolean;
}) => {
  const [images, setImages] = useState<any>(defaultValue || '');
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const success = async (image: any, index?: any) => {
    if (image) {
      const validate = imageValidation(image, trans);
      if (validate) {
        const uploadFile = (value: any) => {
          const updateArray = [...images, value];
          onChange && onChange(updateArray, 'images');
          setImages(updateArray);
        };

        const newFile = Array.isArray(image) ? image[0] : image;
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
          console.log('Link image', fetchImageLink);

          // const payload = {
          //   fileName,
          //   fileUrl: fetchImageLink?.Location,
          //   fileSize: newFile?.size,
          //   fileType: contentType,
          //   fileKey: fetchImageLink?.Key,
          //   show: newFile.path
          // };
          uploadFile(fetchImageLink?.Location);
        } catch (error) {
          console.error('Error uploading file:', error);
          showMessage({message: trans('Upload failed')});
          throw error; // Ensure the error is thrown to handle it outside
        }
      }
    } else {
      const updateArray = [...images];
      updateArray.splice(index, 1);
      console.log('deleting');
      onChange && onChange(updateArray, 'images');
      setImages(updateArray);
    }
  };

  return (
    <View>
      <View style={[styles.uploadContainer, {marginTop: 30}]}>
        <View style={styles.center}>
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
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {marginTop: rs(22), color: colors.primary},
            ]}>
            {trans('Image Upload')}
          </Text>
        </View>
        {!isEmpty(images) && (
          <View style={{flexDirection: 'row', gap: rs(10)}}>
            {images.map((item: any, index: number) => {
              return (
                <View
                  key={index}
                  style={{
                    position: `${'relative'}`,
                    alignSelf: `${'flex-start'}`,
                    marginTop: rs(15),
                  }}>
                  <Image
                    source={{uri: item?.show ? item?.show : item}}
                    style={{height: rs(49), width: rs(49)}}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => success('', index)}
                    style={{
                      position: `${'absolute'}`,
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
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const UpdateMaintenance: React.FC<{
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
  const [fetching, setFetching] = useState(edit ? true : false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedDecade, setSelectedDecade] = useState<any>(null);
  const [key, setKey] = useState<any>(0);
  const [view, setView] = useState('date'); // 'date,'month', 'year', or 'decade'
  const [decades, setDecades] = useState(
    Array.from({length: 11}, (_, i) => `${2001 + i * 10}-${2010 + i * 10}`),
  ); // 'date,'month', 'year', or 'decade'
  const [years, setYears] = useState(
    Array.from({length: 10}, (_, i) => 2021 + i),
  );

  const months = moment.months();
  const startOfMonth = currentDate.startOf('month');
  const daysInMonth = Array.from(
    {length: currentDate.daysInMonth()},
    (_, index) => moment(startOfMonth).add(index, 'days'),
  );
  // "name": "Update  Electricity",
  // "description": "Update Electricity maintenance works",
  // "acquisitionDate": "2023-11-07",
  // "amount": 50000,
  // "cost": 5000,
  // "maintenanceFrequency": "Weekly",
  // "days": [
  //     "Monday",
  //     "Tuesday"
  // ],
  // "asset": true,
  // "images": [
  //     "Update testing testing"
  // ],
  // "note": "update",
  // "registrationDate": true
  const values = useRef<{
    _id: string;
    name: string;
    description: string;
    amount: string;
    cost: string;
    maintenanceFrequency: string;
    acquisitionDate: Date;
    days?: string[];
    asset: boolean;
    images: string;
    note: string;
    registrationDate: boolean;
  }>({
    _id: '',
    name: '',
    description: '',
    amount: '',
    cost: '',
    maintenanceFrequency: '',
    asset: false,
    days: [],
    acquisitionDate: new Date(),
    images: '',
    note: '',
    registrationDate: false,
  });

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await maintenanceService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('Body', body);
        if (status) {
          values.current = {
            _id: body?._id,
            name: body?.name,
            description: body?.description,
            acquisitionDate: body?.acquisitionDate || new Date(),
            amount: body?.amount,
            cost: body?.cost,
            maintenanceFrequency: body?.maintenanceFrequency,
            days: body.days,
            asset: body?.asset || false,
            images: body?.images || ['imageUrl'],
            note: body?.note,
            registrationDate: body?.registrationDate,
          };
          setSelectedDate(moment(body?.acquisitionDate));
          console.log('moment(new Date())', moment());
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);

  const selectSwicthOptions = () => {
    switch (view) {
      case 'date':
        setView('month');
        setKey(key + 1);
        break;
      case 'month':
        setView('year');
        setKey(key + 1);
        break;
      case 'year':
        setView('decade');
        setKey(key + 1);
        break;
      case 'decade':
        setView('date');
        setKey(key + 1);
        break;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.clone().add(1, 'month'));
  };

  const handlePrevYear = () => {
    setCurrentDate(prev => prev.clone().subtract(1, 'year'));
  };

  const handleNextYear = () => {
    setCurrentDate(prev => prev.clone().add(1, 'year'));
  };

  const handleAddDecade = () => {
    setCurrentDate(prev => prev.clone().add(10, 'year'));
    var getdecade: any = getCurrentDecade(true, currentDate?.year() + 10);
    setYears(Array.from({length: 10}, (_, i) => getdecade?.start + i));
    setDecades(
      Array.from(
        {length: 11},
        (_, i) => `${getdecade?.start + i * 10}-${getdecade?.end + i * 10}`,
      ),
    );
  };
  const handleSubtractDecade = () => {
    setCurrentDate(prev => prev.clone().subtract(10, 'year'));
    var getdecade: any = getCurrentDecade(true, currentDate?.year() - 10);
    setYears(Array.from({length: 10}, (_, i) => getdecade?.start + i));
    setDecades(
      Array.from(
        {length: 11},
        (_, i) => `${getdecade?.start + i * 10}-${getdecade?.end + i * 10}`,
      ),
    );
    setView(view);
  };
  const handleAddCentury = () => {
    setCurrentDate(prev => prev.clone().add(100, 'year'));
    var getdecade: any = getCurrentDecade(true, currentDate?.year() + 100);
    setYears(Array.from({length: 10}, (_, i) => getdecade?.start + i));
    setDecades(
      Array.from(
        {length: 11},
        (_, i) => `${getdecade?.start + i * 10}-${getdecade?.end + i * 10}`,
      ),
    );
  };
  const handleSubtractCentury = () => {
    setCurrentDate(prev => prev.clone().subtract(100, 'year'));
    var getdecade: any = getCurrentDecade(true, currentDate?.year() - 100);
    setYears(Array.from({length: 10}, (_, i) => getdecade?.start + i));
    setDecades(
      Array.from(
        {length: 11},
        (_, i) => `${getdecade?.start + i * 10}-${getdecade?.end + i * 10}`,
      ),
    );
    setView(view);
  };
  const handleNextCentury = () => {
    setCurrentDate(prev => prev.clone().add(100, 'year'));
    var getdecade: any = getCurrentDecade(true, currentDate?.year() + 100);
    // setYears(Array.from({length: 10}, (_, i) => getdecade?.start + i));
    setDecades(
      Array.from(
        {length: 11},
        (_, i) => `${getdecade?.start + i * 10}-${getdecade?.end + i * 10}`,
      ),
    );
  };
  const handlePrevCentury = () => {
    setCurrentDate(prev => prev.clone().subtract(100, 'year'));
    var getdecade: any = getCurrentDecade(true, currentDate?.year() - 100);
    // setYears(Array.from({length: 10}, (_, i) => getdecade?.start + i));
    setDecades(
      Array.from(
        {length: 11},
        (_, i) => `${getdecade?.start + i * 10}-${getdecade?.end + i * 10}`,
      ),
    );
    setView(view);
  };

  const handleNextDecade = () => {
    // Update the current date to reflect the next decade
    setCurrentDate(prev => {
      const newDate = prev.clone().add(10, 'year');
      // Calculate the next decade based on the updated date
      const nextDecade: any = getCurrentDecade(true, newDate.year());
      // Set the years and selected decade
      const nextStart = nextDecade.start;
      const nextEnd = nextStart + 9;
      setYears(Array.from({length: 10}, (_, i) => nextStart + i));
      setSelectedDecade(`${nextStart}-${nextEnd}`);
      return newDate; // Return the updated date
    });
  };

  const handlePrevDecade = () => {
    // Update the current date to reflect the previous decade
    setCurrentDate(prev => {
      const newDate = prev.clone().subtract(10, 'year');
      // Calculate the previous decade based on the updated date
      const prevDecade: any = getCurrentDecade(true, newDate.year());
      const prevStart = prevDecade.start;
      const prevEnd = prevStart + 9;
      setYears(Array.from({length: 10}, (_, i) => prevStart + i));
      setSelectedDecade(`${prevStart}-${prevEnd}`);
      return newDate; // Return the updated date
    });
  };

  const handleDateSelect = (dateIndex: any, item: any) => {
    setSelectedDate(item);
    setCurrentDate(currentDate.date(dateIndex + 1).startOf('date'));
  };
  const handleMonthSelect = (monthIndex: any) => {
    console.log(
      "currentDate.month(monthIndex).startOf('month')",
      selectedDate.month(monthIndex + 1),
    );
    var dateNow = selectedDate.month(monthIndex);
    setSelectedDate(dateNow);
    setCurrentDate(currentDate.month(monthIndex).startOf('month'));
    setKey(key + 1);
  };

  const handleYearSelect = (year: any, yearIndex: number) => {
    var dateNow = selectedDate.year(year);
    console.log('date Now year', dateNow, ' ', typeof year, ' ', year);
    setSelectedDate(dateNow);
    setCurrentDate(currentDate.year(year).startOf('month'));
    setKey(key + 1);
  };

  const handleDecadeSelect = (decade: any) => {
    const [startYear] = decade.split('-').map(Number);
    setCurrentDate(currentDate.year(startYear).startOf('month'));
    // Reset to month view or keep it as needed
    // setView('date');
  };

  const checkDecade = (decadeStr: any) => {
    const [startYear, endYear] = decadeStr.split('-').map(Number);

    // Create Moment objects for the start and end of the decade
    const startDate = moment(`${startYear}-01-01`);
    const endDate = moment(`${endYear}-12-31`);

    // Check if the date is within the range
    return currentDate.isBetween(startDate, endDate, null, '[]'); // '[]' includes the endpoints
  };

  const getCurrentDecade: any = (forFunc?: boolean, currentYear: any) => {
    // const currentYear = currentDate.year(); // Get the current year
    const startOfDecade = Math.floor(currentYear / 10) * 10 + 1; // Calculate the start year of the decade
    const endOfDecade = startOfDecade + 9; // Calculate the end year of the decade

    if (forFunc) {
      return {start: startOfDecade, end: endOfDecade};
    } else {
      return `${startOfDecade}-${endOfDecade}`; // Return the decade in "YYYY-YYYY" format
    }
  };

  const {colors} = useTheme() as any;

  const renderPicker = () => {
    switch (view) {
      case 'date':
        return (
          <FlatList
            data={daysInMonth}
            renderItem={({item, index}) => {
              const isSelected =
                selectedDate && selectedDate.isSame(item, 'day');

              const isSelectedCurrent = moment().isSame(item, 'day');
              return (
                <TouchableOpacity
                  style={[
                    styles1.dayContainer,
                    isSelected && styles1.selectedDay,

                    isSelectedCurrent && [
                      styles1.selectedDay,
                      {backgroundColor: 'yellow'},
                    ],
                  ]}
                  onPress={() => handleDateSelect(index, item)}>
                  <Text
                    style={[
                      styles1.dayText,
                      {
                        color: isSelected ? colors.white : colors.black,
                        fontWeight: '600',
                      },
                    ]}>
                    {item.date()}
                  </Text>
                </TouchableOpacity>
              );
            }}
            key={key}
            scrollEnabled={false}
            contentContainerStyle={{
              width: '100%',
            }}
            keyExtractor={item => item.format('YYYY-MM-DD')}
            numColumns={7} // 7 days a week
          />
        );

      case 'month':
        return (
          <FlatList
            data={months}
            contentContainerStyle={{
              width: '100%',
            }}
            key={key}
            scrollEnabled={false}
            numColumns={3}
            renderItem={({item, index}) => {
              const isSelected =
                selectedDate && selectedDate.format('MMMM') == item;
              return (
                <TouchableOpacity
                  style={[
                    styles1.dayContainer,
                    isSelected && styles1.selectedDay,
                  ]}
                  onPress={() => handleMonthSelect(index)}>
                  <Text
                    style={[
                      styles1.dayText,
                      {
                        color: isSelected ? colors.white : colors.black,
                        fontWeight: '600',
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item}
          />
        );

      case 'year':
        return (
          <FlatList
            data={years}
            scrollEnabled={false}
            contentContainerStyle={{
              width: '100%',
            }}
            key={key}
            numColumns={3}
            renderItem={({item, index}) => {
              const isSelected =
                selectedDate && selectedDate.format('YYYY') == item?.toString();
              return (
                <TouchableOpacity
                  style={[
                    styles1.dayContainer,
                    isSelected && styles1.selectedDay,
                  ]}
                  onPress={() => handleYearSelect(item, index)}>
                  <Text
                    style={[
                      styles1.dayText,
                      {
                        color: isSelected ? colors.white : colors.black,
                        fontWeight: '600',
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.toString()}
          />
        );

      case 'decade':
        return (
          <FlatList
            data={decades}
            scrollEnabled={false}
            contentContainerStyle={{
              width: '100%',
            }}
            key={view}
            numColumns={3}
            renderItem={({item}) => {
              const isSelected = checkDecade(item);
              return (
                <TouchableOpacity
                  style={[
                    styles1.dayContainer,
                    isSelected && styles1.selectedDay,
                  ]}
                  onPress={() => handleDecadeSelect(item)}>
                  <Text
                    style={[
                      styles1.dayText,
                      {
                        color: isSelected ? colors.white : colors.black,
                        fontWeight: '600',
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item}
          />
        );

      default:
        return null;
    }
  };

  const onPressSingleForward = () => {
    switch (view) {
      case 'date':
        handleNextMonth();
        break;
      case 'month':
        handleNextYear();
        break;
      case 'year':
        handleNextDecade();
        break;
      case 'decade':
        handleNextCentury();
        break;
    }
  };
  const onPressSingleBackward = () => {
    switch (view) {
      case 'date':
        handlePrevMonth();
        break;
      case 'month':
        handlePrevYear();
        break;
      case 'year':
        handlePrevDecade();
        break;
      case 'decade':
        handlePrevCentury();
        break;
    }
  };
  const onPressDoubleForward = () => {
    switch (view) {
      case 'date':
        handleNextYear();
        break;
      case 'month':
        handleAddDecade();
        break;
      case 'year':
        handleAddCentury();
        break;
      case 'decade':
        break;
    }
  };
  const onPressDoubleBackward = () => {
    switch (view) {
      case 'date':
        handlePrevYear();
        break;
      case 'month':
        handleSubtractDecade();
        break;
      case 'year':
        handleSubtractCentury();
        break;
      case 'decade':
        break;
    }
  };

  const handleChange = (value: any, name: string) => {
    values.current = {...values.current, [name]: value};
  };

  const [loadings, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    let payload: any = {
      ...values.current,
      acquisitionDate: moment(selectedDate).format('YYYY-MM-DD'),
    };
    delete payload._id;

    try {
      let update = await maintenanceService.update(
        payload,
        values.current?._id,
      );
      var {body, message, status} = update;
      if (status) {
        values.current = {
          _id: '',
          name: '',
          description: '',
          amount: '',
          cost: '',
          maintenanceFrequency: '',
          asset: false,
          days: [],
          acquisitionDate: new Date(),
          images: '',
          note: '',
          registrationDate: false,
        };
        navigation.goBack();
        setCurrentDate(moment());
        setSelectedDate(moment());
      } else {
        console.log('Error while updating message: ', message);
        Alert.alert('Error:', message);
      }
    } catch (error) {
      console.log('Error while updating: ', error);
      Alert.alert('Error:', 'Error encountered while updating');
    }
    setLoading(false);
  };

  const options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(selectedDate);
  const formattedDate = date.toLocaleDateString('en-US', options);
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={values.current.name}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
          // rightControl={() => navigation.goBack()}
        />
        {fetching ? (
          <EmptyContent forLoading={fetching} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
            <View
              style={{
                width: '100%',
                height: 55,
                backgroundColor: colors.primary,
                marginBottom: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: 10,
              }}>
              <Text
                style={[
                  typographies(colors).montserratSemibold,
                  {color: '#fff', fontSize: 13},
                ]}>
                {
                  'Select a date to capture maintenance information. Frequency type:'
                }
                <Text
                  style={[
                    typographies(colors).montserratNormal12,
                    {fontSize: 13, color: 'white'},
                  ]}>
                  {' ' + values.current.maintenanceFrequency}
                </Text>
              </Text>
            </View>

            <View style={styles1.header}>
              {view !== 'decade' && (
                <TouchableOpacity onPress={onPressDoubleBackward}>
                  <Text style={styles1.buttonText}>{`<<`}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onPressSingleBackward}>
                <Text style={styles1.buttonText}>{`<`}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectSwicthOptions()}>
                <View
                  style={{
                    backgroundColor: colors.gray,
                    height: 40,
                    borderRadius: 10,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  {view == 'date' && (
                    <Text style={[typographies(colors).montserratNormal16]}>
                      {currentDate.format('MMMM YYYY')}
                    </Text>
                  )}
                  {view == 'month' && (
                    <Text style={[typographies(colors).montserratNormal16]}>
                      {currentDate.format('YYYY')}
                    </Text>
                  )}
                  {view == 'year' && (
                    <Text style={[typographies(colors).montserratNormal16]}>
                      {selectedDecade ??
                        getCurrentDecade(false, currentDate?.year())}
                    </Text>
                  )}
                  {view == 'decade' && (
                    <Text style={[typographies(colors).montserratNormal16]}>
                      {getCurrentDecade(false, currentDate?.year())}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressSingleForward}>
                <Text style={styles1.buttonText}>{`>`}</Text>
              </TouchableOpacity>
              {view !== 'decade' && (
                <TouchableOpacity onPress={onPressDoubleForward}>
                  <Text style={styles1.buttonText}>{'>>'}</Text>
                </TouchableOpacity>
              )}
            </View>
            {renderPicker()}
            <Text
              style={{fontSize: 16, color: colors.black, marginVertical: 20}}>
              {trans('Selected Date:')} {formattedDate}
            </Text>

            {/* <ActiveOrDisActive
              label={trans('Registration Date')}
              name="asset"
              defaultValue={values.current.registrationDate}
              onChange={handleChange}
            /> */}

            <LabelInput
              label="Description"
              placeholder={trans('Description')}
              name="Description"
              defaultValue={values.current.description}
              onChangeText={handleChange}
              style={{marginTop: 20}}
            />

            <UploadImage
              defaultValue={values.current.images}
              onChange={handleChange}
              edit={edit}
            />
          </ScrollView>
        )}
      </Container>
    </>
  );
};

export default UpdateMaintenance;
const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 25,
    color: colors.black,
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  dayText: {
    fontSize: 16,
  },
  selectedDay: {
    backgroundColor: colors.error1,
    borderRadius: 30,
    // height: 40,
  },
});
