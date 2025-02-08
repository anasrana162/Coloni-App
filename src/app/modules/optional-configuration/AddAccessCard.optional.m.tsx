import {ScrollView} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customMargin,
  customPadding,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import CustomSelect from '../../components/app/CustomSelect.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import coloniesService from '../../services/features/colonies/colonies.service';
import ResidentField from './Components/ResidentFeild';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/AccessTagCard/AccessTagCardSlice';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import AccessTagCardServices from '../../services/features/AccessTag-card/AccessTag-card.Services';
import {showMessage} from 'react-native-flash-message';
import {AccessTagCardStates} from '../../state/allSelector.state';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import LoadingComp from './Components/LoadingComp';

const AddAccessCardOptional: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string; item: any}};
}> = ({
  route: {params: {edit, index, id, item} = {edit: false, index: -1, id: ''}},
}) => {
  const {userInfo} = customUseSelector(userStates);
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const [loadings, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [user, setUser] = useState('');
  const values = useRef<{
    user: any;
    card: string;
    cardType: string;
    description: string;
    grades: string;
    activate3Ds: boolean;
  }>({
    user: null,
    card: '',
    cardType: '',
    description: '',
    grades: '',
    activate3Ds: false,
  });
  const {list} = customUseSelector(AccessTagCardStates);
  const [residents, setResidents] = useState<{body: {list: any[]}} | null>(
    null,
  );
  const [loadingResidents, setLoadingResidents] = useState(false);

  useEffect(() => {
    const fetchResidents = async () => {
      setLoadingResidents(true);
      try {
        const result = await coloniesService.residentUsers();
        setResidents(result);
      } catch (error) {
        console.error('Failed to fetch residents:', error);
      }
      setLoadingResidents(false);
    };

    fetchResidents();
  }, []);

  const generateDescription = () => {
    const itemCount = list.length + 1;
    return itemCount.toString().padStart(5, '0');
  };
  useEffect(() => {
    if (!edit && list?.length >= 0) {
      const newDescription = generateDescription();
      setDescription(newDescription);
      handleChange(newDescription, 'description');
    }
  }, [list, edit]);

  // const handleChange = (value: any, field?: string) => {
  //   const oldValues = {...values.current};
  //   values.current = {...oldValues, [field as string]: value};

  //   if (field === 'description') {
  //     setDescription(value);
  //   }
  // };

  const handleChange = (value: any, field?: any) => {
    values.current = {...values.current, [field]: value};

    if (field === 'description') {
      setDescription(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
      user: values?.current?.user?._id,
      resident: userInfo?._id,
    };
    if (checkEmptyValues(payload)) {
      loading.current = true;
      const result = await (edit
        ? AccessTagCardServices.update(payload, id)
        : AccessTagCardServices.create(payload));
      const {status, body, message} = result as apiResponse;

      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Tag/Card'),
          body: message,
        });
      }
      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Tag/card'),
        body: 'Please fill-up correctly!',
      });
    }
    setLoading(false);
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await AccessTagCardServices.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            user: body?.user,
            card: body?.card,
            cardType: body?.cardType,
            description: body?.description,
            grades: body?.grades,
            activate3Ds: body?.activate3Ds,
          };
          const userInfo = `${body?.user?.street?.name || ''} ${
            body?.user?.home || ''
          }`;
          setUser(userInfo);
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
    //s}
  }, []);

  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    AccessTagCardServices.delete(id);
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Tag/Card')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <CustomSelect
            label={trans('Resident')}
            placeholder={trans('Resident')}
            defaultValue={values?.current?.user?.name}
            data={residents?.body?.list || []}
            onChange={handleChange}
          />
          <LabelInput
            placeholder={trans('Card')}
            onChangeText={value => handleChange(value, 'card')}
            defaultValue={values?.current?.card}
            label={trans('Card')}
          />
          <LabelInput
            placeholder="0000001"
            onChangeText={value => handleChange(value, 'description')}
            defaultValue={description || values?.current?.description}
            label={trans('Description')}
            editable={false}
          />

          <CustomSelect
            placeholder={trans('Card Type')}
            data={['Normal card', 'keyFob']}
            defaultValue={values?.current?.cardType}
            label={trans('Card Type')}
            onChange={(value: string) => handleChange(value, 'cardType')}
          />
          <LabelInput
            placeholder={trans('Grades')}
            onChangeText={value => handleChange(value, 'grades')}
            label={trans('Grades')}
            defaultValue={values?.current?.grades}
          />
          <ActiveOrDisActive
            label={trans('Activate 3Ds')}
            onChange={value => handleChange(value, 'activate3Ds')}
            defaultValue={values?.current?.activate3Ds}
          />
        </ScrollView>
        {edit ? (
          <Button
            text={trans('Eliminate')}
            style={{
              backgroundColor: colors.eliminateBtn,
              ...customMargin(10, 20, 20, 20),
            }}
            textColor={colors.white}
            onPress={handleDelete}
          />
        ) : null}
      </Container>
    </>
  );
};

export default AddAccessCardOptional;
