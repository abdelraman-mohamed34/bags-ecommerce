"use client";
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllUsers, removeFromCart } from '@/features/async/userSlice';
import { useSession } from 'next-auth/react';
import { fetchAllProducts } from '@/features/async/productSlice';
import { addNotification } from '@/features/normal/notificationSlice';
import Link from 'next/link';

export default function CartPage() {
    const dispatch = useDispatch();
    const users = useSelector(u => u.users.users);
    const products = useSelector(p => p.items.products);
    const { data: session } = useSession();

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const currentUser = useMemo(() =>
        users?.find(u => u.email === session?.user?.email),
        [users, session]);

    const items = useMemo(() => {
        if (!currentUser?.cart || !products) return [];
        return products.filter(p => currentUser.cart.some(cartItem => cartItem.productId === p.id));
    }, [currentUser, products]);

    const totalAmount = useMemo(() =>
        items.reduce((acc, item) => acc + (Number(item.price) || 0), 0),
        [items]);

    return (
        <div className="min-h-screen font-tajawal text-[#1a1a1a] p-4 md:p-10" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200 pb-6 mb-8">
                    <div className="text-right">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl md:text-3xl font-bold tracking-tight"
                        >
                            حقيبة التسوق
                        </motion.h1>
                        <p className="text-gray-400 text-[10px] md:text-sm mt-1 uppercase tracking-widest">
                            Shopping Bag — {items?.length || 0} Items
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8 lg:gap-12">
                    {/* قسم المنتجات */}
                    <div className={`${items.length > 0 ? "col-span-12 lg:col-span-8" : "col-span-12"} space-y-4`}>
                        <AnimatePresence mode="popLayout">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group flex flex-row items-center gap-4 md:gap-6 bg-white p-4 md:p-6 transition-all border border-gray-100 rounded-sm hover:bg-gray-50/50"
                                    >
                                        <div className="w-20 h-28 md:w-28 md:h-36 bg-gray-100 overflow-hidden rounded-sm flex-shrink-0">
                                            <img
                                                src={item.images?.main}
                                                alt={item.name}
                                                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-1 text-right">
                                            <h3 className="text-sm md:text-lg font-bold text-gray-900 uppercase tracking-tight line-clamp-1">{item.name}</h3>
                                            <p className="text-gray-400 text-[10px] md:text-xs">{item.brand}</p>
                                            <div className="pt-2 md:pt-4">
                                                <span className="text-base md:text-xl font-light">{item.price?.toLocaleString()} ج.م</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                dispatch(removeFromCart(item.id));
                                                dispatch(addNotification({ message: 'تمت إزالة المنتج من الحقيبة', type: 'success' }));
                                            }}
                                            className="self-center md:self-start text-gray-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20 md:py-32 border border-dashed border-gray-200 rounded-sm bg-white"
                                >
                                    <div className="mb-6 flex justify-center text-gray-200">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px] md:text-xs mb-8 px-4">حقيبة التسوق فارغة تماماً</p>
                                    <Link href="/">
                                        <motion.span
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="inline-block px-8 md:px-12 py-4 bg-[#1a1a1a] text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-red-300 transition-colors cursor-pointer shadow-sm"
                                        >
                                            ابدأ الاستكشاف
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ملخص الطلب - يظهر في الأسفل في الموبايل */}
                    {items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-12 lg:col-span-4"
                        >
                            <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm lg:sticky lg:top-24 shadow-sm">
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b border-gray-50 pb-4 text-right">ملخص الطلب</h2>
                                <div className="space-y-4 md:space-y-6 text-sm">
                                    <div className="flex justify-between items-center text-right">
                                        <span className="text-gray-500">المجموع الفرعي</span>
                                        <span className="font-medium">{totalAmount.toLocaleString()} ج.م</span>
                                    </div>
                                    <div className="flex justify-between items-center text-right">
                                        <span className="text-gray-500">تكاليف الشحن</span>
                                        <span className="text-green-600 font-medium">مجاني</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-end text-right">
                                            <span className="text-base md:text-lg font-bold">الإجمالي</span>
                                            <div className="text-right">
                                                <span className="block text-xl md:text-2xl font-black text-red-300">{totalAmount.toLocaleString()} ج.م</span>
                                                <span className="text-[10px] text-gray-400 uppercase">شامل الضريبة</span>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 md:py-5 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] transition-all rounded-sm bg-[#1a1a1a] text-white hover:bg-red-300 shadow-lg"
                                    >
                                        الدفع الآمن الآن
                                    </motion.button>
                                    <div className="flex justify-center gap-4 pt-4 opacity-30 grayscale">
                                        <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" className="h-5 md:h-6" alt="visa" />
                                        <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" className="h-5 md:h-6" alt="mastercard" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}