import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Admin {
    id: number,
    name: string,
    email: string,
    password: string,
}

type AdminState = Admin | null;
const initialState: AdminState = null;

const adminSlice = createSlice({
    name: 'admin',
    initialState: initialState as AdminState,
    reducers: {
        setAdmin: (_state, action: PayloadAction<Admin>) => {
            return action.payload;},
        clearAdmin: () => null,
    },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;