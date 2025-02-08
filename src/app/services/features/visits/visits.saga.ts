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
} from '../../../state/features/visits/visits.slice';
import {apiResponse} from '../api.interface';
import visitsService from './visits.service';

function* visitsWatcher() {
  yield customTakeEvery(`${sliceName.visitsSlice}/isGettingAction`, getList);
  yield customTakeEvery(`${sliceName.visitsSlice}/gettingMoreAction`, getList);
  yield customTakeEvery(`${sliceName.visitsSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.visitsSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(visitsService.list, payload);
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
export default function* visitsSaga() {
  yield customSagaAll([visitsWatcher()]);
}
