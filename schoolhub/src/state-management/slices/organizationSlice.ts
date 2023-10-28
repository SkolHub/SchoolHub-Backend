import { createAsyncThunk, createSlice,  } from '@reduxjs/toolkit';
import { organization } from '../models';
import { getOrganizationClasses, getOrganizations } from '../controllers/organizationController';

interface OrganizationStateModel {
    activeOrganization: number,
    organizations: organization[]
}

const initialState: OrganizationStateModel = {
    activeOrganization: -1,
    organizations: []
}

export const fetchOrganizations = createAsyncThunk('organization/fetchOrganizations', async () => {
    try {
        return (await getOrganizations()).data;
    } catch (error) {
        return error;
    }
});

export const fetchClasses = createAsyncThunk('organization/fetchClasses', async (id: number) => {
    try {
        return (await getOrganizationClasses(id)).data;
    } catch (error) {
        return error;
    }
});

export const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchOrganizations.fulfilled, (state, action) => {
            state.organizations = action.payload;
        });
        builder.addCase(fetchClasses.fulfilled, (state, action) => {
            state.organizations = 
        })
    }
});

export const {  } = organizationSlice.actions;

export default organizationSlice.reducer;

