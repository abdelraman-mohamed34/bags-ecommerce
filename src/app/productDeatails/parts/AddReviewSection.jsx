"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { addNotification } from "@/features/normal/notificationSlice";
import { postComment } from "@/features/async/productSlice";
import { useSearchParams } from "next/navigation";

export default function AddReviewSection({ setIsOpen }) {
    const [rating, setRating] = useState(1);
    const [commentText, setCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { data: session } = useSession();
    const dispatch = useDispatch();
    const params = useSearchParams();
    const productId = params.get('q');

    const handleSubmitComment = async () => {
        if (!session?.user) {
            dispatch(addNotification({
                message: "تحتاج إلى تسجيل الدخول",
                type: "warning"
            }));
            return;
        }

        if (!commentText.trim()) {
            dispatch(addNotification({
                message: "الرجاء كتابة تعليق قبل النشر",
                type: "warning"
            }));
            return;
        }

        setIsLoading(true);

        try {
            await dispatch(postComment({
                productId,
                text: commentText,
                rating
            })).unwrap();

            dispatch(addNotification({ message: "تم إضافة التعليق", type: "success" }));
            setCommentText("");
            setRating(1);
        } catch (err) {
            dispatch(addNotification({ message: err.toString(), type: "error" }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 font-tajawal">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white shadow-gray-200/50 max-w-2xl p-6 rounded-2xl"
            >
                {/* عنوان + تقييم النجوم */}
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-gray-900 sm:text-lg">ما هو رأيك في المنتج؟</h4>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl transition-transform hover:scale-125 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* حقل التعليق */}
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="اكتب تجربتك هنا..."
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-300 focus:bg-white rounded-2xl p-4 min-h-[120px] outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />

                {/* أزرار النشر والإلغاء */}
                <div className="flex gap-3 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitComment}
                        disabled={isLoading || !commentText.trim()}
                        className={`flex-1 py-4 rounded-lg font-black transition-colors
                            ${isLoading || !commentText.trim()
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-300 text-white hover:bg-red-200"
                            }`}
                    >
                        {isLoading ? "جاري النشر..." : "نشر التعليق"}
                    </motion.button>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
