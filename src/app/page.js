"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllProducts } from '@/features/async/productSlice';
import ProductGrid from '@/_products/ProductGrid';
import { MdPayment } from "react-icons/md";
import { MdOutlineSpeed } from "react-icons/md";
import { RiEqualizer2Fill } from "react-icons/ri";

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((p) => p.items.products);
  const [activeCategory, setActiveCategory] = useState("الكل");

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const uniqueCategories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const cats = products
      .map(p => (typeof p.category === 'object' ? p.category.main : p.category))
      .filter(Boolean);
    return [...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "الكل") return products;
    return products.filter(p => {
      const catName = typeof p.category === 'object' ? p.category.main : p.category;
      return catName === activeCategory;
    });
  }, [products, activeCategory]);

  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] font-tajawal" dir="rtl">
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-gray-900">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/80 mb-6"
          >
            مجموعة شتاء 2025 الحصرية
          </motion.p>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-4xl md:text-7xl 2xl:text-8xl font-bold text-white tracking-tight mb-10"
          >
            أناقة تتحدث عنك
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button
              onClick={scrollToProducts}
              className="px-12 py-5 bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] hover:bg-red-300 hover:text-white transition-all duration-500 shadow-2xl"
            >
              تسوق الآن
            </button>
          </motion.div>
        </div>
      </section>

      <section id="products-section" className="max-w-[1600px] mx-auto sm:px-4 px-2 md:px-16 py-16">
        <div className="flex flex-col md:flex-row justify-between sm:mb-10 gap-5 items-center md:items-end">
          <div className="space-y-4 text-center md:text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">مختاراتنا لك</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">أحدث القطع</h2>
          </div>

          <div className="flex flex-wrap gap-8 text-[10px] uppercase tracking-widest font-bold items-center justify-center">
            <button
              onClick={() => setActiveCategory("الكل")}
              className="relative pb-2"
            >
              <span className={activeCategory === "الكل" ? "text-black" : "text-gray-400 hover:text-black"}>
                الكل
              </span>
              {activeCategory === "الكل" && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              )}
            </button>

            {uniqueCategories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(cat)}
                className="relative pb-2"
              >
                <span className={activeCategory === cat ? "text-black" : "text-gray-400 hover:text-black"}>
                  {cat}
                </span>
                {activeCategory === cat && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ProductGrid products={filteredProducts} />
        </motion.div>
      </section>

      <section className="bg-red-100 border-y border-gray-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          <FeatureItem title="شحن سريع" desc="توصيل مجاني لجميع الطلبات فوق 2000 ج.م" icon={<MdOutlineSpeed />} />
          <FeatureItem title="جودة فاخرة" desc="نستخدم أفضل الخامات العالمية لضمان راحتك" icon={<RiEqualizer2Fill />} />
          <FeatureItem title="دفع آمن" desc="تشفير كامل لبياناتك لضمان تجربة شراء آمنة" icon={<MdPayment />} />
        </div>
      </section>
    </main>
  );
}

function FeatureItem({ title, desc, icon }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-xl font-light text-gray-300 border border-gray-200 uppercase">
        {icon}
      </div>
      <h4 className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-bold text-gray-900">{title}</h4>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-[200px] mx-auto">{desc}</p>
    </div>
  );
}