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
} from '../../../state/features/DismissVisit/DismissVisitSlice';
import {apiResponse} from '../api.interface';
import dismissVisitServices from './DismissVisitServices';

function* dismissVisitWatcher() {
  yield customTakeEvery(
    `${sliceName.DismissVisitSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.DismissVisitSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.DismissVisitSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.DismissVisitSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(dismissVisitServices.list, payload);
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
export default function* DismissVisitSaga() {
  yield customSagaAll([dismissVisitWatcher()]);
}
