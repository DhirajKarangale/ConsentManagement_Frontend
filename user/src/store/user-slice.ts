import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: number,
    name: string,
    email: string,
    password: string,
}

type UserState = User | null;
const initialState: UserState = null;

const userSlice = createSlice({
    name: 'user',
    initialState: initialState as UserState,
    reducers: {
        setUser: (_state, action: PayloadAction<User>) => {
            return action.payload;},
        clearUser: () => null,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;