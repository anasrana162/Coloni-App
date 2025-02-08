import {createSlice} from '@reduxjs/toolkit';
import {sliceName} from '../sliceName.state';
import {storeLocalData} from '../../packages/asyncStorage/storageHandle';
const initialState = {
  language: 'en',
};
const languageSlice = createSlice({
  name: sliceName.languageSlice,
  initialState,
  reducers: {
    updateLanguage: (state, {payload}) => {
      state.language = payload;
      storeLocalData.userLanguage(payload);
    },
  },
});
export const {updateLanguage}: {updateLanguage: (payload: string) => any} =
  languageSlice.actions;
export default languageSlice.reducer;
