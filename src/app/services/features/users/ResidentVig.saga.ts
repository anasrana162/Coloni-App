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
} from '../../../state/features/user/ResidentVig.slice';
import {apiResponse} from '../api.interface';
import userService from "./user.service";

function* residentVigWatcher() {
  yield customTakeEvery(`${sliceName.servicesSlice}/isGettingAction`, getList);
  yield customTakeEvery(
    `${sliceName.servicesSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(`${sliceName.servicesSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.servicesSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(userService.ResidentVig, payload);
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
export default function* residentVigSaga() {
  yield customSagaAll([residentVigWatcher()]);
}
