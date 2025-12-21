"use client";
import React from "react";
import { motion } from "framer-motion";
import AddReviewSection from "./AddReviewSection";
import { useSession } from "next-auth/react";
import { handleDeleteReview } from "@/features/async/productSlice";
import { addNotification } from "@/features/normal/notificationSlice";
import { useDispatch } from "react-redux";

export default function ProductTabs({ product }) {
    if (!product) return null;

    const specs = product.specifications
        ? Object.entries(product.specifications).filter(([key, value]) =>
            value &&
            typeof value !== "object" &&
            key !== "size" &&
            !key.toLowerCase().includes("id") &&
            !key.startsWith("_")
        )
        : [];

    const hasSpecs = specs.length > 0;
    const hasReviews = product.reviews && product.reviews.length > 0;
    const { data: session } = useSession()
    const dispatch = useDispatch()

    if (!hasSpecs && !hasReviews) return null;
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 font-tajawal text-right`} dir="rtl">

            {hasSpecs && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white sm:p-5 p-4 md:p-10 rounded-2xl shadow-sm border border-gray-100"
                >
                    <h3 className="text-2xl font-black mb-8 border-r-4 border-red-300 pr-4 text-gray-900">
                        المواصفات الفنية
                    </h3>
                    <div className="space-y-4">
                        {specs.map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center group border-b border-gray-50 pb-3">
                                <span className="text-gray-400 font-medium group-hover:text-red-400 transition-colors capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')} {/* تحويل camelCase لنص مقروء */}
                                </span>
                                <span className="font-bold text-gray-800 bg-gray-50 px-4 py-1 rounded-xl">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white sm:p-5 p-4 md:p-10 rounded-2xl shadow-sm border border-gray-100"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black border-r-4 border-red-300 pr-4 text-gray-900">
                        آراء العملاء
                    </h3>
                    {product?.rating?.average > 0 && (
                        <div className="bg-red-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                            {product.rating.average} ★
                        </div>
                    )}
                </div>

                <div className="space-y-6 max-h-[500px] overflow-y-auto no-scrollbar pr-2 mb-8">
                    {product.reviews.map((rev, i) => (
                        <div key={i} className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 hover:border-red-100 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <span className="font-black text-gray-900 whitespace-nowrap">{rev.userName}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                        {new Date(rev.createdAt).toLocaleDateString('ar-EG', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between w-full" dir="ltr">
                                    <div className="flex items-center gap-3">
                                        {(session?.user?.role === 'admin' || session?.user?.id === rev.userId) && (
                                            <motion.button
                                                whileHover={{ scale: 1.1, color: "#ef4444" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    dispatch(handleDeleteReview({ reviewId: rev._id, reviewerId: rev.userId, productId: product.id }));
                                                    dispatch(addNotification({ type: 'success', message: 'تم حذف التعليق', }))
                                                }}
                                                className="text-gray-400 transition-colors duration-200"
                                                title="حذف التعليق"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </motion.button>
                                        )}
                                        <div className="flex text-yellow-400 text-[10px] shadow-sm bg-white px-2 py-1 rounded-lg border border-gray-50">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <span key={index} className={index < rev.rating ? "text-yellow-400" : "text-gray-200"}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium bg-white/70 p-4 rounded-xl border border-white/50 italic">
                                "{rev.comment}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50">
                    <AddReviewSection />
                </div>
            </motion.div>
        </div >
    );
}