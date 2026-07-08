import { configureStore } from "@reduxjs/toolkit";
import packageReducer from "../membership/slices/package-slice";
import detailedPackageReducer from "../membership/slices/detailed-package-slice";
import activePackageReducer from "../(protected)/dashboard/slices/active-packages-slice";
import tripHistoryReducer from "../(protected)/dashboard/slices/trip-history-slice";
import paymentHistoryReducer from "../(protected)/dashboard/slices/payment-history-slice";
import packageHistoryReducer from "../(protected)/dashboard/slices/package-history-slice";

export const store =configureStore({
    reducer:{
        packages:packageReducer,
        detailedPackages: detailedPackageReducer,
        activePackages:activePackageReducer,
        tripHistory:tripHistoryReducer,
        packageHistory:packageHistoryReducer,
        paymentHistory:paymentHistoryReducer

    }
})
