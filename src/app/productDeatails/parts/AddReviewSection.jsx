"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { addNotification } from "@/features/normal/notificationSlice";
import { postComment } from "@/features/async/productSlice";

export default function AddReviewSection() {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const { data: session } = useSession()
    const dispatch = useDispatch()

    const handleSubmitComment = () => {
        dispatch(postComment())
        if (session?.user) {
            console.log('submitted')
            dispatch(postComment({
                productId: "123",
                text: "هذا المنتج رائع!"
            })).unwrap()
                .then(() => {
                    dispatch(addNotification({ message: "تم إضافة التعليق", type: "success" }));
                })
                .catch((err) => {
                    dispatch(addNotification({ message: err, type: "error" }));
                });
        } else {
            console.log('u need to login')
            dispatch(addNotification({
                isOpen: true,
                message: 'تحتاج الي تسجيل الدخول',
                type: 'warning',
            }))
        }
    }


    return (
        <div className="mt-6 font-tajawal">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white shadow-gray-100/50 max-w-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-gray-900 text-lg">ما هو رأيك في المنتج؟</h4>

                    <div className="flex gap-2 w-fit">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl transition-transform hover:scale-125 ${star <= rating ? "text-yellow-400" : "text-gray-200"
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* حقل الإدخال */}
                <div className="relative group">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="اكتب تجربتك هنا..."
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 min-h-[120px] outline-none transition-all text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitComment}
                        className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
                    >
                        نشر التعليق
                    </motion.button>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </motion.div>
        </div >
    );
}