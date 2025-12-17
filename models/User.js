import mongoose from "mongoose";

/* Address Sub-Schema */
const addressSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        building: {
            type: String,
        },
        floor: {
            type: String,
        },
        apartment: {
            type: String,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    { _id: true }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        phone: {
            type: String,
            required: true,
        },

        addresses: [addressSchema],

        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                variantId: String,
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],

        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true, // createdAt & updatedAt
    }
);

/* Prevent model overwrite in Next.js */
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
