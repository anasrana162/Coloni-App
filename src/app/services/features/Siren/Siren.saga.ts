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
} from '../../../state/features/Siren/Siren.slice';
import {apiResponse} from '../api.interface';
import SirenServices from './Siren.services';

function* SirenWatcher() {
  yield customTakeEvery(`${sliceName.Siren}/isGettingAction`, getList);
  yield customTakeEvery(
    `${sliceName.Siren}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(`${sliceName.Siren}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.Siren}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(SirenServices.list);
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
export default function* SirenSaga() {
  yield customSagaAll([SirenWatcher()]);
}
