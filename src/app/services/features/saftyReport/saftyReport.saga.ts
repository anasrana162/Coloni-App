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
} from '../../../state/features/saftyReport/saftyReport.slice';
import {apiResponse} from '../api.interface';
import saftyReportService from './saftyReport.service';

function* saftyReportWatcher() {
  yield customTakeEvery(
    `${sliceName.saftyReportSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.saftyReportSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.saftyReportSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.saftyReportSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(saftyReportService.list, payload);
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
export default function* saftyReportSaga() {
  yield customSagaAll([saftyReportWatcher()]);
}
