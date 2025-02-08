import { isEmpty } from '../utilities/helper';
import { CommonState, commonListStates } from './common.state';

export const commonReducers = {
  isGettingAction: (state: CommonState, action: any) => {
    const { payload } = action;
    const flag = payload?.isLoading ?? true;
    state.isLoading = flag;
  },
  gettingSuccess: (state: CommonState, action: any) => {
    const { payload } = action;

    const list = Array.isArray(payload?.list) ? payload.list : [];
    if (state.page > 1) {
      state.list = [...state.list, ...list];
    } else {
      state.list = list;
    }

    state.gettingMore = false;
    state.refreshing = false;
    state.isGetting = true;
    state.isLoading = false;
    state.list = [...list];
    state.page = payload.page;
    state.totalPages = payload.totalPages;
    state.results = payload.results;
    state.hasMore = payload.length >= state.perPage ? true : false;
    state.totalAmount = payload.total;
    state.total = payload?.results || 0;
  },
  updateAction: (state: CommonState, { payload = {} }: any) => {
    const { id, item, index } = payload;
    if (index || index === 0) {
      state.list[index] = item;
      return;
    }
    const existingItemIndex = state.list.findIndex(_item => _item?._id === id);
    if (existingItemIndex !== -1) {
      state.list[existingItemIndex] = item;
    }
  },
  addAction: (state: CommonState, { payload = {} }: any) => {
    if (!isEmpty(payload)) {
      state.list.unshift(payload);
    }
  },
  deleteAction: (state: CommonState, { payload = {} }: any) => {
    const { index, id } = payload;
    if (index || index === 0) {
      state.list.splice(index, 1);
      return;
    } else {
      state.list = state.list.filter((_i: any) => _i?._id !== id);
    }
  },
  gettingError: (state: CommonState) => {
    state.gettingMore = false;
    state.refreshing = false;
    state.isGetting = true;
    state.isLoading = false;
  },
  gettingMoreAction: (state: CommonState) => {
    state.gettingMore = true;
    state.hasMore = false;
  },
  refreshingAction: (state: CommonState) => {
    state.page = 1;
    state.hasMore = false;
    state.refreshing = true;
    state.gettingMore = false;
    state.list = []; //new line added
  },
  searchingAction: (state: CommonState, { payload = {} }: any) => {
    state.page = 1;
    state.perPage = 10;
    state.isLoading = true;
    state.search = payload?.search;
    // state.list = commonListStates.list; //previous code
    state.list = []; //new line added
    state.hasMore = false;
  },
  //previous code
  // clearAction: (state: CommonState) => {
  // for (const property in commonListStates) {
  //   state[property] = commonListStates[property];
  // }
  clearAction: (state: CommonState) => {
    Object.assign(state, commonListStates);
  },
};
