import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/async/productSlice.js'
import notificationReducer from '../features/normal/notificationSlice.js'

export const store = configureStore({
    reducer: {
        items: productsReducer,
        notifications: notificationReducer,
    },
})