import {commonReducers} from '../../common.reducer';
import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../../sliceName.state';
import {CommonState, commonListStates} from '../../common.state';
import {commonReducersFunction} from '../../../types/states.interface';

const SuperAdminSlice = createSlice({
  name: sliceName.Colonyslice,
  initialState: {...commonListStates},
  reducers: {
    ...commonReducers,
    searchingAction: (state: CommonState, {payload = {}}: any) => {
      state.page = 1;
      state.perPage = 10;
      state.isLoading = true;
      state.search = payload?.search;
      state.status = payload?.status;
      state.list = commonListStates.list;
      state.hasMore = false;
      state.date = payload?.date;
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
}: commonReducersFunction = SuperAdminSlice.actions;
export default SuperAdminSlice.reducer;
