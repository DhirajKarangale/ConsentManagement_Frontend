import { configureStore } from '@reduxjs/toolkit'
import adminReducer from './admin-slice'
import organizationReducer from './organization-slice'

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        organization: organizationReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch