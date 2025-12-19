"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addNotification } from "@/features/normal/notificationSlice.js";
import Link from "next/link";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                dispatch(addNotification({ message: "البيانات غير صحيحة", type: "error" }));
            } else {
                dispatch(addNotification({ message: "تم تسجيل الدخول", type: "success" }));
                setTimeout(() => { window.location.href = "/"; }, 1500);
            }
        } catch (err) {
            dispatch(addNotification({ message: "حدث خطأ ما", type: "warning" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-tajawal p-4 md:p-10" dir="rtl">

            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px] opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gray-200 blur-[120px] opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex w-full max-w-[1100px] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden rounded-xl border border-gray-100"
            >
                <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
                        alt="Style"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[10s] hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12">
                        <h2 className="text-white text-4xl font-light tracking-wide leading-tight">استكشف <br /><span className="font-bold">مجموعتنا الجديدة</span></h2>
                        <p className="text-gray-300 mt-4 text-sm tracking-[0.2em] uppercase">Autumn / Winter 2025</p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-8 md:p-16 2xl:p-24 flex flex-col justify-center bg-white">
                    <div className="mb-12">
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] 2xl:text-xs uppercase tracking-[0.4em] text-gray-400 mb-4">المتجر </motion.p>
                        <h1 className="text-3xl 2xl:text-5xl font-bold tracking-tight text-gray-900">تسجيل الدخول</h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] 2xl:text-[12px] uppercase tracking-widest text-gray-400 mr-2">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-6 py-5 2xl:py-6 bg-gray-50/50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm 2xl:text-base rounded-sm"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] 2xl:text-[12px] uppercase tracking-widest text-gray-400 mr-2">كلمة السر</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-6 py-5 2xl:py-6 bg-gray-50/50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm 2xl:text-base rounded-sm"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <span className="text-[10px] 2xl:text-xs uppercase tracking-widest text-gray-400 hover:text-black cursor-pointer transition-colors">نسيت كلمة السر؟</span>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className={`w-full py-5 2xl:py-7 text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.3em] transition-all flex justify-center items-center rounded-sm ${loading
                                ? "bg-gray-100 text-gray-400"
                                : "bg-[#1a1a1a] text-white hover:bg-red-300 shadow-xl shadow-gray-200"
                                }`}
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "دخول آمن"}
                        </motion.button>
                    </form>

                    <div className="relative my-12">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                        <div className="relative flex justify-center text-[10px] 2xl:text-xs uppercase tracking-widest"><span className="bg-white px-6 text-gray-300">أو</span></div>
                    </div>

                    <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-4 bg-white border border-gray-100 py-5 2xl:py-6 text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.2em] text-gray-700 hover:bg-gray-50 transition-all rounded-sm shadow-sm"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
                        المتابعة عبر جوجل
                    </button>

                    <div className="mt-12 text-center">
                        <p className="text-[11px] 2xl:text-[13px] text-gray-400 uppercase tracking-[0.2em]">
                            ليس لديك حساب؟{" "}
                            <Link href="/register" className="text-black font-bold hover:underline underline-offset-8 decoration-1 italic">
                                سجل الآن
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}