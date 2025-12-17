"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyProducts } from "./parts/EmptyProducts";
import { ProductCardSkeleton } from "./parts/ProductCardSkeleton";
import ProductCard from "./parts/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/features/async/productSlice";
import Link from "next/link";

export default function ProductGrid() {
    // Select products state from Redux store
    const productsState = useSelector(state => state.items);
    const dispatch = useDispatch();

    // Trigger data fetching on component mount
    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto font-tajawal text-right" dir="rtl">

            {/* --- Section Header --- */}
            <header className="mb-12 flex flex-col items-start border-r-4 border-blue-600 pr-6">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    Shop Our Collection
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    The finest bags crafted from genuine leather.
                </p>
            </header>

            {/* --- Products Grid Layout --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                <AnimatePresence mode="wait">

                    {/* Phase 1: Loading State - Displaying Skeletons */}
                    {productsState?.loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                                key={`skeleton-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ProductCardSkeleton />
                            </motion.div>
                        ))
                    ) :

                        /* Phase 2: Empty State - No products found */
                        productsState?.products?.length === 0 ? (
                            <EmptyProducts key="empty" />
                        ) :

                            /* Phase 3: Success State - Mapping Products */
                            (
                                productsState?.products?.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }} // Staggered entry effect
                                    >
                                        <Link
                                            href={`productDeatails?q=${item.id}`}
                                            className="block h-full outline-none  rounded-xl"
                                        >
                                            <ProductCard product={item} />
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                </AnimatePresence>
            </div>
        </section>
    );
}