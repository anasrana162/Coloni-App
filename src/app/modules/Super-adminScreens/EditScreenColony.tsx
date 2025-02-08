import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useRef, useLayoutEffect } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { useTranslation } from 'react-i18next';
import { useCustomNavigation } from '../../packages/navigation.package';
import { customUseDispatch, customUseSelector } from '../../packages/redux.package';
import { userStates } from '../../state/allSelector.state';
import LabelInput from '../../components/app/LabelInput.app';
import { customMargin, customPadding } from '../../assets/global-styles/global.style.asset';
import coloniesSuperAdminService from '../../services/features/SuperAdminColony/colonySuperAdmin.services';
import { apiResponse } from '../../services/features/api.interface';
import { showMessage } from 'react-native-flash-message';
import AdminlistField from './BottomSheet/AdminlistField';
import Button from '../../components/core/button/Button.core';
import { colors } from '../../assets/global-styles/color.assets';
import { addAction, deleteAction, updateAction } from '../../state/features/SuperAdmin/SuperAdminSlice';
import { checkEmptyValues, showAlertWithOneAction } from '../../utilities/helper';

const EditScreenColony: React.FC<{ route: { params?: { index?: number; edit?: boolean; id?: any ;item:any} } }> = ({
  route: { params: { index, id, edit,item } = { index: -1, id: '', edit: false } },
}) => {
  const dispatch = customUseDispatch();
  const { t: trans } = useTranslation();
  const { userInfo } = customUseSelector(userStates);
  const navigation = useCustomNavigation<any>();
  const loading = useRef(false);
  const [fetching, setFetching] = useState(false);
  const values = useRef<{
    name: string;
    AdminList: any;
    createdBy: string;
  }>({
    name: '',
    AdminList: '',
    createdBy: userInfo?._id || '',
  });
  const handleChange = (value: any, name?: any) => {
    if (name === 'AdminList') {
      // Store AdminList as an object
      values.current.AdminList = value;
    } else {
      values.current = { ...values.current, [name]: value };
    }
  };
  const handleSubmit = async () => {
    const adminId = values.current.AdminList?._id; 
    const payload = {
      name: values.current.name,
      AdminId: adminId,
      createdBy: values.current.createdBy,
    };

    if (checkEmptyValues(payload)) {
      loading.current = true;
      const result = await 
        coloniesSuperAdminService.update(payload, id);
      const { status, body, message } = result as apiResponse;
      if (status) {
        dispatch(updateAction({ item: body, index, id }))
       
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Colony'),
          body: message,
        });
      }
      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Colony'),
        body: 'Please fill-up correctly!',
      });
    }
  };

  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await coloniesSuperAdminService.details(id);
        const { status, message, body } = result as apiResponse;
        if (status) {
          values.current = {
            name: body?.name,
            AdminList: body?.AdminId?.name, 
            createdBy: body?.createdBy?._id,
          };
          console.log("checking values.current",values.current)
        } else {
          navigation.goBack();
          showMessage({ message });
        }
        setFetching(false);
      }
    })();
  }, []);
  return (
    <Container>
      <Header
        text={trans("Edit Colony")}
        rightIcon={<ImagePreview source={imageLink.saveIcon} /> }
        rightControl={ handleSubmit}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ ...customPadding(17, 20, 20, 20) }}
      >
        <LabelInput
          label={trans('Colony Name')}
          name="name"
          placeholder="XYZ"
          onChangeText={(value) => handleChange(value, 'name')}
          defaultValue={values?.current.name}
        />
        <AdminlistField
          label={trans('Select Admin')}
          onChange={handleChange}
          defaultValue={values?.current?.AdminList}
        />
         </ScrollView>
     

    </Container>
  );
};
const styles = StyleSheet.create({


  eliminate: {
    ...customMargin(10, 0, 10, 0),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,

  },
  buttonContainer: {
  ...customMargin(17, 20, 20, 20) 
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // padding: rs(20),
    // borderTopWidth: 1,
    // borderColor: colors.graySoft,
  },

});
export default EditScreenColony;
