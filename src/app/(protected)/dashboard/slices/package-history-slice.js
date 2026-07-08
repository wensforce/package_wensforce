import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value:[]
}

const packageHistorySlice=createSlice({
    name:"packageHistorySlice",
    initialState,
    reducers:{
        setPackageHistory:(state,action)=>{
            state.value=action.payload
        },
        
       
    }
})


export const {setPackageHistory}=packageHistorySlice.actions;

export default packageHistorySlice.reducer;