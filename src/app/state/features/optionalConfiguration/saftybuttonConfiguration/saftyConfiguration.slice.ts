import { commonReducers } from '../../../common.reducer';
import { createSlice } from '@reduxjs/toolkit';
import { sliceName } from '../../../sliceName.state';
import { commonListStates } from '../../../common.state';
import { commonReducersFunction } from '../../../../types/states.interface';
const saftyConfigurationSlice = createSlice({
    name: sliceName.saftyConfigurationSlice,
    initialState: commonListStates,
    reducers: {
        ...commonReducers,
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
}: commonReducersFunction = saftyConfigurationSlice.actions;
export default saftyConfigurationSlice.reducer;
