import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const paymentHistorySlice = createSlice({
  name: "paymentHistory",
  initialState,
  reducers: {
    setPaymentHistory: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPaymentHistory } = paymentHistorySlice.actions;

export default paymentHistorySlice.reducer;
