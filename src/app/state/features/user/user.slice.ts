import { customCreateSlice } from '../../../packages/redux.package';
import { commonReducersFunction } from '../../../types/states.interface';
import { commonReducers } from '../../common.reducer';
import { commonListStates, CommonState } from '../../common.state';
import { sliceName } from '../../sliceName.state';

const authStates: any = {};

const userSlice: any = customCreateSlice({
  name: sliceName.userSlice,
  initialState: commonListStates,
  reducers: {
    ...commonReducers,
    saveGCMToken: () => { },
    residents: (state, { payload }) => {
      state.list = payload.list; 
      state.page = payload.page;
      state.perPage = payload.perPage;
      state.totalPages = payload.totalPages;
      state.hasMore = state.page < state.totalPages;
      state.isLoading = false; 
    },
    searchingAction: (state, { payload }) => {
      state.page = 1;
      state.perPage = 10;
      state.isLoading = true;
      state.search = payload?.search;
      state.status = payload?.status;
      state.list = [];
      state.hasMore = false;
      state.date = payload?.date;
    },

  },
});


export const { saveGCMToken, residents }: any = userSlice.actions;
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
}: commonReducersFunction = userSlice.actions;

export default userSlice.reducer;
