import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './slices/accountSlice';
import organizationSlice from './slices/organizationSlice';

export default configureStore({
    reducer: {
        organization: organizationSlice,
        account: accountSlice
    }
});