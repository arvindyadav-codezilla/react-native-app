import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cardData: null, // Updated key name
  selectedRefreshCardData: null,
};

const SelectedCardDetailsSlice = createSlice({
  name: 'cardSelectDetails', // Updated slice name
  initialState,
  reducers: {
    setCardDetails: (state, action) => {
      state.cardData = action.payload; // Updated state property
    },
    clearCardDetails: state => {
      state.cardData = null; // Updated state property
    },
    refreshCaseloadCard: (state, action) => {
      state.selectedRefreshCardData = action.payload; // Set refresh card data
    },
  },
});

export const {setCardDetails, clearCardDetails, refreshCaseloadCard} =
  SelectedCardDetailsSlice.actions; // Updated action names

export const selectCaseloadCardData = state => {
  return state.cardSelectDetails.selectCard;
};
export const selectRefreshCaseloadCardData = state => {
  return state.cardSelectDetails.selectCard.selectedRefreshCardData;
};

export default SelectedCardDetailsSlice.reducer;
