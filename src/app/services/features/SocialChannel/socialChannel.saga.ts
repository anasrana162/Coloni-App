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
} from '../../../state/features/SocialChannel/SocialChannel.slice';
import {apiResponse} from '../api.interface';
import SocialChannelService from './socialChannel.services';

function* socialChannelWatcher() {
  yield customTakeEvery(
    `${sliceName.SocialChannel}/isGettingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.SocialChannel}/gettingMoreAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.SocialChannel}/refreshingAction`,
    getList,
  );
  yield customTakeEvery(
    `${sliceName.SocialChannel}/searchingAction`,
    getList,
  );
}

function* getList({payload}: AnyAction): Generator {
  const result = yield customCall(SocialChannelService.list, payload);
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
export default function* socialChannelSaga() {
  yield customSagaAll([socialChannelWatcher()]);
}
