import {commonReducers} from '../../common.reducer';
import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../../sliceName.state';
import {CommonState, commonListStates} from '../../common.state';
import {commonReducersFunction} from '../../../types/states.interface';

const expenseSlice = createSlice({
  name: sliceName.expenseSlice,
  initialState: {
    ...commonListStates,
    date: new Date(),
    tab: false,
    select: false,
    visible: false,
    category: 'performed',
  },
  reducers: {
    ...commonReducers,
    searchingAction: (state: CommonState, {payload = {}}: any) => {
      state.page = 1;
      state.perPage = 10;
      state.isLoading = true;
      state.search = payload?.search;
      state.date = payload?.date;
      state.tab = payload?.tab;
      state.select = payload?.select;
      state.visible = payload?.visible;
      state.category = payload?.category; 
      state.list = commonListStates.list;
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
}: commonReducersFunction = expenseSlice.actions;
export default expenseSlice.reducer;
