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
} from '../../../state/features/EventualVisit/EventualVisit.slice';
import {apiResponse} from '../api.interface';
import eventualVisitsVisitlogsService from './eventualVisits.visitlogs.service';

function* EventualVisitWatcher() {
  yield customTakeEvery(
    `${sliceName.EventualVisitSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.EventualVisitSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.EventualVisitSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.EventualVisitSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(eventualVisitsVisitlogsService.list, payload);
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
export default function* EventualVisitSaga() {
  yield customSagaAll([EventualVisitWatcher()]);
}
