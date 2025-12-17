"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { removeNotification } from "../features/normal/notificationSlice.js";

export default function NotificationPortal() {
    const [mounted, setMounted] = useState(false);
    const dispatch = useDispatch();
    const { isOpen, message, type } = useSelector((state) => state.notifications);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            const timer = setTimeout(() => {
                dispatch(removeNotification());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, dispatch]);

    if (!mounted) return null;

    const getTheme = () => {
        switch (type) {
            case "error":
                return {
                    bg: "bg-red-500",
                    border: "border-red-100",
                    icon: "✕",
                    title: "خطأ!"
                };
            case "warning":
                return {
                    bg: "bg-amber-500",
                    border: "border-amber-100",
                    icon: "!",
                    title: "تنبيه!"
                };
            default:
                return {
                    bg: "bg-blue-600",
                    border: "border-gray-100",
                    icon: "✓",
                    title: "تمت العملية"
                };
        }
    };

    const theme = getTheme();

    return createPortal(
        <div className="fixed bottom-5 left-50 -translate-x-1/2 z-[10000] w-full max-w-sm px-4 pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`pointer-events-auto overflow-hidden bg-white/95 backdrop-blur-xl border rounded-2xl shadow-2xl p-4 font-tajawal flex items-center gap-4 ${theme.border}`}
                        dir="rtl"
                    >
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg ${theme.bg} text-white`}>
                            {theme.icon}
                        </div>

                        <div className="flex-1">
                            <p className="text-gray-900 font-black text-sm leading-tight">
                                {theme.title}
                            </p>
                            <p className="text-gray-500 text-xs mt-1 font-medium">
                                {message}
                            </p>
                        </div>

                        <button
                            onClick={() => dispatch(removeNotification())}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                        >
                            ✕
                        </button>

                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 4, ease: "linear" }}
                            className={`absolute bottom-0 right-0 h-1 ${theme.bg}`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>,
        document.body
    );
}