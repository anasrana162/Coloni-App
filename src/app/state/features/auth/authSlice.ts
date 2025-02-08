import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../../sliceName.state';
const initialState = {
  userInfo: null,
};
const authSlice = createSlice({
  name: sliceName.authSlice,
  initialState,
  reducers: {
    storeUserData: (state, {payload}) => {
      state.userInfo = payload;
    },
    clearAction: state => {
      state.userInfo = initialState.userInfo;
    },
  },
});
export const {storeUserData}: {storeUserData: (payload: string) => any} =
  authSlice.actions;
export default authSlice.reducer;
