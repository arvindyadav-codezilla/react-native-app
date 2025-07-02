import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  caseloadSelectedData: null, // Updated key name
};

const caseloadSelectedSlice = createSlice({
  name: 'caseloadSelected', // Updated slice name
  initialState,
  reducers: {
    setCaseloadDetails: (state, action) => {
      state.caseloadSelectedData = action.payload; // Updated state property
    },
    clearCaseloadDetails: state => {
      state.caseloadSelectedData = null; // Updated state property
    },
  },
});

export const {setCaseloadDetails, clearCaseloadDetails} =
  caseloadSelectedSlice.actions; // Updated action names

export const selectCaseloadData = state => {
  return state.caseload.caseloadSelected.caseloadSelectedData;
};
// state.caseloadSelected.caseloadSelectedData; // Updated selector function

export default caseloadSelectedSlice.reducer;
