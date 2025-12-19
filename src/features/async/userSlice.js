import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    users: [],
    loading: false,
    error: null,
};

export const fetchAllUsers = createAsyncThunk(
    "users/fetchAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(
                `/api/users`,
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "حدث خطأ أثناء إضافة المنتج للعربة";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editUser = createAsyncThunk(
    "users/editUser",
    async (uploaded, thunkAPI) => {
        try {
            const response = await axios.put(
                `/api/users`,
                uploaded,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "فشل تحديث بيانات المستخدم";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const uploadProductToCart = createAsyncThunk(
    "users/uploadProductToCart",
    async ({ savedProductsId }, thunkAPI) => {
        try {
            const response = await axios.post(
                `/api/users/addToCart`,
                { savedProductsId }, // req.json()
                { withCredentials: true } // to pass jwt
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "حدث خطأ أثناء إضافة المنتج للعربة";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "users/removeFromCart",
    async (productId, thunkAPI) => {
        try {
            const response = await axios.delete(
                `/api/users/addToCart`,
                {
                    data: { productId },
                    withCredentials: true
                }
            );
            thunkAPI.dispatch(fetchAllUsers());
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "حدث خطأ أثناء حذف المنتج";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(uploadProductToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadProductToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.products = action.payload.cart || state.products;
            })
            .addCase(uploadProductToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export default userSlice.reducer;