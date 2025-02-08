import {ScrollView, View} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import InfoCard from '../../components/app/InfoCard.m';
import LabelInput from '../../components/app/LabelInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import incomeExpenseClassificationService from '../../services/features/optionalConfiguration/incomeExpenseClassification/ExpenseClassification.service';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {addAction} from '../../state/features/expenseTemplate/expenseTemplate.slice';
import {apiResponse} from '../../services/features/api.interface';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import {userStates} from '../../state/allSelector.state';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import LoadingComp from './Components/LoadingComp';

const ClassificationExpensesOptional = () => {
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const loading = useRef(false);

  const [loadings, setLoading] = useState(false);
  const navigation = useCustomNavigation();
  const [formData, setFormData] = useState({
    fundName: '',
    classification: '',
    type: 'Expenses',
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await incomeExpenseClassificationService.details();
      if (result?.body?.list?.length > 0) {
        const data = result.body.list[0];
        setFormData({
          classification: data?.classification || '',
          fundName: data?.fundName || '',
          type: data?.type || '',
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (value, name) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const dispatch = customUseDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    if (checkEmptyValues(formData, 'files')) {
      const result = await incomeExpenseClassificationService.create(formData);
      const {status, body, message} = result as apiResponse;
      if (status) {
        dispatch(addAction(body));
        showAlertWithOneAction({
          title: trans('Quota Configuration'),
          body: message,
        });
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Quota Configuration'),
          body: message,
        });
      }
    } else {
      showAlertWithOneAction({
        title: trans('Invalid'),
        body: trans('Please fill-up correctly'),
      });
    }
    setLoading(false);
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Classification of Expenses')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={() => handleSubmit()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <InfoCard
            title={trans('Information')}
            body={trans(
              'Administrator, add classifications to your expenses to change the look of your statement. Example: Fixed Expenses, Variable Expenses, etc.',
            )}
          />
          <View style={{marginBottom: rs(10)}} />
          <LabelInput
            placeholder={trans('Classification name')}
            label={trans('Classifications:')}
            defaultValue={formData?.classification}
            name="classification"
            onChangeText={handleChange}
          />
          <LabelInput
            placeholder={trans('Fund name')}
            label={trans('Money:')}
            defaultValue={formData?.fundName}
            name="fundName"
            onChangeText={handleChange}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default ClassificationExpensesOptional;
