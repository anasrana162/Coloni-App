import {customConfigureStore, sagaMiddleWare} from '../packages/redux.package';
import {customMiddleware} from './customMiddleware';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const saga = sagaMiddleWare();
const store = customConfigureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
    }).concat(customMiddleware, saga),
  devTools: false,
});
saga.run(rootSaga);
export default store;
