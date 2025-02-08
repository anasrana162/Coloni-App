import {ScrollView} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import InfoCard from '../../components/app/InfoCard.m';
import LabelInput from '../../components/app/LabelInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import CustomSelect from '../../components/app/CustomSelect.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';

import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {addAction} from '../../state/features/optionalConfiguration/acceptCard/acceptCard.slice';
import acceptCardsService from '../../services/features/optionalConfiguration/acceptCards/acceptCards.service';
import LoadingComp from './Components/LoadingComp';

const AcceptCardOptional = () => {
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const [loadings, setLoading] = useState(false);
  const navigation = useCustomNavigation();

  const [formData, setFormData] = useState({
    residentId: '',
    type: '',
    mode: '',
    commission: '',
    residentCommission: '',
    businessID: '',
    privateKey: '',
    fixedResident: '',
    permanent: '',
    activate3Ds: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await acceptCardsService.details();
      if (result?.body?.list?.length > 0) {
        const data = result.body.list[0];
        setFormData({
          residentId: data?.resident?._id,
          type: data?.type,
          mode: data?.mode,
          commission: data?.commission,
          residentCommission: data?.residentCommission,
          businessID: data?.businessID,
          privateKey: data?.privateKey,
          fixedResident: data?.fixedResident,
          permanent: data?.permanent,
          activate3Ds: data?.activate3Ds,
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (value: any, name: any) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    if (checkEmptyValues(formData, 'files')) {
      loading.current = true;
      const result = await acceptCardsService.create(formData);
      const {status, body, message} = result as apiResponse;
      if (status) {
        dispatch(addAction(body));
        showAlertWithOneAction({
          title: trans('Accept Cards'),
          body: message,
        });
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Accept Cards'),
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
          text="Accept Cards"
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
            bgColor={colors.tertiary}
            style={{marginBottom: rs(10)}}
            body={trans(
              'Administrator, add classifications to your income to change the look of your statement (Feature in Progress...)',
            )}
          />
          <CustomSelect
            label={trans('Pasarela')}
            placeholder={trans('Pasarela')}
            data={['OpenPay', 'Pasarela']}
            name="type"
            onChange={handleChange}
            defaultValue={formData?.type}
          />
          <CustomSelect
            label={trans('Mode')}
            placeholder={trans('Mode')}
            data={[trans('Evidence'), trans('production')]}
            name="mode"
            onChange={handleChange}
            defaultValue={formData?.mode}
          />
          <LabelInput
            label={trans('Commission %')}
            placeholder={trans('Commission %')}
            name="commission"
            onChangeText={handleChange}
            defaultValue={formData?.commission}
            keyboardType="numeric"
          />
          <LabelInput
            label={trans('Permanent')}
            placeholder={trans('Permanent')}
            name="permanent"
            onChangeText={handleChange}
            defaultValue={formData?.permanent}
            keyboardType="numeric"
          />
          <LabelInput
            label={trans('Resident Commission')}
            placeholder={trans('Resident Commission')}
            name="residentCommission"
            onChangeText={handleChange}
            defaultValue={formData?.residentCommission}
            keyboardType="numeric"
          />
          <LabelInput
            label={trans('Fixed Resident')}
            placeholder={trans('Fixed Resident')}
            name="fixedResident"
            onChangeText={handleChange}
            defaultValue={formData?.fixedResident}
            keyboardType="numeric"
          />
          <LabelInput
            label={trans('Business ID')}
            placeholder={trans('Business ID')}
            name="businessID"
            onChangeText={handleChange}
            defaultValue={formData?.businessID}
            keyboardType="numeric"
          />
          <LabelInput
            label={trans('Private Key')}
            placeholder={trans('Private Key')}
            name="privateKey"
            onChangeText={handleChange}
            defaultValue={formData?.privateKey}
            keyboardType="numeric"
          />
          <ActiveOrDisActive
            label={trans('Activate 3DS')}
            name="activate3Ds"
            onChange={handleChange}
            defaultValue={formData?.activate3Ds}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default AcceptCardOptional;
