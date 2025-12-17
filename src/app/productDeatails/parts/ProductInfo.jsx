"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductInfo({
    product,
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
}) {
    return (
        <section className="flex flex-col space-y-8 font-tajawal text-right" dir="rtl">
            {/* 1. العنوان والبراند */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <span className="text-blue-600 font-bold tracking-wider text-sm bg-blue-50 px-3 py-1 rounded-full">
                    {product?.brand}
                </span>
                <h1 className="text-4xl font-black mt-4 text-gray-900 leading-tight">
                    {product?.name}
                </h1>
            </motion.div>

            {/* 2. السعر والخصم */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl w-fit">
                <span className="text-4xl font-black text-gray-900">
                    {product?.price.toLocaleString()} {product?.currency}
                </span>
                {product?.discount.isActive && (
                    <div className="flex flex-col">
                        <span className="line-through text-gray-400 text-sm">
                            {product?.oldPrice.toLocaleString()} {product?.currency}
                        </span>
                        <span className="text-red-500 text-xs font-bold">
                            وفر {product?.discount.percentage}%
                        </span>
                    </div>
                )}
            </div>

            {/* 3. اختيار الألوان مع تفاعل بصري */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">اللون المختارة: {selectedVariant?.color}</h3>
                    <span className="text-xs text-gray-400">متوفر {selectedVariant?.stock} قطعة</span>
                </div>
                <div className="flex gap-2">
                    {product?.variants.map((variant) => (
                        <button
                            key={variant.variantId}
                            onClick={() => setSelectedVariant(variant)}
                            className={`relative w-12 h-12 rounded-full border-4 transition-all duration-300 ${selectedVariant?.variantId === variant?.variantId
                                ? "border-blue-600 scale-110 shadow-lg"
                                : "border-white shadow-sm hover:scale-105"
                                }`}
                            style={{ backgroundColor: variant?.hex }}
                        >
                            {selectedVariant?.variantId === variant?.variantId && (
                                <motion.span
                                    layoutId="active-dot"
                                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 px-1.5 text-[10px]"
                                >
                                    ✓
                                </motion.span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. الكمية والأزرار */}
            <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-6">
                    <label className="font-bold text-gray-800">الكمية:</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-5 py-2 hover:bg-gray-100 transition-colors font-bold text-xl"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-black text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="px-5 py-2 hover:bg-gray-100 transition-colors font-bold text-xl text-blue-600"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* زر الإضافة للسلة بتأثير Framer Motion */}
                <div className="flex gap-3 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-black text-white py-5 rounded-xl font-black text-xl shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                    >
                        <span>إضافة للسلة</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#fee2e2" }}
                        className="p-5 border-2 border-gray-100 rounded-xl text-gray-400"
                    >
                        ❤
                    </motion.button>
                </div>
            </div>

        </section>
    );
}