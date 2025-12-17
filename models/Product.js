import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
    variantId: { type: String, required: true },
    color: { type: String, required: true },
    hex: { type: String, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }],
});

const SizeSchema = new mongoose.Schema({
    width: Number,
    height: Number,
    depth: Number,
    unit: String,
});

const SpecificationSchema = new mongoose.Schema({
    material: String,
    lining: String,
    closureType: String,
    compartments: Number,
    size: SizeSchema,
    weight: String,
    madeIn: String,
});

const ReviewSchema = new mongoose.Schema({
    reviewId: String,
    userId: String,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: Date,
});

const ShippingSchema = new mongoose.Schema({
    freeShipping: Boolean,
    shippingFee: Number,
    estimatedDelivery: String,
});

const DiscountSchema = new mongoose.Schema({
    percentage: Number,
    isActive: Boolean,
    expiresAt: Date,
});

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    sku: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    name: String,
    brand: String,
    category: {
        main: String,
        sub: String,
    },
    description: String,
    shortDescription: String,

    price: Number,
    oldPrice: Number,
    currency: String,
    discount: DiscountSchema,

    images: {
        main: String,
        gallery: [String],
        thumbnail: String,
    },

    variants: [VariantSchema],
    specifications: SpecificationSchema,

    inventory: {
        totalStock: Number,
        availability: { type: String, enum: ["in_stock", "out_of_stock"] },
        lowStockThreshold: Number,
    },

    rating: {
        average: Number,
        totalReviews: Number,
    },

    reviews: [ReviewSchema],

    tags: [String],
    badges: [String],
    isFeatured: Boolean,

    shipping: ShippingSchema,

    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String],
    },

    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
