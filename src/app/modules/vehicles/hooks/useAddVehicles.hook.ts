/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from 'react';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {apiResponse} from '../../../services/features/api.interface';
import vehiclesService from '../../../services/features/vehicles/vehicles.service';
import {
  isEmpty,
  showAlertWithOneAction,
  showAlertWithTwoActions,
} from '../../../utilities/helper';
import {useTranslation} from 'react-i18next';
import {colorsArray} from '../../../assets/ts/dropdown.data';
import {Alert, Platform} from 'react-native';
import {
  addAction,
  deleteAction,
  updateAction,
} from '../../../state/features/vehicles/vehicle.slice';
import {config} from '../../../../Config';
import userService from '../../../services/features/users/user.service';
import {userStates} from '../../../state/allSelector.state';
import {userRoles} from '../../../assets/ts/core.data';
interface valuesState {
  registrationPlate: string;
  carBrand: string;
  carModel: string;
  tag: string;
  color?: string;
  residentId?: string;
  images: any[];
}
const useAddVehicle = ({
  edit = false,
  id = '',
}: {
  edit?: boolean;
  id?: string;
  index?: number;
}) => {
  const values = useRef<valuesState>({
    registrationPlate: '',
    carBrand: '',
    carModel: '',
    tag: '',
    color: colorsArray[0],
    residentId: '',
    images: [],
  });
  const navigation = useCustomNavigation();
  const [loading, setLoading] = useState<boolean>(edit ? true : false);
  const [vId, setVId] = useState<string>('');
  const {userInfo} = customUseSelector(userStates);
  const [save, setSave] = useState<boolean>(false);
  const [residents, setResidents] = useState<any[]>([]);
  const dispatch = customUseDispatch();
  const {t: trans} = useTranslation();
  const getData = async () => {
    setLoading(true);
    const result = await vehiclesService.details(id);
    const {status, body, message} = result as apiResponse;
    if (status) {
      const {
        _id,
        registrationPlate,
        carBrand,
        carModel,
        tag,
        color,
        resident,
        images,
      } = body || {};
      values.current = {
        ...values.current,
        registrationPlate,
        carBrand,
        carModel,
        tag,
        color,
        residentId: resident,
        images,
      };
      setVId(_id);
    } else {
      showAlertWithOneAction({title: trans('Vehicle'), body: message});
      navigation.goBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResidents();
    if (edit) {
      getData();
    }
  }, []);
  const fetchResidents = async () => {
    try {
      const result = await userService.ResidentList({
        asset: true,
        role: 'Resident',
      });
      console.log('API Response:', result); // Debugging line
      const {status, message, body} = result as apiResponse;
      if (status) {
        var temp: any[] = [];
        await body?.list.map((item: any) => {
          temp.push({
            name: `${
              item?.street?.name == undefined ? '' : item?.street?.name
            }${item?.home == undefined ? '' : ' ' + item?.home}`,
            residentId: item?._id,
          });
        });
        console.log(temp);
        setResidents(temp);
        console.log('Succes fetching residents!');
      } else {
        Alert.alert('Error:', 'Unable to fetch residents!');
      }
    } catch (err) {
      console.error('Error while fetching residents:', err); // Debugging line
      Alert.alert('Error:', 'Unable to fetch residents!');
    }
  };

  
  const onDelete = (index: number, id: string) => {
    const confirm = async (value: string) => {
      if (value === 'confirm') {
        dispatch(deleteAction({index, id}));
        navigation.goBack();
        // await documentsService.delete(id);
      }
    };
    showAlertWithTwoActions({
      title: trans('Delete'),
      body: trans('Are you want to delete this vehicle?'),
      onPressAction: confirm,
    });
  };

  const handleChange = (value?: any, name?: any) => {
    console.log('Value:', value, 'Name', name);
    values.current = {...values.current, [name]: value};
  };
  const handleSubmit = async () => {
    // need to change
    console.log('Formadaa vehicle', values.current, 'edit:', edit);
    if (
      values.current.carBrand &&
      values.current.carModel &&
      values.current.color &&
      values.current.registrationPlate &&
      values.current.tag
    ) {
      const objects = {
        ...values.current,
        
        residentId:
          userInfo?.role == userRoles.RESIDENT
            ? userInfo?._id
            : values.current.residentId?.residentId,
      };

      console.log('Formadaa vehicle', objects);

      setSave(true);
      const result = await (edit
        ? vehiclesService.update(objects, vId)
        : vehiclesService.create(objects));
      setSave(false);
      const {body, message, status} = result as apiResponse;
      console.log('result', result);
      if (status) {
        // dispatch(addAction(body)); // aans work 29 aug
        navigation.goBack();
      } else {
        console.log('Error Adding or updating Vehicles', result);
        showAlertWithOneAction({
          title: trans('Try Again'),
          body: message,
        });
      }
      setSave(false);
    } else {
      showAlertWithOneAction({
        title: trans('Vehicles'),
        body: trans('Please fill-up correctly'),
      });
    }
  };
  return {
    handleChange,
    loading,
    trans,
    handleSubmit,
    onDelete,
    dispatch,
    values,
    save,
    residents,
    userInfo, 
  };
};
export default useAddVehicle;
