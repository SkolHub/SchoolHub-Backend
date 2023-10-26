import { createSlice } from '@reduxjs/toolkit';
import { organization } from '../models';

interface OrganizationStateModel {
    activeOrganization: number,
    organizations: organization[]
}

const initialState: OrganizationStateModel = {
    activeOrganization: -1,
    organizations: []
}

export const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {

    }
});

export const {  } = organizationSlice.actions;

export default organizationSlice.reducer;

