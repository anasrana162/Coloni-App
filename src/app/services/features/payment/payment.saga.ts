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
} from '../../../state/features/payments/payments.slice';
import vehiclesService from './payment.service';
import {apiResponse} from '../api.interface';
import paymentService from './payment.service';

function* paymentWatcher() {
  yield customTakeEvery(`${sliceName.paymentsSlice}/isGettingAction`, getList);
  yield customTakeEvery(
    `${sliceName.paymentsSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(`${sliceName.paymentsSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.paymentsSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(paymentService.list, payload);
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
export default function* paymentSaga() {
  yield customSagaAll([paymentWatcher()]);
}
