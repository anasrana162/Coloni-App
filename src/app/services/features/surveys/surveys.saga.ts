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
} from '../../../state/features/surveys/surveys.slice';
import {apiResponse} from '../api.interface';
import surveysService from './surveys.service';

function* surveysWatcher() {
  yield customTakeEvery(`${sliceName.surveysSlice}/isGettingAction`, getList);
  yield customTakeEvery(`${sliceName.surveysSlice}/gettingMoreAction`, getList);
  yield customTakeEvery(`${sliceName.surveysSlice}/refreshingAction`, getList);
  yield customTakeEvery(`${sliceName.surveysSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(surveysService.list, payload);
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
export default function* surveysSaga() {
  yield customSagaAll([surveysWatcher()]);
}
