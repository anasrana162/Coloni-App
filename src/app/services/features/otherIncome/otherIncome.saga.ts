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
} from '../../../state/features/otherIncome/otherIncome.slice';
import {apiResponse} from '../api.interface';
import otherIncomeService from './otherIncome.service';

function* otherIncomeWatcher() {
  yield customTakeEvery(
    `${sliceName.otherIncomeSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.otherIncomeSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.otherIncomeSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.otherIncomeSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(otherIncomeService.list, payload);
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
export default function* otherIncomeSaga() {
  yield customSagaAll([otherIncomeWatcher()]);
}
