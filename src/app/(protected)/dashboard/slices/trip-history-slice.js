import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value:[]
}

const tripHistorySlice=createSlice({
    name:"tripHistory",
    initialState,
    reducers:{
        setTripHistory:(state,action)=>{
            state.value=action.payload
        },
        
       
    }
})

export const {setTripHistory}=tripHistorySlice.actions;

export default tripHistorySlice.reducer;