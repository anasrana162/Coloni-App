import {ScrollView, View} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import visitsService from '../../services/features/visits/visits.service';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import {useCustomNavigation} from '../../packages/navigation.package';
import CustomSelect from '../../components/app/CustomSelect.app';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {
  addAction,
  updateAction,
  deleteAction,
} from '../../state/features/visits/visits.slice';
import {showMessage} from 'react-native-flash-message';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {screens} from '../../routes/routeName.route';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import VisitType from '../bills/bottomSheet/visitTypes.bottomSheet';
import eventualVisitsService from '../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const AddVisits: React.FC<{
  route: {params?: {index?: number; edit?: boolean; id?: any; name: string}};
}> = ({
  route: {
    params: {index, id, edit, name} = {
      index: -1,
      id: '',
      edit: false,
      name: '',
    },
  },
}) => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const loading = useRef(false);
  const {userInfo} = customUseSelector(userStates);

  const [loadings, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  // "date": "2024-11-13T16:34",
  // "guest": 25,
  // "multipleGuest": true,
  // "note": "dsad",
  // "resident": "66e812edacebd0b19779987b",
  // "visitType": "671f731db4365ad5fe863790",
  // "visitorName": "Rudyard Ellis"
  const [values, setValues] = useState<{
    visitType: string;
    visitorName: string;
    note: string;
    resident: string;
    date: Date;
    multipleGuest: boolean;
    guest: any;
  }>({
    visitType: '',
    visitorName: '',
    note: '',
    resident: '',
    date: new Date(),
    multipleGuest: false,
    guest: '1',
  });

  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    visitsService.delete(id);
  };
  const handleChange = (value?: any, name?: any) => {
    setValues(prev => ({...prev, [name]: value}));
  };

  const dispatch = customUseDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {...values, resident: edit ? values?.resident : id};
    console.log('checking payload', payload);
    if (checkEmptyValues(payload)) {
      loading.current = true;
      console.log('edit', edit);
      const result = await (edit
        ? eventualVisitsService.update({...payload}, id)
        : eventualVisitsService.create(payload));

      const {status, body, message} = result as apiResponse;
      console.log('response:', result);
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.navigate(screens.visitByLogin as never);
      } else {
        showAlertWithOneAction({
          title: trans('Visits'),
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
    setLoading(false);
  };

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await eventualVisitsService.details(id);
        const {status, message, body} = result as apiResponse;
        console.log('Body details api eventual for update: ', body);
        if (status) {
          setValues({
            visitType: body?.visitType,
            visitorName: body?.visitorName,
            note: body?.note,
            resident: body?.resident?._id,
            date: body?.date,
            multipleGuest:
              parseInt(body?.guest) && parseInt(body?.guest) > 1 ? true : false,
            guest: body?.guest,
          });
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, [edit, id, navigation, trans]);

  console.log(values, 'values');

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Visits by login')}
          heading={trans(name)}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        {fetching ? (
          <EmptyContent forLoading={fetching} />
        ) : (
          <ScrollView
            contentContainerStyle={{...customPadding(0, 20, 20, 20)}}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always">
            <VisitType
              defaultValue={values?.visitType}
              onChange={handleChange}
            />
            {/* <CustomSelect
            data={[
              'Guest',
              'Home Service',
              'Moving',
              'Supplier',
              'Parcel',
              'FriendShip',
              'Others',
            ]}
            defaultValue={values?.visitType}
            placeholder={trans('Select visit type')}
            onChange={(text: any) => handleChange(text, 'visitType')}
          /> */}
            <DateTimeInput
              defaultValue={values?.date}
              name="dateTime"
              placeholder={trans('Date/time entry')}
              onChange={text => handleChange(text, 'date')}
              //onChangeText={(text) => handleChange(text, 'dateTimeEntry')}
            />
            <LabelInput
              defaultValue={values?.visitorName}
              name="Guestname"
              placeholder={trans('Guest Name')}
              onChangeText={text => handleChange(text, 'visitorName')}
            />
            <LabelInput
              defaultValue={values?.note}
              name="note"
              placeholder={trans('Note')}
              onChangeText={text => handleChange(text, 'note')}
            />
            <ActiveOrDisActive
              label={trans('Multiple Guests')}
              defaultValue={values?.multipleGuest}
              onChange={value => handleChange(value, 'multipleGuest')}
            />
            {/* {values.current.event && (
            <ActiveOrDisActive
              label={trans('Multiple Guests')}
              // defaultValue={values.current?.event}
              // onChange={value => handleChange(value, 'event')}
              style={{marginBottom: 10, marginTop: 10}}
            />
          )} */}
            {values?.multipleGuest && (
              <LabelInput
                // label={trans("# Guest/ # Access")}
                defaultValue={values?.guest}
                //  name="noOfGeusts"
                placeholder={trans('Guests')}
                onChangeText={text => handleChange(text, 'guest')}
                style={{marginBottom: 10, marginTop: 10}}
              />
            )}
          </ScrollView>
        )}
        {edit ? (
          <Button
            text="Eliminate"
            style={{margin: rs(20), backgroundColor: colors.eliminateBtn}}
            textColor={colors.white}
            onPress={handleDelete}
          />
        ) : null}
      </Container>
    </>
  );
};

export default AddVisits;
