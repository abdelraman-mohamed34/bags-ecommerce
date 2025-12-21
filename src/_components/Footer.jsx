"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import globals from '@/globals';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 font-tajawal pt-20 pb-12 lg:pt-32" dir="rtl">
            <div className="max-w-[1600px] mx-auto px-8 md:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">

                    <div className="space-y-8">
                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-red-400">
                            {globals.brandName}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
                            نحن نقدم تجربة تسوق فريدة تجمع بين الفخامة والبساطة، مع التركيز على الجودة والتفاصيل التي تمنحك مظهراً استثنائياً.
                        </p>
                        <div className="flex gap-6 opacity-60">
                            <SocialIcon icon="instagram" />
                            <SocialIcon icon="twitter" />
                            <SocialIcon icon="facebook" />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[11px] md:text-xs uppercase tracking-[0.4em] font-bold text-red-300">روابط سريعة</h4>
                        <ul className="space-y-5">
                            <FooterLink href="/" label="المتجر" />
                            <FooterLink href="/" label="وصل حديثاً" />
                            <FooterLink href="/" label="المجموعات" />
                            <FooterLink href="/" label="قصتنا" />
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[11px] md:text-xs uppercase tracking-[0.4em] font-bold text-red-300">الدعم والمساعدة</h4>
                        <ul className="space-y-5">
                            <FooterLink href="/shipping" label="سياسة الشحن" />
                            <FooterLink href="/returns" label="الاسترجاع" />
                            <FooterLink href="/faq" label="الأسئلة الشائعة" />
                            <FooterLink href="/contact" label="اتصل بنا" />
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[11px] md:text-xs uppercase tracking-[0.4em] font-bold text-red-300">النشرة البريدية</h4>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">اشترك ليصلك جديد مجموعاتنا الحصرية وعروضنا الخاصة.</p>
                        <div className="relative group pt-2 hidden">
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                className="w-full bg-transparent border-b border-gray-200 py-4 px-2 text-sm md:text-base outline-none focus:border-black transition-all duration-500 placeholder:text-gray-300"
                            />
                            <button className="absolute left-0 bottom-4 text-[11px] md:text-xs font-bold uppercase tracking-widest hover:text-red-300 transition-colors">
                                اشتراك
                            </button>
                        </div>
                    </div>

                </div>

                <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] md:text-[12px] text-red-300 uppercase tracking-[0.2em] font-medium">
                        &copy; {currentYear} جميع الحقوق محفوظة لـ {globals.brandName}
                    </p>

                    <div className="flex items-center gap-10 text-[10px] md:text-[12px] text-gray-400 uppercase tracking-[0.2em]">
                        <Link href="/privacy" className="hover:text-black transition-colors font-medium">سياسة الخصوصية</Link>
                        <Link href="/terms" className="hover:text-black transition-colors font-medium">الشروط والأحكام</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, label }) {
    return (
        <li>
            <Link href={href} className="text-gray-400 hover:text-red-200 text-sm md:text-base transition-all duration-300 hover:translate-x-[-6px] inline-block font-medium">
                {label}
            </Link>
        </li>
    );
}

function SocialIcon({ icon }) {
    return (
        <motion.a
            href="#"
            whileHover={{ y: -5, opacity: 1 }}
            className="text-gray-900 transition-all"
        >
            <div className="w-6 h-6 bg-current mask-size-contain mask-no-repeat" style={{ maskImage: `url(/icons/${icon}.svg)` }} />
            <span className="sr-only">{icon}</span>
        </motion.a>
    );
}