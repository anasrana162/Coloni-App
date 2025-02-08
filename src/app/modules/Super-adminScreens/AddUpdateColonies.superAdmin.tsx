import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native';
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
import EliminateIcon from '../../assets/images/svg/eliminateIcon.svg';
import { addAction, deleteAction, updateAction } from '../../state/features/SuperAdmin/SuperAdminSlice';
import { checkEmptyValues, showAlertWithOneAction } from '../../utilities/helper';
import { screens } from '../../routes/routeName.route';
import DeleteBottomSheet from '../month-charge/components/DeleteBottomSheet';
const AddColoniessuperAdmin: React.FC<{ route: { params?: { index?: number; edit?: boolean; id?: any ;item:any} } }> = ({
  route: { params: { index, id, edit,item } = { index: -1, id: '', edit: false } },
}) => {
  console.log("checking id ", id)
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

    console.log("checking payload", payload);

    if (checkEmptyValues(payload)) {
      loading.current = true;
      const result = await (edit
        ? coloniesSuperAdminService.update(payload, id)
        : coloniesSuperAdminService.create(payload));
      const { status, body, message } = result as apiResponse;
      if (status) {
        edit
          ? dispatch(updateAction({ item: body, index, id }))
          : dispatch(addAction(body));
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
  const onPressEdit = () => {
    navigation.navigate(screens.EditScreenColony as never, {
      // index,
      id: item?._id,
      edit: true,
      // item:item,
    });
  };
  useLayoutEffect(() => {
    (async () => {
      if (edit) {
        setFetching(true);
        const result = await coloniesSuperAdminService.details(id);
        const { status, message, body } = result as apiResponse;
        console.log("checking details",body);
        if (status) {
          values.current = {
            name: body?.name,
            AdminList: body?.AdminId?.name, 
            createdBy: body?.createdBy,
          };
        } else {
          navigation.goBack();
          showMessage({ message });
        }
        setFetching(false);
      }
    })();
  }, []);

  const handleDelete = () => {
    dispatch(deleteAction({ index, id: id }));
    navigation.goBack();
    coloniesSuperAdminService.delete(id);
  };

  return (
    <Container>
      <Header
        text={trans(edit ? item?.name : "Add Colony")}
        rightIcon={!edit ? <ImagePreview source={imageLink.saveIcon} /> : null}
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
          defaultValue={values.current.AdminList}
        />
         </ScrollView>
        {edit ? (
          // <View >
           <View style={styles.buttonContainer}> 
          <Button
            text="Edit"
            style={{ backgroundColor: colors.light }}
            
            onPress={onPressEdit}
          />
          <Button
            text="Eliminate"
            style={styles.eliminate}
            textColor={colors.white}
            icon={<EliminateIcon/>}
            onPress={() =>
              global.showBottomSheet({
                flag: true,
                component:DeleteBottomSheet,
                componentProps: {
                  onConfirm: async () => {
                    console.log('Deleting item with ID:', id);
                    // dispatch(deleteAction({ index, id: id }));
                    // navigation.goBack();
                    // coloniesSuperAdminService.delete(id);
                  },
                  onCancel: () => {
                    console.log('Deletion canceled');
                  },
                },
              })
            }
          />
        </View>
        ) : null}
     


    </Container>
  );
};
const styles = StyleSheet.create({


  eliminate: {
    ...customMargin(10, 0, 10, 0),
    backgroundColor: colors.eliminateBtn,
   
   
  

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
export default AddColoniessuperAdmin;
