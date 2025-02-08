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
} from '../../../state/features/reportActivity/reportActivity.slice';
import {apiResponse} from '../api.interface';
import reportActivityService from './reportActivity.service';

function* reportActivityWatcher() {
  yield customTakeEvery(
    `${sliceName.reportActivitySlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.reportActivitySlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.reportActivitySlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.reportActivitySlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(reportActivityService.list, payload);
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
export default function* reportActivitySaga() {
  yield customSagaAll([reportActivityWatcher()]);
}
