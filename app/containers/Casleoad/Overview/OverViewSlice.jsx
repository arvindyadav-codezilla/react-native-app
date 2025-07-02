import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  overViewDetails: null,
};

const OverViewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {
    setOverviewDetils: (state, action) => {
      state.overViewDetails = action.payload;
    },
    clearOverViewDetails: state => {
      state.overViewDetails = null;
    },
  },
});

export const {setOverviewDetils, clearOverViewDetails} = OverViewSlice?.actions;

// Selector function to access overViewDetails from state
export const selectOverViewData = state =>
  state?.overview?.overViewDetail?.overViewDetails;

export default OverViewSlice.reducer;
