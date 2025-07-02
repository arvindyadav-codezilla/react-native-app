import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tabState: false,
};

const TabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    toggleTabState: (state, action) => {
      state.tabState = action.payload;
    },
  },
});

export const {toggleTabState} = TabSlice.actions;
export const selectTabState = state => state.tab.TabDetail.tabState;

export default TabSlice.reducer;
