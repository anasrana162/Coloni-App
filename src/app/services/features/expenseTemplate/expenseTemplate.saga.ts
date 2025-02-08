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
} from '../../../state/features/expenseTemplate/expenseTemplate.slice';
import {apiResponse} from '../api.interface';
import expenseTemplateService from './expenseTemplate.service';

function* expenseTemplateWatcher() {
  yield customTakeEvery(
    `${sliceName.expenseTemplateSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.expenseTemplateSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.expenseTemplateSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.expenseTemplateSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(expenseTemplateService.list, payload);
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
export default function* expenseTemplateSaga() {
  yield customSagaAll([expenseTemplateWatcher()]);
}
