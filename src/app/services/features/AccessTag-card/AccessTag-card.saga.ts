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
} from '../../../state/features/AccessTagCard/AccessTagCardSlice';
import {apiResponse} from '../api.interface';
import accessTagCardService from './AccessTag-card.Services';

function* accessTagCardWatcher() {
  yield customTakeEvery(
    `${sliceName.AccessTagCardSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AccessTagCardSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AccessTagCardSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.AccessTagCardSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(accessTagCardService.list, payload);
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
export default function* accessTagCardSaga() {
  yield customSagaAll([accessTagCardWatcher()]);
}
