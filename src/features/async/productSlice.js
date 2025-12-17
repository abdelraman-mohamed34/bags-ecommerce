import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    products: [],
    loading: false,
    error: '',
}

export const fetchAllProducts = createAsyncThunk(
    "products/fetchAllProducts",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/api/products");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postComment = createAsyncThunk(
    "products/postComment",
    async (commentData, thunkAPI) => {
        try {
            const response = await axios.post(
                "/api/products/addComment",
                commentData,
                { withCredentials: true, }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "حدث خطأ أثناء إضافة التعليق";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const productsSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // postComment
            .addCase(postComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postComment.fulfilled, (state, action) => {
                state.loading = false;
                const { productId, comment } = action.payload;
                const product = state.products.find(p => p._id === productId);
                if (product) {
                    product.comments.push(comment);
                }
            })
            .addCase(postComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

})

export const { } = productsSlice.actions

export default productsSlice.reducer