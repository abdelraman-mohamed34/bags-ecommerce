"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
    if (!product) return null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <span className="w-full h-full duration-500 group-hover:bg-black/10 absolute top-0 right-0 z-10" />

                {product.images?.main && (
                    <img
                        src={product.images.main}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                )}

                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                    {product.discount?.isActive && product.discount.percentage > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                            {product.discount.percentage}%
                        </span>
                    )}
                    {product.badges?.length > 0 && product.badges.map((badge) => (
                        <span key={badge} className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-5 flex flex-col gap-2 text-right" dir="rtl">
                <div className="flex justify-between items-start min-h-[18px]">
                    {product.brand && (
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
                            {product.brand}
                        </span>
                    )}
                    {product.rating?.average > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-xs">★</span>
                            <span className="text-[11px] font-bold text-gray-500">
                                {product.rating.average}
                            </span>
                        </div>
                    )}
                </div>

                {product.name && (
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
                        {product.name}
                    </h3>
                )}

                <div className="flex items-center gap-2 mt-1">
                    {product.price !== undefined && (
                        <span className="text-lg font-black text-gray-900">
                            {product.price.toLocaleString()} <span className="text-xs font-normal">{product.currency || "EGP"}</span>
                        </span>
                    )}
                    {product.discount?.isActive && product.oldPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                            {product.oldPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {product.variants?.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                        {product.variants.map((variant) => (
                            variant.hex && (
                                <div
                                    key={variant.variantId || variant.hex}
                                    className="w-3 h-3 rounded-full border border-gray-100 shadow-inner"
                                    style={{ backgroundColor: variant.hex }}
                                    title={variant.color || ""}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}