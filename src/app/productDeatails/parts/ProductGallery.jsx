"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ProductGallery Component
 * Handles large image display, variant syncing, and thumbnail navigation.
 */
export default function ProductGallery({ product, selectedVariant }) {
    // State for the currently viewed image in the main frame
    const [activeImage, setActiveImage] = useState(product?.images?.main);

    // Effect: Automatically update the main image when a user selects a different color/variant
    useEffect(() => {
        if (selectedVariant?.images?.[0]) {
            setActiveImage(selectedVariant.images[0]);
        }
    }, [selectedVariant]);

    // Create a unique list of all available photos (Main + Gallery + Variant specific)
    const allPhotos = Array.from(new Set([
        product?.images?.main,
        ...(product?.images?.gallery || []),
        ...(selectedVariant?.images || [])
    ])).filter(Boolean);

    // Handler for navigation buttons (Next/Previous)
    const paginate = (direction) => {
        const currentIndex = allPhotos.indexOf(activeImage);
        let nextIndex = currentIndex + direction;

        if (nextIndex >= allPhotos.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = allPhotos.length - 1;

        setActiveImage(allPhotos[nextIndex]);
    };

    return (
        <section className="space-y-6 font-tajawal select-none">
            {/* 1. MAIN DISPLAY AREA */}
            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden sm:rounded-xl bg-gray-50 group">

                <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                        key={activeImage}
                        src={activeImage}
                        // Entrance/Exit animations for a smooth sliding feel
                        initial={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        // Enable drag-to-swipe for mobile users
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.x > 100) paginate(-1);
                            else if (offset.x < -100) paginate(1);
                        }}
                        className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                        alt={product?.name}
                    />
                </AnimatePresence>

                {/* DISCOUNT BADGE */}
                {product?.discount?.isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-6 right-6 bg-red-600 text-white px-5 py-2 rounded-2xl text-xs font-black shadow-xl z-10 uppercase tracking-wider"
                    >
                        Save {product.discount.percentage}%
                    </motion.div>
                )}

                {/* SIDE NAVIGATION (Visible on Hover) */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <button
                        onClick={() => paginate(-1)}
                        className="w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-full flex items-center justify-center font-bold hover:bg-black hover:text-white transition-all pointer-events-auto"
                    >
                        →
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-full flex items-center justify-center font-bold hover:bg-black hover:text-white transition-all pointer-events-auto"
                    >
                        ←
                    </button>
                </div>
            </div>

            {/* 2. THUMBNAIL NAVIGATION LIST */}
            <div className="flex gap-3 pb-2 px-2 sm:px-0 pr-2 sm:pr-2 pt-2 sm:pt-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {allPhotos.map((img, idx) => (
                    <motion.button
                        key={idx}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setActiveImage(img)}
                        // Dynamic borders and scaling for the active thumbnail
                        className={`relative flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all duration-500 snap-start ${activeImage === img
                            ? "border-red-300 ring-4 ring-blue-50 scale-105 shadow-lg"
                            : "border-gray-200 opacity-50 hover:opacity-100"
                            }`}
                    >
                        <img src={img} className="w-full h-full object-cover" alt={`view-${idx}`} />

                        {/* Layout animation: The blue highlight slides between thumbnails */}
                        {activeImage === img && (
                            <motion.div
                                layoutId="activeThumb"
                                className="absolute inset-0 bg-red-300/5 z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </section>
    );
}