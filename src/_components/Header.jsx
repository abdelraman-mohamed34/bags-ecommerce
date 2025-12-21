'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import globals from '../globals.js';
import Link from 'next/link.js';
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '@/features/async/userSlice.js';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { brandName } = globals;
    const { data: session } = useSession()
    const dispatch = useDispatch()
    const users = useSelector(u => u.users.users)

    const currentUser = users.find(u => u.email.trim() === session?.user?.email.trim())

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        dispatch(fetchAllUsers())
    }, [dispatch]);


    const navLinks = [
        { name: 'الرئيسية', href: '/' },
        { name: 'المتجر', href: '/', hasDropdown: true },
        { name: 'وصل حديثاً', href: '/' },
        { name: 'العروض', href: '/' },
    ];

    return (
        <header
            dir='rtl'
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}
        >
            <div className="px-6 flex items-center justify-between">
                <div className="flex flex-1 items-center justify-start sm:gap-5 gap-2">
                    {session?.user?.role === 'user' && (
                        <Link href={'/cart'} className="relative group cursor-pointer">
                            <ShoppingBag className="w-6 h-6 text-gray-800" />
                            <span className="absolute -top-2 -right-2 bg-red-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {currentUser?.cart?.length || 0}
                            </span>
                        </Link>
                    )}
                    <Link href={session ? '/account' : '/login'}>
                        <User className="w-6 h-6 text-gray-800 cursor-pointer " />
                    </Link>
                </div>

                <nav className="hidden flex-2 md:flex justify-center items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="group flex items-center gap-1 text-gray-700 font-medium hover:text-red-300 transition-colors"
                        >
                            {link.name}
                            {/* {link.hasDropdown && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />} */}
                        </a>
                    ))}
                </nav>

                <div className="flex flex-1 items-center justify-end gap-4">
                    <Link href='/' className='flex items-center'>
                        <h1 className="text-2xl font-bold tracking-tighter text-red-400 sm:mt-0 mt-1">{brandName}</h1>
                    </Link>
                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-lg font-medium border-b border-gray-50 pb-2">
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex gap-4 pt-4">
                                <button className="bg-black text-white px-6 py-2 rounded-full w-full">تسجيل الدخول</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;