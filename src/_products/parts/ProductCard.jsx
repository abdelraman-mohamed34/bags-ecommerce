"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group bg-white rounded-lg overflow-hidden border border-gray-500 shadow-xs hover:shadow-xl transition-all duration-300 relative focus:ring-2 focus:ring-blue-500"
        >
            <div className="relative aspect-[4/2] overflow-hidden bg-gray-50 flex ">
                <span
                    className="w-full h-full duration-500 group-bg-black/0 group-hover:bg-black/50 absolute top-0 right-0"
                />
                <img
                    src={product?.images?.main}
                    alt={product?.name}
                    className="w-full h-full object-cover aspect-video transition-transform duration-500 group-hover:scale-110"
                />


                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {product?.discount.isActive && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg text-center">
                            -{product?.discount.percentage}%
                        </span>
                    )}
                    {product.badges?.map((badge) => (
                        <span key={badge} className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* 2. تفاصيل المنتج */}
            <div className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{product.brand}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-[11px] font-bold text-gray-500">{product.rating.average}</span>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</h3>

                {/* السعر */}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-black text-gray-900">
                        {product?.price.toLocaleString()} {product.currency}
                    </span>
                    {product?.discount.isActive && (
                        <span className="text-xs text-gray-400 line-through">
                            {product?.oldPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="flex gap-1.5 mt-2">
                    {product?.variants.map((variant) => (
                        <div
                            key={variant.variantId}
                            className="w-3 h-3 rounded-full border border-gray-200"
                            style={{ backgroundColor: variant.hex }}
                            title={variant.color}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}