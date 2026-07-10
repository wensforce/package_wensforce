import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value:[]
}

const packageSlice=createSlice({
    name:"Package",
    initialState,
    reducers:{
        setPackages:(state,action)=>{
            state.value=action.payload
        },
        
       
    }
})

export const {setPackages}=packageSlice.actions;

export default packageSlice.reducer;