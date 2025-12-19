"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { addNotification } from '@/features/normal/notificationSlice';
import { editUser } from '@/features/async/userSlice';

export default function page() {
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: session?.user?.phone,
        address: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editUser(formData))
        dispatch(addNotification({ message: "تم تحديث البيانات بنجاح", type: "success" }));
    };

    return (
        <div className=" font-tajawal sm:py-20 py-5 sm:px-6 px-2" dir="rtl">
            <div className="max-w-3xl mx-auto">

                <header className="sm:mb-16 mb-5 text-right">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-2"
                    >
                        الإعدادات الشخصية
                    </motion.p>
                    <h1 className="sm:text-4xl text-xl font-bold tracking-tight text-gray-900">تعديل الملف الشخصي</h1>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm rounded-sm"
                >
                    <form onSubmit={handleSubmit} className="space-y-10">

                        <div className="flex flex-col items-center mb-12">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-3xl font-light text-gray-300 border border-gray-200 overflow-hidden">
                                    {formData.name.charAt(0) || "U"}
                                </div>
                                <button className="absolute inset-0 bg-black/40 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center uppercase tracking-widest">
                                    تغيير
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 mr-2">الاسم الكامل</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all text-sm md:text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 mr-2">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 text-gray-300 outline-none text-sm md:text-base cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 mr-2">رقم الهاتف</label>
                                <input
                                    type="tel"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all text-sm md:text-base text-left"
                                    dir="ltr"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 mr-2">العنوان</label>
                                <input
                                    type="text"
                                    placeholder="القاهرة، مصر"
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all text-sm md:text-base"
                                />
                            </div>
                        </div>

                        <div className="pt-12 flex flex-col md:flex-row gap-4 justify-between items-center border-t border-gray-50">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">آخر تحديث: منذ دقيقتين</p>

                            <div className="flex gap-6">
                                <button type="button" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
                                    إلغاء
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="px-12 py-4 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-300 transition-all shadow-lg shadow-gray-200 rounded-sm"
                                >
                                    حفظ التغييرات
                                </motion.button>
                            </div>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}