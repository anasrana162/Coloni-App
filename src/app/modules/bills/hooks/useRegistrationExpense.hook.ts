/* eslint-disable react-hooks/exhaustive-deps */
import {useLayoutEffect, useRef, useState} from 'react';
import {
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../../utilities/helper';
import {useTranslation} from 'react-i18next';
import expensesService from '../../../services/features/expenses/expenses.service';
import {apiResponse} from '../../../services/features/api.interface';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {customUseDispatch} from '../../../packages/redux.package';
import {
  addAction,
  updateAction,
} from '../../../state/features/expenses/expense.slice';


import expenseTypesService from '../../../services/features/expenseTypes/expenseTypes.service';
import moment from 'moment';
import {config} from '../../../../Config';

const useRegistrationExpenses = (edit: boolean, index: number, id: any) => {
  const values = useRef<{
    expenseType: any;
    expenseDate: Date;
    expenseAmount: string;
    note: string;
    visibleToResident: boolean;
    paid: boolean;
    uploadfile: any;
    images: any[];
    made: boolean;
    uploadfileName: string;
  }>({
    expenseAmount: '',
    expenseDate: new Date(),
    expenseType: null,
    paid: false,
    note: '',
    visibleToResident: false,
    uploadfile: [],
    images: [], 
    made: false,
    uploadfileName: '',
  });
  const isGetting = useRef(false);
  const {t: trans} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [expenseTypes, setExpenseTypes] = useState<any[]>([]);
  const navigation = useCustomNavigation();
  const dispatch = customUseDispatch();
  const [fetching, setFetching] = useState(false);
  const onChange = (value: any, name: string) => {
    console.log('name', name, 'Value', value);
    values.current = {...values.current, [name]: value};
  };
  const handleSubmit = async () => {
    console.log(' values.current', values.current);
    if (
      values.current.expenseAmount &&
      values.current.expenseDate &&
      values.current.expenseType?._id &&
      values.current.note
    ) {
      setLoading(true);
      const obj:any = {
        ...values.current,
      };
      obj.expenseType = values.current?.expenseType?._id;
      obj.expenseAmount = parseInt(obj?.expenseAmount);
      obj.expenseDate = moment(obj?.expenseDate).format('YYYY-MM-DD');
      console.log('After change:', obj, 'id?._id', id?._id);
      const result = await (edit
        ? expensesService.update(obj, id?._id)
        : expensesService.create(obj));
      const {body, status, message} = result as apiResponse;
      console.log('REsult', result);
      if (status) {
        // edit
        //   ? dispatch(
        //       updateAction({...body, expenseType: values.current.expenseType}),
        //     )
        //   : dispatch(
        //       addAction({...body, expenseType: values.current.expenseType}),
        //     );
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Try Again!'),
          body: trans(message),
        });
      }
      setLoading(false);
    } else {
      showAlertWithOneAction({
        title: trans('Registration of Expenses'),
        body: trans('Please fill-up correctly'),
      });
    }
  };

  
  const fetchExpenseTypes = async () => {
    var expType = await expenseTypesService.list(null);
    console.log('config token', config.token, ' ', expType);
    if (expType?.status) {
      setExpenseTypes(expType?.body); // for showing list of expenseTypes in dropdown
      
      setDataToEdit(expType?.body);
      setFetching(false);
      return expType?.body;
    } else {
      setExpenseTypes([]);
      setFetching(false);
      return 'error';
    }
  };

  
  const setDataToEdit = (data: any) => {
    if (id && edit && !isGetting.current) {
      setFetching(true);
      var searchExpenseID =
        Array.isArray(data) &&
        data?.find((item: any) => item?._id == id?.expenseType?._id);
      console.log('searchExpenseID', id);
      values.current.expenseType = searchExpenseID;
      values.current.expenseDate = new Date(id?.expenseDate);
      values.current.expenseAmount = id?.expenseAmount;
      values.current.paid = id?.paid;
      values.current.made = id?.made;
      values.current.visibleToResident = id?.visibleToResident;
      values.current.note = id?.note;
      values.current.uploadfile = id?.uploadfile;
      values.current.images = id?.images;
      values.current.uploadfileName = id?.uploadfileName;
      setFetching(false);
      isGetting.current = true;
    }
  };

  
  const handleDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        // dispatch(deleteAction({index, id}));
        console.log('Reaching Delte expense', id, '  ', config.token);
        await expensesService.delete(id);
        navigation.goBack();
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this Expense?'),
      onPressAction: confirm,
    });
  };

  useLayoutEffect(() => {
    setFetching(true);
    fetchExpenseTypes(); 
  }, [id]);
  return {
    loading,
    onChange,
    handleSubmit,
    values: values.current,
    fetching,
    fetchExpenseTypes,
    handleDelete,
    expenseTypes,
  };
};

export default useRegistrationExpenses;
