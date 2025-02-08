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
} from '../../../state/features/SuperAdmin/SuperAdminSlice';
import {apiResponse} from '../api.interface';
import ColonySuperAdmin from './colonySuperAdmin.services';

function* colonySupeAdminWatcher() {
  yield customTakeEvery(
    `${sliceName.Colonyslice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.Colonyslice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.Colonyslice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.Colonyslice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(ColonySuperAdmin.list,payload);
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
export default function*colonySupeAdminSaga() {
  yield customSagaAll([colonySupeAdminWatcher()]);
}
