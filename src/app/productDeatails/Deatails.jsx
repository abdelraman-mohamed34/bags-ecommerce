"use client";
import React, { useEffect, useState, useMemo } from "react";
import ProductInfo from "./parts/ProductInfo";
import ProductTabs from "./parts/ProductTabs";
import ProductGallery from "./parts/ProductGallery";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/features/async/productSlice";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductGrid from "@/_products/ProductGrid";

export default function ProductPage() {
    const dispatch = useDispatch();
    const params = useSearchParams();
    const currentQuery = params.get('q');
    const { products, isLoading } = useSelector(state => state.items);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const product = products?.find(i => i.id === currentQuery);

    const relatedProducts = useMemo(() => {
        if (!product || !products) return [];

        const currentCat = typeof product.category === 'object' ? product.category.main : product.category;

        return products
            .filter(p => {
                const pCat = typeof p.category === 'object' ? p.category.main : p.category;
                return pCat === currentCat && p.id !== product.id;
            })
            .slice(0, 5);
    }, [product, products]);

    useEffect(() => {
        if (product && !selectedVariant) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product, selectedVariant]);

    if (isLoading || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-2 border-black border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-white font-tajawal sm:pt-24 pt-10 md:pt-32 sm:pb-20"
            dir="rtl"
        >
            <div className="max-w-[1600px] mx-auto sm:px-4 px-2 md:px-10 lg:px-16">

                {/* قسم تفاصيل المنتج (Gallery & Info) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <ProductGallery product={product} selectedVariant={selectedVariant} />
                    </div>
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
                        <ProductInfo
                            product={product}
                            selectedVariant={selectedVariant}
                            setSelectedVariant={setSelectedVariant}
                            quantity={quantity}
                            setQuantity={setQuantity}
                        />
                    </div>
                </div>

                <div className="mt-20">
                    <ProductTabs product={product} />
                </div>

                {relatedProducts.length > 0 && (
                    <div className="sm:mt-32 mt-0 sm:border-t border-gray-200 pt-20">
                        <div className="text-center sm:mb-16 space-y-3">
                            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">اكتشف المزيد</p>
                            <h2 className="text-3xl font-bold text-black">منتجات من نفس الفئة</h2>
                        </div>
                        <ProductGrid products={relatedProducts} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}