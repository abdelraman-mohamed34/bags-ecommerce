"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Settings() {
    const [notifications, setNotifications] = useState({
        email: true,
        orders: true,
        offers: false
    });

    const { data: session } = useSession()

    return (
        <div className="space-y-16 animate-in fade-in duration-700">

            {/* القسم الأول: الأمان */}
            <section className="space-y-8">
                {
                    session?.user?.role === 'admin' && (
                        <div className="border-b border-gray-50 pb-4">
                            <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-black mb-3">إدارة المنتجات</h3>
                            <Link href={'/upload-product'} className="px-8 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gray-800 transition-all">
                                إضافة منتج جديد
                            </Link>
                        </div>
                    )
                }
                <div className="border-b border-gray-50 pb-4 hidden">
                    <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-black">الأمان وكلمة المرور</h3>
                    <p className="text-gray-400 text-[10px] mt-1">قم بتحديث وسيلة الوصول إلى حسابك</p>
                </div>

                <div className="max-w-md space-y-6 hidden">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400">كلمة المرور الحالية</label>
                        <input type="password" title="current-password" name="currentPassword" className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400">كلمة المرور الجديدة</label>
                        <input type="password" title="new-password" name="newPassword" className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                    </div>
                    <button className="px-8 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gray-800 transition-all">
                        تحديث كلمة المرور
                    </button>
                </div>
            </section>

            {/* القسم الثاني: التنبيهات */}
            <section className="space-y-8">
                <div className="border-b border-gray-50 pb-4">
                    <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-black">تفضيلات الإشعارات</h3>
                    <p className="text-gray-400 text-[10px] mt-1">اختر كيف نصل إليك</p>
                </div>

                <div className="space-y-4">
                    <ToggleItem
                        label="إشعارات البريد الإلكتروني"
                        desc="استقبل رسائل حول حالة طلباتك"
                        active={notifications.email}
                        onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                    />
                    <ToggleItem
                        label="العروض الترويجية"
                        desc="كن أول من يعلم بالخصومات الموسمية"
                        active={notifications.offers}
                        onClick={() => setNotifications({ ...notifications, offers: !notifications.offers })}
                    />
                </div>
            </section>

            <section className="pt-10 border-t border-red-50 hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-red-500">منطقة الخطر</h3>
                        <p className="text-gray-400 text-[10px] mt-1">بمجرد حذف الحساب لا يمكن التراجع عن ذلك</p>
                    </div>
                    <button className="text-[10px] uppercase tracking-widest font-bold text-red-400 border border-red-100 px-6 py-3 hover:bg-red-500 hover:text-white transition-all">
                        حذف الحساب نهائياً
                    </button>
                </div>
            </section>

        </div>
    );
}

function ToggleItem({ label, desc, active, onClick }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-[10px] text-gray-400">{desc}</p>
            </div>
            <button
                onClick={onClick}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-black' : 'bg-gray-200'}`}
            >
                <motion.div
                    animate={{ x: active ? 20 : 2 }}
                    className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0 shadow-sm"
                />
            </button>
        </div>
    );
}