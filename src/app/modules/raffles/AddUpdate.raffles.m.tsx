import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';

import CancelIcon from '../../assets/images/svg/cancelIcon.svg';
import {
  checkEmptyValues,
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../utilities/helper';
import rafflesService from '../../services/features/raffles/raffles.service';
import {apiResponse} from '../../services/features/api.interface';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../packages/navigation.package';
import {customUseDispatch} from '../../packages/redux.package';
import {
  updateAction,
  addAction,
  deleteAction,
} from '../../state/features/raffles/raffles.slice';
import {showMessage} from 'react-native-flash-message';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {colors} from '../../assets/global-styles/color.assets';
import Badge from '../../components/app/Badge.app';
import LoadingComp from '../optional-configuration/Components/LoadingComp';
const AddUpdateRaffles: React.FC<{
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
  const [loadings, setLoading] = useState(false);

  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const values = useRef<{
    date: Date;
    title: string;
    description: string;
    award: string;
  }>({
    date: new Date(),
    title: '',
    description: '',
    award: '',
  });
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const dispatch = customUseDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };
    if (checkEmptyValues(payload, 'files')) {
      loading.current = true;

      const result = await (edit
        ? rafflesService.update({...payload}, id)
        : rafflesService.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Announcements'),
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
        const result = await rafflesService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            date: body?.date,
            title: body?.title,
            description: body?.description,
            award: body?.award,
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        await rafflesService.delete(id);
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this raffles?'),
      onPressAction: confirm,
    });
  };

  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text="Raffles"
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
          <DateTimeInput
            placeholder={trans('Date')}
            defaultValue={values.current.date}
            name="date"
            onChange={handleChange}
          />
          <LabelInput
            placeholder={trans('Title')}
            defaultValue={values.current.title}
            name="title"
            onChangeText={handleChange}
          />
          <MultiLineInput
            placeholder={trans('Note/Description')}
            defaultValue={values.current.description}
            name="description"
            onChangeText={handleChange}
          />
          <LabelInput
            placeholder={trans('Price')}
            defaultValue={values.current.award}
            name="award"
            onChangeText={handleChange}
            keyboardType={'numeric'}
          />
          {edit && (
            <Badge
              text={trans('Eliminate')}
              style={{
                borderRadius: rs(10),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: `${'70%'}`,
                height: 45,
                marginTop: 30,
              }}
              bgColor={colors.error1}
              onPress={() => handleDelete(index, id)}
            />
          )}
        </ScrollView>
      </Container>
    </>
  );
};

export default AddUpdateRaffles;
