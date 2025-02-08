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
} from '../../../state/features/accountStatus/accountStatus.slice';
import {apiResponse} from '../api.interface';
import accountStatusService from './accountStatus.service';

function* accountStatusWatcher() {
  yield customTakeEvery(
    `${sliceName.accountStatusSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.accountStatusSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.accountStatusSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.accountStatusSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(accountStatusService.list, payload);
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
export default function* accountStatusSaga() {
  yield customSagaAll([accountStatusWatcher()]);
}
