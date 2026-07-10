import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const detailedPackageSlice = createSlice({
  name: "Detailed-Package",
  initialState,
  reducers: {
    setPackage: (state, action) => {
      const exists = state.value.find((p) => p.id === action.payload.id);
      if (!exists) state.value.push(action.payload);
    },
  },
});

export const { setPackage } = detailedPackageSlice.actions;

// ✅ Selector — takes id as argument
export const getPackageById = (id) => (state) =>
  state.detailedPackages.value.find((pkg) => pkg.id === id);

export default detailedPackageSlice.reducer;
