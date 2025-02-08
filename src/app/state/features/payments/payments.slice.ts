import { commonReducers } from '../../common.reducer';
import { createSlice } from '@reduxjs/toolkit';
import { sliceName } from '../../sliceName.state';
import { CommonState, commonListStates } from '../../common.state';
import { commonReducersFunction } from '../../../types/states.interface';

const paymentsSlice = createSlice({
  name: sliceName.paymentsSlice,
  initialState: { ...commonListStates, status: 'Pending' },
  reducers: {
    ...commonReducers,
    searchingAction: (state: CommonState, { payload = {} }: any) => {
      state.page = 1;
      state.perPage = 10;
      state.isLoading = true;
      state.search = payload?.search;
      state.list = commonListStates.list;
      state.hasMore = false;
      state.status = payload?.status;
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
}: commonReducersFunction = paymentsSlice.actions;
export default paymentsSlice.reducer;
