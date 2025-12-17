export const order = {
    orderId: "ord_1001",
    userId: "user_001",

    items: [
        {
            productId: "bag_001",
            variantId: "bag_001_black",
            name: "شنطة حريمي جلد طبيعي",
            price: 1200,
            quantity: 2,
        },
    ],

    pricing: {
        subtotal: 2400,
        shippingFee: 50,
        discount: 0,
        total: 2450,
    },

    payment: {
        method: "cash_on_delivery",
        status: "pending",
    },

    shippingAddress: {
        city: "القاهرة",
        area: "مدينة نصر",
        street: "شارع عباس العقاد",
    },

    status: "processing", // shipped, delivered, cancelled
    createdAt: "2025-02-01",
};
