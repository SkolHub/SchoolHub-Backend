import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    account: {
        firstName: '',
        lastName: '',
        email: '',
        username: ''
    }
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        
    }
});

export const {  } = accountSlice.actions;

export default accountSlice.reducer;