// loginSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isNetworkError: false,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkError: (state, action) => {
      state.isNetworkError = action.payload;
    },
    clearNetworkError: state => {
      state.isNetworkError = false;
    },
  },
});

export const {setNetworkError, clearNetworkError} = networkSlice.actions;
export const selectNetworkError = state => state.NetworkDetails.networkError;

export default networkSlice.reducer;
