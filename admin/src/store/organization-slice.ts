import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Organization {
    id: number,
    name: string,
    email: string,
    password: string,
    websiteURL: string,
    description: string,
    status: string,
    createdAt: Date,
}

type OrganizationState = Organization | null;
const initialState: OrganizationState = null;

const organizationSlice = createSlice({
    name: 'organization',
    initialState: initialState as OrganizationState,
    reducers: {
        setOrganization: (_state, action: PayloadAction<Organization>) => {
            return action.payload;
        },
        clearOrganization: () => null,
    },
});

export const { setOrganization, clearOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;