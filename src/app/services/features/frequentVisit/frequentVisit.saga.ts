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
} from '../../../state/features/frequentVisit/frequentVisit.slice';
import {apiResponse} from '../api.interface';
import frequentVisitsService from './frequentVisit.service';

function* frequentVisitWatcher() {
  yield customTakeEvery(
    `${sliceName.frequentVisitSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.frequentVisitSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.frequentVisitSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.frequentVisitSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(frequentVisitsService.list, payload);
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

export default function* frequentVisitSaga() {
  yield customSagaAll([frequentVisitWatcher()]);
}
