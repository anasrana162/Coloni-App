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
} from '../../../state/features/documents/documents.slice';
import {apiResponse} from '../api.interface';
import documentsService from './documents.service';

function* documentsWatcher() {
  yield customTakeEvery(`${sliceName.documentsSlice}/isGettingAction`, getList);
  yield customTakeEvery(
    `${sliceName.documentsSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.documentsSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(`${sliceName.documentsSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  console.log('payload', payload);
  // console.log('isAdmin', payload?.isAdmin);
  var apiUrl = payload?.isAdmin
    ? documentsService.list
    : documentsService.listResidentDoc;
  !payload?.isAdmin && delete payload.period;
  const result = yield customCall(apiUrl, payload);
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
export default function* documentsSaga() {
  yield customSagaAll([documentsWatcher()]);
}
