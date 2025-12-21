"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Settings from "./parts/Settings";
import { fetchAllUsers } from "@/features/async/userSlice";

export default function AccountPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("profile");
    const router = useRouter();
    const dispatch = useDispatch();

    const users = useSelector(s => s.users.users);
    const currentUser = users?.find(u => u._id === session?.user?.id);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const tabs = [
        { id: "profile", label: "الملف الشخصي" },
        { id: "settings", label: "الإعدادات" },
    ];

    return (
        <div className="min-h-screen font-tajawal text-[#1a1a1a] py-12 px-4 sm:px-8 sm:pt-5 pt-5" dir="rtl">
            <div className="max-w-6xl mx-auto">

                <header className="mb-12">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2"
                    >
                        مرحباً بك مجدداً
                    </motion.p>
                    <h1 className="text-4xl font-bold tracking-tight">حسابي الشخصي</h1>
                </header>

                <div className="grid grid-cols-12 gap-8 lg:gap-16">
                    {/* القائمة الجانبية */}
                    <div className="col-span-12 lg:col-span-3 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-right px-6 py-4 text-sm transition-all duration-300 border-r-2 ${activeTab === tab.id
                                    ? "border-black bg-white font-bold shadow-sm"
                                    : "border-transparent text-gray-400 hover:text-black"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                signOut({ callbackUrl: '/' });
                            }}
                            className="w-full text-right px-6 py-4 text-sm text-red-400 hover:text-red-600 transition-colors mt-8"
                        >
                            تسجيل الخروج
                        </button>
                    </div>

                    {/* محتوى التبويبات */}
                    <div className="col-span-12 lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white border border-gray-200 p-8 sm:p-12 rounded-sm shadow-sm min-h-[500px]"
                            >
                                {activeTab === "profile" && <ProfileView session={session} currentUser={currentUser} />}
                                {activeTab === "settings" && <Settings />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileView({ session, currentUser }) {
    return (
        <div className="space-y-12">
            <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-light text-gray-400 border border-gray-200 uppercase">
                    {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{session?.user?.name}</h2>
                    <p className="text-gray-400 text-sm">{session?.user?.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InfoItem label="الاسم الكامل" value={session?.user?.name} />
                <InfoItem label="البريد الإلكتروني" value={session?.user?.email} />
                <InfoItem label="تاريخ الانضمام" value="ديسمبر 2025" />
                <InfoItem label="نوع الحساب" value={currentUser?.role === 'admin' ? "ادمن" : "عميل"} />
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">{label}</p>
            <p className="text-sm font-medium">{value || "غير محدد"}</p>
        </div>
    );
}