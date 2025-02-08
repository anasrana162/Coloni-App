import React, {useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {ScrollView, TouchableOpacity, Dimensions, Text} from 'react-native';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import LabelInput from '../../components/app/LabelInput.app';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {showMessage} from 'react-native-flash-message';
import expenseTemplateService from '../../services/features/expenseTemplate/expenseTemplate.service';
import {apiResponse} from '../../services/features/api.interface';
import {showAlertWithOneAction} from '../../utilities/helper';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../state/features/expenseTemplate/expenseTemplate.slice';
import {customUseDispatch} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useTranslation} from 'react-i18next';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import {momentTimezone} from '../../packages/momentTimezone.package';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {colors} from '../../assets/global-styles/color.assets';
const {width} = Dimensions.get('screen');
const AddUpdateExpenseTemplate: React.FC<{
  route: {params?: {edit: boolean; index: number; id: string}};
}> = ({
  route: {params: {edit, index, id} = {edit: false, index: -1, id: ''}},
}) => {
  const {t: trans} = useTranslation();
  const loading = useRef(false);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const values = useRef({
    expenseType: '',
    amount: '',
    note: '',
    date: new Date(),
    visibleToResident: false,
    done: true,
  });
  const handleChange = (value: any, field?: string) => {
    console.log('value + feild', value, '     ', field);
    const oldValues = {...values.current};
    values.current = {...oldValues, [field as string]: value};
  };
  const handleSubmit = async () => {
    loading.current = true;
    const payload = {
      ...values.current,
    };
    const result = await (edit
      ? expenseTemplateService.update({...payload}, id)
      : expenseTemplateService.create(payload));
    const {status, body, message} = result as apiResponse;
    if (status) {
      edit
        ? dispatch(updateAction({item: body, index, id}))
        : dispatch(addAction(body));
      navigation.goBack();
    } else {
      showAlertWithOneAction({
        title: trans('Expense Template'),
        body: message,
      });
    }
    loading.current = false;
  };
  const eliminateExpenseTemplate = async () => {
    dispatch(deleteAction({index, id}));
    const result = await expenseTemplateService.delete(id);
    alert('Deleted Expense Template ');
    navigation.goBack();
  };
  useLayoutEffect(() => {
    (async () => {
      console.log('show id', id);
      if (edit) {
        setFetching(true);
        const result = await expenseTemplateService.details(id);
        const {status, message, body} = result as apiResponse;
        if (status) {
          values.current = {
            expenseType: body?.expenseType,
            amount: body?.amount,
            note: body?.note,
            date: body?.date || new Date(),
            done: body?.done || false,
            visibleToResident: body?.visibleToResident || false,
          };
        } else {
          navigation.goBack();
          console.log('result', result);
          showMessage({message});
        }
        setFetching(false);
      }
    })();
  }, []);
  return (
    <Container>
      <Header
        text={trans('New Template')}
        rightIcon={<ImagePreview source={imageLink.saveIcon} />}
        rightControl={handleSubmit}
      />
      {fetching ? (
        <EmptyContent forLoading={fetching} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{...customPadding(17, 20, 20, 20)}}>
          <CustomSelect
            placeholder={trans('Expense Type')}
            data={[
              trans('Security'),
              trans('Light'),
              trans('Water'),
              trans('Others'),
            ]}
            defaultValue={values.current.expenseType}
            onChange={(value: string) => handleChange(value, 'expenseType')}
          />
          <DateTimeInput
            placeholder={trans('Day')}
            defaultValue={values.current.date}
            name="date"
            onChange={handleChange}
          />
          <LabelInput
            placeholder={trans('Amount')}
            defaultValue={values.current.amount}
            name="amount"
            onChangeText={handleChange}
            inputProps={{inputMode: 'decimal'}}
          />
          <MultiLineInput
            placeholder={trans('Note')}
            defaultValue={values.current.note}
            name="note"
            onChangeText={handleChange}
          />
          <ActiveOrDisActive
            label={trans('Visible Resident')}
            defaultValue={values.current.visibleToResident}
            name="visibleToResident"
            onChange={handleChange}
            style={{marginBottom: rs(10)}}
          />
          {/* <ActiveOrDisActive
            label={trans('Done')}
            defaultValue={values.current.done}
            name="done"
            onChange={handleChange}
            style={{marginBottom: rs(10)}}
          /> */}
          {edit && (
            <TouchableOpacity
              onPress={() => eliminateExpenseTemplate()}
              style={{
                width: width - 40,
                backgroundColor: colors.error1,
                height: 40,
                marginTop: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {trans('Eliminate')}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </Container>
  );
};

export default AddUpdateExpenseTemplate;
