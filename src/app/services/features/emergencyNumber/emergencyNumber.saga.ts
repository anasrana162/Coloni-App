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
} from '../../../state/features/emergencyNumber/emergencyNumber.slice';
import {apiResponse} from '../api.interface';
import expensesService from './emergencyNumber.service';

function* emergencyNumberWatcher() {
  yield customTakeEvery(
    `${sliceName.emergencyNumbers}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.emergencyNumbers}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.emergencyNumbers}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.emergencyNumbers}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(expensesService.list, payload);
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

export default function* emergencyNumberSaga() {
  yield customSagaAll([emergencyNumberWatcher()]);
}
