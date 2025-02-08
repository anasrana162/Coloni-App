import {commonReducers} from '../../common.reducer';
import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../../sliceName.state';
import {CommonState, commonListStates} from '../../common.state';
import {commonReducersFunction} from '../../../types/states.interface';

const accountStatusSlice = createSlice({
  name: sliceName.accountStatusSlice,
  initialState: {
    list: [],
    isGetting: false,
    isLoading: false,
    page: 1,
    perPage: 10,
    hasMore: false,
    gettingMore: false,
    refreshing: false,
    search: '',
    total: 0,
    status: 'asset',
    date: new Date(),
  },
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
}: commonReducersFunction = accountStatusSlice.actions;
export default accountStatusSlice.reducer;
