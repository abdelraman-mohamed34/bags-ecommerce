"use client";
import React from "react";
import { motion } from "framer-motion";
import AddReviewSection from "./AddReviewSection";

export default function ProductTabs({ product }) {
    if (!product) return null;

    const specs = product.specifications ? Object.entries(product.specifications) : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-tajawal text-right" dir="rtl">

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
                <h3 className="text-2xl font-black mb-8 border-r-4 border-blue-600 pr-4 text-gray-900">
                    المواصفات الفنية
                </h3>
                <div className="space-y-4">
                    {specs.length > 0 ? (
                        specs
                            .filter(([key]) =>
                                key !== "size" &&
                                !key.toLowerCase().startsWith("id") &&
                                !key.startsWith("_id")
                            )
                            .map(([key, value]) => (
                                typeof value !== "object" && (
                                    <div key={key} className="flex justify-between items-center group border-b border-gray-50 pb-3">
                                        <span className="text-gray-400 font-medium group-hover:text-blue-600 transition-colors">
                                            {key}
                                        </span>
                                        <span className="font-bold text-gray-800 bg-gray-50 px-4 py-1 rounded-xl">
                                            {value}
                                        </span>
                                    </div>
                                )
                            ))
                    ) : (
                        <p className="text-gray-400 italic text-center">لا توجد مواصفات فنية متوفرة حالياً.</p>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black border-r-4 border-yellow-400 pr-4 text-gray-900">
                        آراء العملاء
                    </h3>
                    <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                        {product?.rating?.average} ★
                    </div>
                </div>

                <div className="space-y-6 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                    {product?.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((rev) => (
                            <div key={rev.reviewId} className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 hover:border-yellow-200 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className="font-black text-gray-900">{rev.userName}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                            {new Date(rev.createdAt).toLocaleDateString('ar-EG', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex text-yellow-400 text-xs">
                                        {Array.from({ length: rev.rating }).map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium bg-white/50 p-3 rounded-xl border border-white">
                                    "{rev.comment}"
                                </p>

                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <span className="text-4xl block mb-2">💬</span>
                            <p className="text-gray-400 italic">كن أول من يضيف تقييماً لهذا المنتج!</p>
                        </div>
                    )}
                </div>
                <AddReviewSection />
            </motion.div>
        </div>
    );
}