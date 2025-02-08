import {commonReducers} from '../../common.reducer';
import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../../sliceName.state';
import {CommonState, commonListStates} from '../../common.state';
import {commonReducersFunction} from '../../../types/states.interface';

const surveysSlice = createSlice({
  name: sliceName.surveysSlice,
  initialState: {...commonListStates, status: 'assets',period:new Date() },
  reducers: {
    ...commonReducers,
    searchingAction: (state: CommonState, {payload = {}}: any) => {
      state.page = 1;
      state.perPage = 10;
      state.isLoading = true;
      state.status = payload?.status;
      state.list = commonListStates.list;
      state.period = payload?.period || state.period;
      state.hasMore = false;
    },
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
}: commonReducersFunction = surveysSlice.actions;
export default surveysSlice.reducer;
