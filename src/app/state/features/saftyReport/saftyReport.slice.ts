import {commonReducers} from '../../common.reducer';
import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../../sliceName.state';
import {commonListStates} from '../../common.state';
import {commonReducersFunction} from '../../../types/states.interface';

const saftyReportSlice = createSlice({
  name: sliceName.saftyReportSlice,
  initialState: {...commonListStates},
  reducers: {
    ...commonReducers,
  },
});
export const {
  isGettingAction,
  gettingSuccess,
  gettingError,
  searchingAction,
  gettingMoreAction,
  refreshingAction,
  updateAction,
  addAction,
  clearAction,
  deleteAction,
}: commonReducersFunction = saftyReportSlice.actions;
export default saftyReportSlice.reducer;
