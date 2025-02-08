import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {ScrollView} from 'react-native';
import {
  customMargin,
  customPadding,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import {checkEmptyValues, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import socialChannelServices from '../../services/features/SocialChannel/socialChannel.services';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/SocialChannel/SocialChannel.slice';
import {customUseDispatch} from '../../packages/redux.package';
import {showMessage} from 'react-native-flash-message';
import Button from '../../components/core/button/Button.core';
import {colors} from '../../assets/global-styles/color.assets';
import LoadingComp from './Components/LoadingComp';
const AddSocialChannelOptional: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string}};
}> = ({
  route: {params: {edit, index, id} = {edit: false, index: -1, id: ''}},
}) => {
  const values = useRef<{
    name: string;
    description: string;
    allowPost: boolean;
    allowComments: boolean;
    asset: boolean;
  }>({
    name: '',
    description: '',
    allowPost: false,
    allowComments: false,
    asset: false,
  });
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();
  const [fetching, setFetching] = useState(false);
  const [loadings, setLoading] = useState(false);
  const dispatch = customUseDispatch();
  const loading = useRef(false);
  const handleChange = (value: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...values.current,
    };

    if (checkEmptyValues(payload)) {
      loading.current = true;

      const result = await (edit
        ? socialChannelServices.update({...payload}, id)
        : socialChannelServices.create(payload));
      const {status, body, message} = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({item: body, index, id}))
          : dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Social Channels'),
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
        const result = await socialChannelServices.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            name: body?.name,
            description: body?.description,
            allowPost: body?.allowPost,
            allowComments: body?.allowComments,
            asset: body?.asset,
          };
        } else {
          navigation.goBack();
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);
  const handleDelete = () => {
    dispatch(deleteAction({index, id: id}));
    navigation.goBack();
    socialChannelServices.delete(id);
  };
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Social Channel')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
          rightControl={handleSubmit}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(10, 20, 20, 20)}}>
          <LabelInput
            placeholder={trans('Name')}
            label={trans('Name')}
            onChangeText={value => handleChange(value, 'name')}
            defaultValue={values?.current?.name}
          />
          <MultiLineInput
            placeholder={trans('Description')}
            label={trans('Description')}
            onChangeText={value => handleChange(value, 'description')}
            defaultValue={values?.current?.description}
          />
          <ActiveOrDisActive
            label={trans('Allow Posts')}
            onChange={value => handleChange(value, 'allowPost')}
            defaultValue={values?.current?.allowPost}
          />
          <ActiveOrDisActive
            label={trans('Allow Comments')}
            style={{marginTop: rs(10)}}
            onChange={value => handleChange(value, 'allowComments')}
            defaultValue={values?.current?.allowComments}
          />
          <ActiveOrDisActive
            label={trans('Asset')}
            style={{marginTop: rs(10)}}
            onChange={value => handleChange(value, 'asset')}
            defaultValue={values?.current?.asset}
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

export default AddSocialChannelOptional;
