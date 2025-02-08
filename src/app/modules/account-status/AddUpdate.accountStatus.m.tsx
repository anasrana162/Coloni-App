import {ScrollView, View} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ShowDate from '../../components/app/ShowDate.app';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import Badge from '../../components/app/Badge.app';
import {accountStatusStates, userStates} from '../../state/allSelector.state';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {
  customMargin,
  globalStyles,
  customPadding,
} from '../../assets/global-styles/global.style.asset';
import {searchingAction} from '../../state/features/accountStatus/accountStatus.slice';
import {useTheme} from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import accountStatusService from '../../services/features/accountStatus/accountStatus.service';
import {
  updateAction,
  addAction,
} from '../../state/features/accountStatus/accountStatus.slice';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import otherIncomeService from '../../services/features/otherIncome/otherIncome.service';
import expensesService from '../../services/features/expenses/expenses.service';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import MonthYearInput from '../debtors-report/components/Month&yearInputField';
import monthChargesService from '../../services/features/monthCharges/monthCharges.service';
import {userRoles} from '../../assets/ts/core.data';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const AddUpdateAccountStatus: React.FC<{
  route: {params?: {index?: number; edit?: boolean; id?: any}};
}> = ({
  route: {params: {index, id, edit} = {index: -1, id: '', edit: false}},
}) => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {userInfo} = customUseSelector(userStates);
  const [selectedType, setSelectedType] = useState('asset');
  const [expensesId, setExpensesId] = useState<string[]>([]);
  const [incomesId, setIncomesId] = useState<string[]>([]);
  const {colors} = useTheme() as any;
  const values = useRef<{
    period: Date;
    residentId: any;
    asset: boolean;
    incomesId: any;
    expensesId: any;
  }>({
    period: new Date(),
    asset: false,
    residentId: userInfo?._id,
    incomesId: '',
    expensesId: '',
  });
  const dispatch = customUseDispatch();

  const handleChange = (value: any, name: string) => {
    values.current = {...values.current, [name]: value};
    if (name === 'period') {
      fetchIncomeAndExpenses(value);
    }
  };

  const fetchIncomeAndExpenses = async (selectedDate: Date) => {
    setFetching(true);
    try {
      const resultIncome = await monthChargesService.getMonthCharge(
        selectedDate,
      );
      const resultExpenses = await expensesService.getExpense(selectedDate);

      const {status: incomeStatus, body: incomeBody} =
        resultIncome as apiResponse;
      const {status: expensesStatus, body: expensesBody} =
        resultExpenses as apiResponse;
      console.log('Checking income body:', incomeBody);
      console.log('Checking expenses body:', expensesBody);
      if (incomeStatus && expensesStatus) {
        const incomeIds = incomeBody.list.map(
          (item: {_id: string}) => item._id,
        );
        const expenseIds = expensesBody.list.map(
          (item: {_id: string}) => item._id,
        );
        setIncomesId(incomeIds);
        setExpensesId(expenseIds);
      } else {
        console.error('Failed to fetch income or expenses.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      type: 'asset', //selectedType
      expensesId,
      incomesId,
    };
    console.log('checking payloads', payload);

    if (checkEmptyValues(payload)) {
      const result = await (edit
        ? accountStatusService.update({...payload}, id)
        : accountStatusService.create(payload));
      const {status, body, message} = result as apiResponse;

      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({title: trans('Account Status'), body: message});
      }
    } else {
      showAlertWithOneAction({
        title: trans('Invalid'),
        body: trans('Please fill-up correctly'),
      });
    }
    setLoading(false);
  };

  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  return (
    <>
      {loading && <LoadingComp />}
      <Container>
        <Header
          text={
            !isAdmin
              ? trans('Account Statement')
              : edit
              ? trans('Edit Account Status')
              : trans('Add Account Status')
          }
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ShowDate style={{...customMargin(10, 20, 10, 20)}} />
        <ScrollView style={{...customMargin(10, 20, 20, 20)}}>
          <MonthYearInput
            label={trans('Period')}
            defaultValue={values.current?.period}
            onChange={value => {
              handleChange(value, 'period');
            }}
          />
          <ActiveOrDisActive
            name="asset"
            onChange={value => handleChange(value, 'asset')}
            label={trans('Asset')}
            style={{...customMargin(2, 2, 2, 12)}}
            defaultValue={values?.current?.asset}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default AddUpdateAccountStatus;
