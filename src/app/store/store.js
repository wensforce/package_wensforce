import { configureStore } from "@reduxjs/toolkit";
import packageReducer from "../membership/slices/package-slice";
import detailedPackageReducer from "../membership/slices/detailed-package-slice";

export const store =configureStore({
    reducer:{
        packages:packageReducer,
        detailedPackages: detailedPackageReducer,
    }
})
