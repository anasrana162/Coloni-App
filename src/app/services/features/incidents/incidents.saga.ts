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
} from '../../../state/features/incidents/incidents.slice';
import {apiResponse} from '../api.interface';
import incidentsService from './incidents.service';

function* incidentsWatcher() {
  yield customTakeEvery(`${sliceName.incidentsSlice}/isGettingAction`, getList);
  yield customTakeEvery(
    `${sliceName.incidentsSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.incidentsSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(`${sliceName.incidentsSlice}/searchingAction`, getList);
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(incidentsService.list, payload);
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
export default function* incidentsSaga() {
  yield customSagaAll([incidentsWatcher()]);
}
