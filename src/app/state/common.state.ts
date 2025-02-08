export type CommonState = {
  list: any[];
  isGetting: boolean;
  isLoading: boolean;
  page: number;
  perPage: number;
  hasMore: boolean;
  gettingMore: boolean;
  refreshing: boolean;
  search: string;
  total: number;
  totalAmount: number;
  totalPages?: any; 
  [key: string]: any;
};

export const commonListStates: CommonState = {
  list: [],
  isGetting: false,
  isLoading: false,
  page: 1,
  perPage: 10,
  hasMore: false,
  gettingMore: false,
  refreshing: false,
  totalPages: 0, 
  search: '',
  total: 0,
  totalAmount: 0, 
};
