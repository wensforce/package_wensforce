import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const activePackageSlice = createSlice({
  name: "activePackages",
  initialState,
  reducers: {
    setActivePackages: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setActivePackages } = activePackageSlice.actions;

export default activePackageSlice.reducer;
