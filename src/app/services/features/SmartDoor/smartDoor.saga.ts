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
} from '../../../state/features/SmartDoor/smartDoorSlice';
import {apiResponse} from '../api.interface';
import SmartDoorService from './smartDoor.services';

function* SmartDoorWatcher(){
  yield customTakeEvery(
    `${sliceName.SmartDoorSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.SmartDoorSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.SmartDoorSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.SmartDoorSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(SmartDoorService.list, payload);
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
export default function* SmartDoorSaga() {
  yield customSagaAll([SmartDoorWatcher()]);
}
