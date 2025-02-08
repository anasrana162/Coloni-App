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
} from '../../../state/features/announcements/announcements.slice';
import {apiResponse} from '../api.interface';
import announcementsService from './announcements.service';

function* announcementsWatcher() {
  yield customTakeEvery(
    `${sliceName.announcementsSlice}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.announcementsSlice}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.announcementsSlice}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.announcementsSlice}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(announcementsService.list, payload);
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
export default function* announcementsSaga() {
  yield customSagaAll([announcementsWatcher()]);
}
