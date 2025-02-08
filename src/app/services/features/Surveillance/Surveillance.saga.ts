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
} from '../../../state/features/Surveillance/Surveillance.slice';
import {apiResponse} from '../api.interface';
import SurveillanceServices from './Surveillance.services';

function* SurveillanceWatcher(){
  yield customTakeEvery(
    `${sliceName.Surveillance}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.Surveillance}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.Surveillance}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.Surveillance}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(SurveillanceServices.list, payload);
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
export default function* SurveillanceSaga() {
  yield customSagaAll([SurveillanceWatcher()]);
}
