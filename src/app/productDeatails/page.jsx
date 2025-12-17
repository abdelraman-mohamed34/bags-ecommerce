"use client";
import React, { useEffect, useState } from "react";
import ProductInfo from "./parts/ProductInfo";
import ProductTabs from "./parts/ProductTabs";
import ProductGallery from "./parts/ProductGallery";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/features/async/productSlice";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ProductPage() {
    const dispatch = useDispatch();
    const params = useSearchParams();
    const currentQuery = params.get('q');

    // جلب المنتجات وحالة التحميل من Redux
    // تأكد من مسميات الـ state في الـ store عندك (هنا افترضت وجود isLoading)
    const { products, isLoading } = useSelector(state => state.items);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // 1. طلب البيانات عند تحميل المكون
    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    // 2. تحديث الـ selectedVariant فور العثور على المنتج
    const product = products?.find(i => i.id === currentQuery);

    useEffect(() => {
        if (product && !selectedVariant) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product, selectedVariant]);

    // 3. حالة الانتظار (Loading UI)
    if (isLoading || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50/50 py-5 px-4 sm:px-6 lg:px-8 font-tajawal"
            dir="rtl"
        >
            <div className="max-w-7xl mx-auto">
                {/* الجزء العلوي: الصور والمعلومات */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white sm:rounded-[2.5rem] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* معرض الصور */}
                    <div className="sm:p-6 md:p-10 bg-gray-50/30">
                        <ProductGallery
                            product={product}
                            selectedVariant={selectedVariant}
                        />
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="p-6 md:p-10">
                        <ProductInfo
                            product={product}
                            selectedVariant={selectedVariant}
                            setSelectedVariant={setSelectedVariant}
                            quantity={quantity}
                            setQuantity={setQuantity}
                        />
                    </div>
                </div>

                {/* الجزء السفلي: التبويبات (المواصفات والتقييمات) */}
                <div className="mt-8">
                    <ProductTabs product={product} />
                </div>
            </div>
        </motion.div>
    );
}