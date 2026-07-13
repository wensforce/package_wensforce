import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  loading: false,
  error: false,
};

const packageSlice = createSlice({
  name: "Package",
  initialState,
  reducers: {
    setPackages: (state, action) => {
      state.value = action.payload;
      state.loading = false;
      state.error = false;
    },
    setPackagesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPackagesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setPackages,
  setPackagesLoading,
  setPackagesError,
} = packageSlice.actions;

export default packageSlice.reducer;