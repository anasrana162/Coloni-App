import {
  useDispatch as customUseDispatch,
  useSelector as customUseSelector,
  Provider as CustomReduxProvider,
  getDefaultMiddleware as customGetDefaultMiddleware,
  connect as customConnect,
} from 'react-redux';
import {
  call as customCall,
  put as customPut,
  takeEvery as customTakeEvery,
  takeLatest as customTakeLatest,
  all as customSagaAll,
  delay as customDelay,
  select as customSelect,
} from 'redux-saga/effects';

import createSagaMiddleware from 'redux-saga';

import {
  createSlice as customCreateSlice,
  combineReducers as customCombineReducers,
  configureStore as customConfigureStore,
  AnyAction as CustomAnyAction,
} from '@reduxjs/toolkit';

export {
  CustomReduxProvider,
  customUseDispatch,
  customUseSelector,
  customGetDefaultMiddleware,
  customConnect,
  customCreateSlice,
  customCombineReducers,
  customConfigureStore,
  createSagaMiddleware as sagaMiddleWare,
  customCall,
  customPut,
  customSagaAll,
  customTakeEvery,
  customTakeLatest,
  CustomAnyAction,
  customDelay,
  customSelect,
};
