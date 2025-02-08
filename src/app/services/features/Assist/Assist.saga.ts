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
} from '../../../state/features/Assist/AssistsSlice';
import {apiResponse} from '../api.interface';
import assistService from './Assist.service';

function* AssistWatcher() {
  yield customTakeEvery(
    `${sliceName.AssistSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AssistSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AssistSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AssistSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(assistService.list, payload);
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
export default function* AssistSaga() {
  yield customSagaAll([AssistWatcher()]);
}
