import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  logoutSuccess: false,
  // Add additional state to store data related to session end
  sessionData: null,
};

const LogoutSlice = createSlice({
  name: 'logout',
  initialState,
  reducers: {
    setLogoutSuccess: (state, action) => {
      state.logoutSuccess = action.payload;
    },
    clearLogoutSuccess: state => {
      state.logoutSuccess = false; // Reset to false on clear
      state.sessionData = null; // Clear session data
    },
    // Additional reducer to set session data
    setSessionData: (state, action) => {
      state.sessionData = action.payload;
    },
  },
});

export const {setLogoutSuccess, clearLogoutSuccess, setSessionData} =
  LogoutSlice.actions;

// Selector to get session data
export const selectSessionData = state => state.logout.logoutData;

export default LogoutSlice.reducer;
