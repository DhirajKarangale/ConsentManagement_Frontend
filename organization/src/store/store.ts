import { configureStore } from '@reduxjs/toolkit'
import organizationReducer from './organization-slice'

export const store = configureStore({
    reducer: {
        organization: organizationReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch