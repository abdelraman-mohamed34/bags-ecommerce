"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addNotification } from "@/features/normal/notificationSlice.js";

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
                dispatch(addNotification({
                    message: "البريد الإلكتروني أو كلمة السر غير صحيحة",
                    type: "error"
                }));
            } else {
                dispatch(addNotification({
                    message: "تم تسجيل الدخول بنجاح، جارٍ تحويلك...",
                    type: "success"
                }));
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        } catch (err) {
            dispatch(addNotification({
                message: "حدث خطأ ما، يرجى المحاولة لاحقاً",
                type: "warning"
            }));
        } finally {
            setLoading(false);
        }
    };
    console.log(formData)
    return (
        <div className="flex items-center justify-center bg-gray-50/50 font-tajawal p-6" dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100 max-w-lg w-full"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">تسجيل الدخول</h1>
                    <p className="text-gray-400 font-medium">مرحباً بك مجدداً في متجرنا</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="كلمة السر"
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-black shadow-lg transition-all flex justify-center items-center ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-blue-600"
                            }`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : "دخول"}
                    </motion.button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400 font-bold">أو بواسطة</span>
                    </div>
                </div>

                <button
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-2xl font-black text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="google" />
                    متابعة باستخدام جوجل
                </button>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        ليس لديك حساب؟ <span className="text-blue-600 cursor-pointer hover:underline">أنشئ حساباً جديداً</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}