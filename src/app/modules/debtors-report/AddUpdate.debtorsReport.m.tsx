import {ScrollView} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {
  customMargin,
  customPadding,
} from '../../assets/global-styles/global.style.asset';

import {customUseDispatch} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {apiResponse} from '../../services/features/api.interface';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {
  addAction,
  updateAction,
} from '../../state/features/debtorsReport/debtorsReport.slice';
import {customUseSelector} from '../../packages/redux.package';
import debtorsReportService from '../../services/features/debtorsReport/debtorsReport.service';
import {userStates} from '../../state/allSelector.state';
import DateTimeInput from '../process-balance/InputFieldWithCalender';
import MonthYearInput from './components/Month&yearInputField';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const AddUpdateDebtorsReport: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string}};
}> = ({
  route: {params: {edit, index, id} = {edit: false, index: -1, id: ''}},
}) => {
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const [loadings, setLoading] = useState(false);
  const {userInfo} = customUseSelector(userStates);
  // const [values, setValues] = useState({
  //   period: new Date(),
  //   asset: false,
  //   residentId: userInfo._id,
  // });
  const values = useRef<{
    period: Date;
    residentId: any;
    asset: boolean;
  }>({
    period: new Date(),
    asset: false,
    residentId: userInfo._id,
  });

  const handleChange = (value: any, name?: any) => {
    console.log(`Updated field: ${name}, New value: ${value}`);
    values.current = {...values.current, [name]: value};
  };

  console.log('checking handlechange value', values);
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };

    console.log('checking payload...', payload);
    loading.current = true;
    const result = await (edit
      ? debtorsReportService.update({...payload}, id)
      : debtorsReportService.create(payload));
    const {status, body, message} = result as apiResponse;
    console.log(
      'API RESPONSE ....STATUS..>',
      status,
      '..body..>',
      body,
      '...message..>',
      message,
    );
    if (status) {
      edit
        ? dispatch(updateAction({item: body, index, id}))
        : dispatch(addAction(body));
      navigation.goBack();
    } else {
      showAlertWithOneAction({
        title: trans('Debtors report'),
        body: message,
      });
    }
    loading.current = false;
    // } else {
    //   showAlertWithOneAction({
    //     title: trans('Debtors report'),
    //     body: 'Please fill-up correctly!',
    //   });
    // }
    setLoading(false);
  };

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await debtorsReportService.details(id);
        const {status, message, body} = result as apiResponse;

        if (status) {
          values.current = {
            period: body?.period,
            asset: body?.asset || false,
            residentId: body?.resident?._id,
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, [edit, id, navigation]);

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Debtors Report')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView style={{...customMargin(10, 20, 20, 20)}}>
          <MonthYearInput
            label={trans('Period')}
            defaultValue={values.current?.period}
            onChange={value => {
              handleChange(value, 'period');
            }}
          />
          <ActiveOrDisActive
            label={trans('Asset')}
            defaultValue={values.current?.asset}
            onChange={value => handleChange(value, 'asset')}
            style={{...customPadding(2, 2, 2, 6)}}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default AddUpdateDebtorsReport;
