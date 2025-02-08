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
} from '../../../state/features/amenities/amenities.slice';
import {apiResponse} from '../api.interface';
import amenitiesService from './amenities.service';

function* amenitiesWatcher() {
  yield customTakeEvery(`${sliceName.amenitiesSlice}/isGettingAction`, getList);
  yield customTakeEvery(
    `${sliceName.amenitiesSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.amenitiesSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(`${sliceName.amenitiesSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(amenitiesService.list, payload);
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
export default function* amenitiesSaga() {
  yield customSagaAll([amenitiesWatcher()]);
}
