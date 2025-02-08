/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  customUseDispatch,
  customUseSelector,
} from '../../../packages/redux.package';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {apiResponse} from '../../../services/features/api.interface';
import {showAlertWithOneAction} from '../../../utilities/helper';
import {useTranslation} from 'react-i18next';
import petsService from '../../../services/features/pets/pets.service';
import {addAction} from '../../../state/features/pets/pet.slice';
import {userStates} from '../../../state/allSelector.state';
interface valuesState {
  residentId?: string;
  name: string;
  petType: string;
  sex: string;
  breed: string;
  color?: string;
  isLost?: any;
  images: any;
}
const useAddPets = ({
  edit = false,
  id = '',
}: {
  edit?: boolean;
  id?: string;
  index?: number;
}) => {
  const values = useRef<valuesState>({
    residentId: '',
    name: '',
    petType: '',
    sex: '',
    breed: '',
    color: '',
    images: [],
  });
  const navigation = useCustomNavigation();
  const [loading, setLoading] = useState<boolean>(edit ? true : false);
  const [save, setSave] = useState<boolean>(false);
  const dispatch = customUseDispatch();
  const {t: trans} = useTranslation();
  const {userInfo} = customUseSelector(userStates);
  const getData = async () => {
    setLoading(true);
    console.log('ID ', id);
    const result = await petsService.details(id);
    const {status, body, message} = result as apiResponse;
    if (status) {
      const {_id, name, petType, sex, breed, color, isLost, images} =
        body?.[0] || {};
      values.current = {
        ...values.current,
        residentId: userInfo?._id,
        name,
        petType,
        sex,
        breed,
        color,
        isLost,
        images,
      };
    } else {
      showAlertWithOneAction({title: trans('Pet'), body: message});
      navigation.goBack();
    }
    setLoading(false);
  };
  useLayoutEffect(() => {
    if (edit && !values.current.residentId) {
      getData();
    }
  }, []);

  const handleChange = (value?: any, name?: any) => {
    values.current = {...values.current, [name]: value};
  };
  const handleSubmit = async (id: string) => {
    console.log('handle submit useaddpets.hook', values.current, '    ', id);
    if (
      values.current.petType &&
      // values.current.image &&
      values.current.sex &&
      values.current.color &&
      values.current.name &&
      values.current.breed
    ) {
      const objects = {...values.current, residentId: userInfo?._id};

      setSave(true);
      const result = await (edit
        ? petsService.update(objects, id)
        : petsService.create(objects));
      const {message, status, body} = result as apiResponse;
      if (status) {
        dispatch(addAction(body));
        navigation.goBack();
      } else {
        showAlertWithOneAction({
          title: trans('Try Again'),
          body: trans(message),
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
  return {handleChange, loading, trans, handleSubmit, dispatch, values, save};
};
export default useAddPets;
