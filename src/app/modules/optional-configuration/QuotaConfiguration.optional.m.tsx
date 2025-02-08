import {ScrollView} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import InfoCard from '../../components/app/InfoCard.m';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {customUseDispatch} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {addAction} from '../../state/features/optionalConfiguration/quotaConfiguration/quotaConfiguration.slice';
import {useTranslation} from 'react-i18next';
import quotaConfigurationService from '../../services/features/optionalConfiguration/quotaConfiguration/quotaConfiguration.service';
import LoadingComp from './Components/LoadingComp';
const QuotaConfigurationOptional = () => {
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const [loadings, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    residentId: userInfo?._id || '',
    incomeType: '',
    calculationType: '',
    note: '',
    activeResident: false,
  });

  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const values = useRef<{
    residentId: string;
    incomeType: string;
    calculationType: string;
    note: string;
    activeResident: boolean;
  }>({
    residentId: userInfo?._id,
    incomeType: '',
    calculationType: '',
    note: '',
    activeResident: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await quotaConfigurationService.details();
      if (result?.body?.list?.length > 0) {
        const data = result.body.list[0];
        setFormData({
          residentId: data.resident?._id || '',
          incomeType: data.incomeType || '',
          calculationType: data.calculationType || '',
          note: data.note || '',
          activeResident: data.activeResident || false,
        });
      }
    };

    fetchData();
  }, []);

  const handleChange = (value: any, name?: any) => {
    setFormData(prev => ({...prev, [name]: value}));
  };
  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    if (checkEmptyValues(formData, 'files')) {
      loading.current = true;
      const result = await quotaConfigurationService.create(formData);
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
      loading.current = false;
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
          text={trans('Quota Configuration')}
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
              'Please ask your distributor for advice on correct configuration. Making changes may affect the bulk generation of quotas',
            )}
          />
          <CustomSelect
            style={{marginTop: rs(10)}}
            placeholder={trans('Income Type')}
            data={[
              'Share',
              'Positive Balance',
              'Amenity',
              'Surcharge',
              'Penalty Fee',
              'Card/Tag',
              'Extraordinary Fee',
            ]}
            defaultValue={formData.incomeType}
            name="incomeType"
            onChange={handleChange}
          />
          <CustomSelect
            placeholder={trans('Calculation Type')}
            data={[
              trans('Manual'),
              trans('Resident Quota'),
              trans('factor 1'),
              trans('Factor 2'),
            ]}
            defaultValue={formData.calculationType}
            name="calculationType"
            onChange={handleChange}
          />
          <MultiLineInput
            placeholder={'Note'}
            defaultValue={formData.note}
            name={'note'}
            onChangeText={text => handleChange(text, 'note')}
          />
          <ActiveOrDisActive
            label={'Active Resident'}
            defaultValue={formData.activeResident}
            name="activeResident"
            onChange={handleChange}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default QuotaConfigurationOptional;
