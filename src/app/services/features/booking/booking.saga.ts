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
} from '../../../state/features/booking/booking.slice';
import {apiResponse} from '../api.interface';
import bookingService from './booking.service';

function* bookingWatcher() {
  yield customTakeEvery(`${sliceName.bookingSlice}/isGettingAction`, getList);
  yield customTakeEvery(`${sliceName.bookingSlice}/gettingMoreAction`, getList);
  yield customTakeEvery(`${sliceName.bookingSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.bookingSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(bookingService.list, payload);
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
export default function* bookingSaga() {
  yield customSagaAll([bookingWatcher()]);
}
