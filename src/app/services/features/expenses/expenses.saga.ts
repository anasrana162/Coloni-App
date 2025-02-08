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
} from '../../../state/features/expenses/expense.slice';
import {apiResponse} from '../api.interface';
import expensesService from './expenses.service';

function* expenseWatcher() {
  yield customTakeEvery(`${sliceName.expenseSlice}/isGettingAction`, getList);
  yield customTakeEvery(`${sliceName.expenseSlice}/gettingMoreAction`, getList);
  yield customTakeEvery(`${sliceName.expenseSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.expenseSlice}/searchingAction`, getList);
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

export default function* expenseSaga() {
  yield customSagaAll([expenseWatcher()]);
}
