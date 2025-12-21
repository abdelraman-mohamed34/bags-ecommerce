"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '@/features/normal/notificationSlice';
import { addNewUser } from '@/features/async/userSlice';

export default function page() {
    const router = useRouter();
    const dispatch = useDispatch()
    const { loading } = useSelector(l => l.users)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
        address: {
            city: '',
            area: '',
            street: '',
            building: '',
            floor: '',
            apartment: '',
            isDefault: true
        },
        cart: [],
        wishlist: [],
        orders: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            dispatch(addNewUser(formData))
            dispatch(addNotification({
                type: 'success',
                message: 'تم إضافة مستخدم جديد',
            }))
        }
    };

    console.log("بيانات المستخدم الجديد:", formData);
    return (
        <div className="min-h-screen bg-[#fcfcfc] font-tajawal py-12 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">

                <header className="mb-10 text-right">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">إدارة النظام</p>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">إضافة مستخدم جديد</h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">

                    <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-8 border-b pb-4">المعلومات الأساسية</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="الاسم الكامل" name="name" value={formData.name} onChange={handleChange} required />
                            <InputGroup label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <InputGroup label="كلمة المرور" name="password" type="password" value={formData.password} onChange={handleChange} required />
                            <InputGroup label="رقم الهاتف" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">الصلاحية</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors bg-transparent"
                                >
                                    <option value="user">عميل (User)</option>
                                    <option value="admin">مدير (Admin)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-8 border-b pb-4">العنوان الأولي</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputGroup label="المدينة" name="city" value={formData.address.city} onChange={handleAddressChange} required />
                            <InputGroup label="المنطقة" name="area" value={formData.address.area} onChange={handleAddressChange} required />
                            <InputGroup label="الشارع" name="street" value={formData.address.street} onChange={handleAddressChange} required />
                            <InputGroup label="المبنى" name="building" value={formData.address.building} onChange={handleAddressChange} />
                            <InputGroup label="الطابق" name="floor" value={formData.address.floor} onChange={handleAddressChange} />
                            <InputGroup label="رقم الشقة" name="apartment" value={formData.address.apartment} onChange={handleAddressChange} />
                        </div>
                    </section>

                    {/* أزرار التحكم */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-end pt-6">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-black transition-colors"
                        >
                            إلغاء التغييرات
                        </button>
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className={`px-16 py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-red-300 transition-all duration-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "جاري الحفظ..." : "إنشاء الحساب الآن"}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* مكون فرعي للحقول لتقليل التكرار */
function InputGroup({ label, name, type = "text", value, onChange, required = false }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                {label} {required && <span className="text-red-300">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="border-b border-gray-200 py-2 text-sm focus:border-black outline-none transition-colors bg-transparent placeholder:text-gray-200"
                placeholder={`أدخل ${label}...`}
            />
        </div>
    );
}