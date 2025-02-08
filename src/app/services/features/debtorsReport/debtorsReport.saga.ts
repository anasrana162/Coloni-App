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
} from '../../../state/features/debtorsReport/debtorsReport.slice';
import {apiResponse} from '../api.interface';
import debtorsReportService from './debtorsReport.service';

function* debtorsReportWatcher() {
  yield customTakeEvery(
    `${sliceName.debtorsReportSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.debtorsReportSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.debtorsReportSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.debtorsReportSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(debtorsReportService.list, payload);
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
export default function* debtorsReportSaga() {
  yield customSagaAll([debtorsReportWatcher()]);
}
