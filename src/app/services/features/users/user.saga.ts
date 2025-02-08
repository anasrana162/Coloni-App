import { Platform } from 'react-native';
import {
  getLocalData,
  storeLocalData,
} from '../../../packages/asyncStorage/storageHandle';
import { getUniqueIdHelper } from '../../../packages/device-info/deviceInfo.handler';
import { getMessagingToken } from '../../../packages/firebase/firebase.index';
import {
  customCall,
  customPut,
  customSagaAll,
  customTakeEvery,
} from '../../../packages/redux.package';
import { sliceName } from '../../../state/sliceName.state';
import { apiResponse } from '../api.interface';
import userService from './user.service';
import { config } from '../../../../Config';
import userSlice, { gettingError, gettingSuccess } from '../../../state/features/user/user.slice';



function* userWatcher() {
  yield customTakeEvery(
    `${sliceName.userSlice}/saveGCMToken`,
    saveGCMTokenSaga,
  );
  yield customTakeEvery(`${sliceName.userSlice}/residents`, getList)
}
function* saveGCMTokenSaga(): Generator {
  const messageToken = yield getMessagingToken();
  const id = yield getUniqueIdHelper();
  if (id && messageToken) {
    let flag = yield getLocalData.gcmFlag();
    if (!flag) {
      const response = yield customCall(userService.storeFCMToken, {
        deviceId: messageToken,
        deviceToken: config.serverKey,
        deviceType: Platform.OS,
      });
      const { status } = response as apiResponse;
      if (status) {
        storeLocalData.storeGcmFlag(true);
      }
    }
  }
}


function* getList(): Generator {
  try {
    const result = yield customCall(userService.Resident);
    if (!result) {
      yield customPut(gettingError());
      return;
    }

    const { status, body } = result as apiResponse;

    if (status) {
      yield customPut(gettingSuccess(body));
    } else {
      yield customPut(gettingError());
    }
  } catch (error) {
    yield customPut(gettingError());
  }
}



export default function* userSaga() {
  yield customSagaAll([userWatcher()]);
}
