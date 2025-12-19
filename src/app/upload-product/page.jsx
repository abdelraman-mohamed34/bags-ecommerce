"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { HiOutlineCloudUpload, HiOutlinePhotograph, HiOutlineColorSwatch } from "react-icons/hi";
import InputField from "./parts/InputField";
import { addNewProduct } from "@/features/async/productSlice";
import { addNotification } from "@/features/normal/notificationSlice";
import { uploadImageToCloudinary } from "@/features/async/uploadToCloudinary";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
    const [activeStep, setActiveStep] = useState(0);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: "", sku: "", slug: "", name: "", brand: "",
        category: { main: "", sub: "" },
        price: 0, oldPrice: 0, currency: "EGP",
        description: "", shortDescription: "",
        specifications: { material: "", madeIn: "", closureType: "" },
        variants: [],
        inventory: { totalStock: 0, availability: "in_stock" },
        images: { main: "", gallery: [], thumbnail: "" }
    });

    const inputRef = useRef();
    const steps = ["التفاصيل", "الأسعار والكمية", "المواصفات", "المتغيرات"];
    const dispatch = useDispatch();
    const router = useRouter()

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setFormData((prev) => ({
                ...prev,
                [section]: { ...prev[section], [name]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { variantId: Date.now().toString(), color: "", hex: "#000000", stock: 0 }]
        }));
    };

    const handleSubmit = async () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
            return;
        }

        setIsSubmitting(true);

        try {
            let finalImageUrl = formData?.images?.main;

            if (selectedFile) {
                dispatch(addNotification({ message: 'جاري رفع الصورة ...', type: 'info' }));
                const uploadResult = await dispatch(uploadImageToCloudinary(selectedFile)).unwrap();
                finalImageUrl = uploadResult;
            }

            const finalProductData = {
                ...formData,
                images: { ...formData.images, main: finalImageUrl }
            };

            await dispatch(addNewProduct(finalProductData)).unwrap();

            dispatch(addNotification({
                message: 'تم حفظ المنتج بنجاح',
                type: 'success'
            }));

            // Reset
            setPreview(null);
            setSelectedFile(null);
            setActiveStep(0);
            setFormData({
                id: "", sku: "", slug: "", name: "", brand: "",
                category: { main: "", sub: "" },
                price: 0, oldPrice: 0, currency: "EGP",
                description: "", shortDescription: "",
                specifications: { material: "", madeIn: "", closureType: "" },
                variants: [],
                inventory: { totalStock: 0, availability: "in_stock" },
                images: { main: "", gallery: [], thumbnail: "" }
            });
            router.push('/')
        } catch (error) {
            dispatch(addNotification({ message: 'فشل الحفظ، تأكد من البيانات', type: 'error' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] py-20 px-4 font-tajawal" dir="rtl">
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl p-8 md:p-12 rounded-sm relative overflow-hidden">

                {isSubmitting && (
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="absolute top-0 left-0 h-1 bg-black z-50" />
                )}

                <div className="mb-12 text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-2 font-bold">لوحة التحكم</p>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">إضافة منتج جديد</h1>
                </div>

                <div className="flex justify-between mb-16 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="z-10 flex flex-col items-center">
                            <button
                                onClick={() => !isSubmitting && setActiveStep(index)}
                                className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-500 border-2 ${activeStep === index ? "bg-black text-white border-black shadow-lg scale-110" : "bg-white text-gray-300 border-gray-200"}`}
                            >
                                {index + 1}
                            </button>
                            <span className={`text-[10px] uppercase mt-3 tracking-widest font-bold ${activeStep === index ? "text-black" : "text-gray-300"}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 -z-0" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">

                        {/* Step 0: Basic Details */}
                        {activeStep === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="اسم المنتج" name="name" value={formData.name} onChange={handleInputChange} />
                                <InputField label="الماركة" name="brand" value={formData.brand} onChange={handleInputChange} />
                                <InputField label="القسم" name="main" value={formData.category.main} onChange={(e) => handleInputChange(e, 'category')} />
                                <InputField label="الرابط (Slug)" name="slug" value={formData.slug} onChange={handleInputChange} />
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black flex items-center gap-2 italic">
                                        <HiOutlinePhotograph className="text-lg" />
                                        الصورة
                                    </label>
                                    <div onClick={() => inputRef.current.click()} className="relative aspect-video md:aspect-[21/9] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all overflow-hidden">
                                        {preview ? (
                                            <div className="relative w-full h-full">
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-4 left-4 bg-black/80 text-white text-[9px] px-3 py-1 backdrop-blur-sm">LOCAL PREVIEW</div>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <HiOutlineCloudUpload className="text-4xl text-gray-300 mx-auto mb-2" />
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">اختر صورة المنتج</p>
                                            </div>
                                        )}
                                        <input type="file" hidden ref={inputRef} onChange={handleImageChange} accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Pricing & Stock */}
                        {activeStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <InputField label="السعر الحالي" name="price" type="number" value={formData.price} onChange={handleInputChange} />
                                <InputField label="السعر القديم" name="oldPrice" type="number" value={formData.oldPrice} onChange={handleInputChange} />
                                <InputField label="المخزون الكلي" name="totalStock" type="number" value={formData.inventory.totalStock} onChange={(e) => handleInputChange(e, 'inventory')} />
                            </div>
                        )}

                        {/* Step 2: Specifications */}
                        {activeStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="الخامة" name="material" value={formData.specifications.material} onChange={(e) => handleInputChange(e, 'specifications')} />
                                <InputField label="بلد الصنع" name="madeIn" value={formData.specifications.madeIn} onChange={(e) => handleInputChange(e, 'specifications')} />
                                <InputField label="نوع الإغلاق" name="closureType" value={formData.specifications.closureType} onChange={(e) => handleInputChange(e, 'specifications')} />
                                <InputField label="SKU" name="sku" value={formData.sku} onChange={handleInputChange} />
                            </div>
                        )}

                        {/* Step 3: Variants */}
                        {activeStep === 3 && (
                            <div className="space-y-8">
                                {formData.variants.map((v, i) => (
                                    <div key={i} className="flex gap-6 items-end border-b border-gray-100 pb-8 group">
                                        <div className="flex-1">
                                            <InputField label="اسم اللون" value={v.color} onChange={(e) => handleVariantChange(i, "color", e.target.value)} />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <label className="text-[10px] font-bold text-gray-400 mb-2 uppercase">الدرجة</label>
                                            <input type="color" className="w-12 h-10 cursor-pointer bg-transparent" value={v.hex} onChange={(e) => handleVariantChange(i, "hex", e.target.value)} />
                                        </div>
                                        <div className="w-32">
                                            <InputField label="مخزون اللون" type="number" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addVariant} className="w-full py-6 border-2 border-dashed border-gray-100 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:border-black hover:text-black transition-all group flex items-center justify-center gap-2">
                                    <HiOutlineColorSwatch className="text-lg" /> + إضافة خيار لوني جديد
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-16 flex justify-between items-center border-t border-gray-100 pt-10">
                    <button
                        disabled={activeStep === 0 || isSubmitting}
                        onClick={() => setActiveStep(prev => prev - 1)}
                        className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black disabled:opacity-0 transition-all"
                    >
                        السابق
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`bg-black text-white px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 flex items-center gap-3 ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-gray-800'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                جاري المعالجة الفاخرة...
                            </>
                        ) : (
                            activeStep === steps.length - 1 ? "إتمام الرفع والحفظ" : "الخطوة التالية"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}