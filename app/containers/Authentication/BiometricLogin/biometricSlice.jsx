// src/store/biometricSlice.js
import {createSlice} from '@reduxjs/toolkit';

const biometricSlice = createSlice({
  name: 'biometric',
  initialState: {
    faceLockEnabled: false,
    fingerprintEnabled: false,
  },
  reducers: {
    setFaceLockEnabled: (state, action) => {
      state.faceLockEnabled = action.payload;
    },
    setFingerprintEnabled: (state, action) => {
      state.fingerprintEnabled = action.payload;
    },
  },
});

export const {setFaceLockEnabled, setFingerprintEnabled} = biometricSlice.actions;
export const selectBioMetric = state => state.biometric.biometric;
export default biometricSlice.reducer;
