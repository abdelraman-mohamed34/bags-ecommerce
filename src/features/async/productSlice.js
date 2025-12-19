import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    products: [],
    loading: false,
    error: null,
}

export const fetchAllProducts = createAsyncThunk(
    "products/fetchAllProducts",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/api/products");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "حدث خطأ أثناء جلب المنتجات");
        }
    }
);

export const postComment = createAsyncThunk(
    "products/postComment",
    async ({ text, productId, rating }, thunkAPI) => {
        try {
            const response = await axios.post(
                `/api/products/comments`,
                { text, rating, productId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "حدث خطأ أثناء إضافة التعليق";
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const handleDeleteReview = createAsyncThunk(
    "products/deleteReview",
    async ({ productId, reviewId, reviewerId }, thunkAPI) => {
        try {
            const response = await axios.delete(
                `/api/products/comments`,
                {
                    data: { productId, reviewId, reviewerId },
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "حدث خطأ أثناء حذف التعليق";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addNewProduct = createAsyncThunk(
    "products/addNewProduct",
    async (formData, thunkAPI) => {
        try {
            const response = await axios.post(
                `/api/products`,
                formData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "حدث خطأ أثناء الرفع ";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (productId, thunkAPI) => {
        try {
            const response = await axios.delete(
                `/api/products`,
                {
                    data: { id: productId },
                    withCredentials: true
                });
            return productId;
        } catch (error) {
            const message = error.response?.data?.message || "حدث خطأ أثناء حذف المنتج";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchAllProducts
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
                    if (!product.comments) product.comments = [];
                    product.comments.push(comment);
                }
            })
            .addCase(postComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default productsSlice.reducer;
