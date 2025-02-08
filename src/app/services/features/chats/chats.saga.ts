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
} from '../../../state/features/chats/chats.slice';
import {apiResponse} from '../api.interface';
import chatsService from './chats.service';


function* chatsWatcher() {
  yield customTakeEvery(
    `${sliceName.chatsSlice}/isGettingAction`,
    getListContact,
  );
  yield customTakeEvery(
    `${sliceName.chatsSlice}/gettingMoreAction`,
    getListContact,
  );
  yield customTakeEvery(
    `${sliceName.chatsSlice}/refreshingAction`,
    getListContact,
  );
  yield customTakeEvery(
    `${sliceName.chatsSlice}/searchingAction`,
    searchListContact,
  );
}


interface ApiResponse {
  success: boolean;
  data: any; // Change 'any' to the specific type of your data if possible
}

function* getListContact({payload}: AnyAction): Generator {

  // Assert the type of result
  const result = (yield customCall(
    chatsService.listContacts,
    payload,
  )) as ApiResponse | null;

  if (!result) {
    yield customPut(gettingError());
    return;
  }

  const {success, data} = result;
  var obj = {
    list: data,
  };
  if (success) {
    yield customPut(gettingSuccess(obj));
  } else {
    yield customPut(gettingError());
  }
}
function* searchListContact({payload}: AnyAction): Generator {
  console.log('payload:', payload);
}
export default function* chatsSaga() {
  yield customSagaAll([chatsWatcher()]);
}
