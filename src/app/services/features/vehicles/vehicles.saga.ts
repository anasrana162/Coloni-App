import {AnyAction} from 'redux-saga';
import {
  customCall,
  customPut,
  customSagaAll,
  customTakeEvery,
} from '../../../packages/redux.package';
import {sliceName} from '../../../state/sliceName.state';
import {
  addAction,
  deleteAction,
  gettingError,
  gettingSuccess,
  updateAction,
} from '../../../state/features/vehicles/vehicle.slice';
import vehiclesService from './vehicles.service';
import {apiResponse} from '../api.interface';

function* getVehicles() {
  yield customTakeEvery(`${sliceName.vehicleSlice}/isGettingAction`, getList);
  yield customTakeEvery(`${sliceName.vehicleSlice}/gettingMoreAction`, getList);
  yield customTakeEvery(`${sliceName.vehicleSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.vehicleSlice}/searchingAction`, getList);
  yield customTakeEvery(
    `${sliceName.vehicleSlice}/deleteAction`,
    deleteVehicles,
  );
  yield customTakeEvery(`${sliceName.vehicleSlice}/addAction`, addVehicles);
  yield customTakeEvery(
    `${sliceName.vehicleSlice}/updateAction`,
    updateVehicles,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(vehiclesService.list, payload);
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
function* updateVehicles({payload}: any): Generator {
  const result = yield customCall(
    vehiclesService.update,
    payload?.object,
    payload?.id,
  );
  if (!result) {
    yield customPut(gettingError());
    return;
  }
  const {status, body} = result as apiResponse;
  if (status) {
    yield customPut(
      updateAction({item: body, id: payload?.id, index: payload?.index}),
    );
  } else {
    yield customPut(gettingError());
  }
}
function* addVehicles({payload}: AnyAction): Generator {
  const result = yield customCall(vehiclesService.create, payload);
  if (!result) {
    yield customPut(gettingError());
    return;
  }
  const {status, body} = result as apiResponse;
  if (status) {
    yield customPut(addAction({item: body}));
  } else {
    yield customPut(gettingError());
  }
}
function* deleteVehicles({payload}: AnyAction): Generator {
  const result = yield customCall(vehiclesService.delete, payload?.id);
  if (!result) {
    yield customPut(gettingError());
    return;
  }
  const {status, body} = result as apiResponse;
  if (status) {
    yield customPut(deleteAction({item: body}));
  } else {
    yield customPut(gettingError());
  }
}
export default function* vehicleSaga() {
  yield customSagaAll([getVehicles()]);
}
