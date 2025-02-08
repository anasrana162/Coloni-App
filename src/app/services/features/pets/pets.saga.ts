import {AnyAction} from 'redux-saga';
import {
  customCall,
  customPut,
  customSagaAll,
  customTakeEvery,
} from '../../../packages/redux.package';
import {sliceName} from '../../../state/sliceName.state';
import {
  gettingError,
  gettingSuccess,
} from '../../../state/features/pets/pet.slice';
import vehiclesService from './pets.service';
import {apiResponse} from '../api.interface';

function* petWatcher() {
  yield customTakeEvery(`${sliceName.petSlice}/isGettingAction`, getList);
  yield customTakeEvery(`${sliceName.petSlice}/gettingMoreAction`, getList);
  yield customTakeEvery(`${sliceName.petSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.petSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(vehiclesService.list, payload);
  if (!result) {
    yield customPut(gettingError());
    return;
  }
  const {status, body} = result as apiResponse;
  if (status) {
    yield customPut(gettingSuccess(body));
  } else {
    yield customPut(gettingError());
  }
}
export default function* petSaga() {
  yield customSagaAll([petWatcher()]);
}
