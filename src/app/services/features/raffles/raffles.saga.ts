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
} from '../../../state/features/raffles/raffles.slice';
import {apiResponse} from '../api.interface';
import rafflesService from './raffles.service';

function* rafflesWatcher() {
  yield customTakeEvery(`${sliceName.rafflesSlice}/isGettingAction`, getList);
  yield customTakeEvery(`${sliceName.rafflesSlice}/gettingMoreAction`, getList);
  yield customTakeEvery(`${sliceName.rafflesSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.rafflesSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(rafflesService.list, payload);
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
export default function* rafflesSaga() {
  yield customSagaAll([rafflesWatcher()]);
}
