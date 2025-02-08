import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../sliceName.state';
import {storeLocalData} from '../../packages/asyncStorage/storageHandle';
const initialState = {
  theme: '',
};

const themeSlice = createSlice({
  name: sliceName.themeSlice,
  initialState,
  reducers: {
    updateTheme: (state, {payload}) => {
      state.theme = payload;
      storeLocalData.userTheme(payload);
    },
  },
});
export const {updateTheme}: {updateTheme: (payload: string) => any} =
  themeSlice.actions;
export default themeSlice.reducer;
