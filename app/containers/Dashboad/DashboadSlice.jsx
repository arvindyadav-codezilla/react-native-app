import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cardSelected: null,
};

const DashboadSlice = createSlice({
  name: 'dashboad',
  initialState,
  reducers: {
    setSelectedPatient: (state, action) => {
      state.cardSelected = action.payload;
    },
    clearSelectedPatient: state => {
      state.cardSelected = null;
    },
  },
});

export const {setSelectedPatient, clearSelectedPatient} = DashboadSlice.actions;
export const selectPatientData = state => state.dashboad.patientData;

export default DashboadSlice.reducer;
