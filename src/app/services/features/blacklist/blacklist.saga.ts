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
} from '../../../state/features/blacklist/blacklist.slice';
import {apiResponse} from '../api.interface';
import blacklistService from './blacklist.service';

function* blacklistWatcher() {
  yield customTakeEvery(`${sliceName.blacklistSlice}/isGettingAction`, getList);
  yield customTakeEvery(
    `${sliceName.blacklistSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.blacklistSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(`${sliceName.blacklistSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(blacklistService.list, payload);
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
export default function* blacklistSaga() {
  yield customSagaAll([blacklistWatcher()]);
}
