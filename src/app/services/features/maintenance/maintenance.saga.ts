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
} from '../../../state/features/maintenance/maintenance.slice';
import {apiResponse} from '../api.interface';
import maintenanceService from './maintenance.service';

function* maintenanceWatcher() {
  yield customTakeEvery(
    `${sliceName.maintenanceSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.maintenanceSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.maintenanceSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.maintenanceSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(maintenanceService.list, payload);
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
export default function* maintenanceSaga() {
  yield customSagaAll([maintenanceWatcher()]);
}
