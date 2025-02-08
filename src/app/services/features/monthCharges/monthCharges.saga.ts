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
} from '../../../state/features/monthCharges/monthCharges.slice';
import {apiResponse} from '../api.interface';
import monthChargesService from './monthCharges.service';

function* monthChargesWatcher() {
  yield customTakeEvery(
    `${sliceName.monthChargesSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.monthChargesSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.monthChargesSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.monthChargesSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  console.log('payload:', payload);
  const result = yield customCall(monthChargesService.list, payload);
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
export default function* monthChargesSaga() {
  yield customSagaAll([monthChargesWatcher()]);
}
