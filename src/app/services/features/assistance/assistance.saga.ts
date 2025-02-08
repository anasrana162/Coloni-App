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
} from '../../../state/features/Assistance/Assistance.slice';
import {apiResponse} from '../api.interface';
import assistanceService from './assistance.service';


function* AssistanceWatcher() {
  yield customTakeEvery(
    `${sliceName.AssistanceSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AssistanceSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AssistanceSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AssistanceSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(assistanceService.list, payload);
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
export default function* AssistanceSaga() {
  yield customSagaAll([AssistanceWatcher()]);
}
