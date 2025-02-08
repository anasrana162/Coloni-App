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
} from '../../../state/features/QrReader/QrReaderSlice';
import {apiResponse} from '../api.interface';
import QrReaderService from './QrReader.Services';

function* qrReaderWatcher() {
  yield customTakeEvery(
    `${sliceName.QrReaderSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.QrReaderSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.QrReaderSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.QrReaderSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(QrReaderService.list, payload);
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
export default function* QrReaderSaga() {
  yield customSagaAll([qrReaderWatcher()]);
}
