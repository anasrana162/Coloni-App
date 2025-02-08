import {commonReducers} from '../../common.reducer';
import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../../sliceName.state';
import {commonListStates} from '../../common.state';
import {commonReducersFunction} from '../../../types/states.interface';

const SurveillanceSlice = createSlice({
  name: sliceName.Surveillance,
  initialState: commonListStates,
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
}: commonReducersFunction = SurveillanceSlice.actions;
export default SurveillanceSlice.reducer;
