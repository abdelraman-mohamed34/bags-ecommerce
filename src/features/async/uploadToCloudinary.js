import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadImageToCloudinary = createAsyncThunk(
    "upload/image",
    async (file, thunkAPI) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "bags-ecommerce");
        formData.append("cloud_name", "dqhs2cpfl");

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dqhs2cpfl/image/upload`,
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            return thunkAPI.rejectWithValue("فشل رفع الصورة");
        }
    }
);

const uploadSlice = createSlice({
    name: 'upload',
    initialState: { imageUrl: null, uploading: false, error: null },
    reducers: {
        resetUpload: (state) => {
            state.imageUrl = null;
            state.uploading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadImageToCloudinary.pending, (state) => {
                state.uploading = true;
            })
            .addCase(uploadImageToCloudinary.fulfilled, (state, action) => {
                state.uploading = false;
                state.imageUrl = action.payload;
            })
            .addCase(uploadImageToCloudinary.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            });
    }
});

export const { resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;