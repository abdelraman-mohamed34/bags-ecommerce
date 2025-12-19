"use client";
import { deleteProduct } from "@/features/async/productSlice";
import { uploadProductToCart } from "@/features/async/userSlice";
import { addNotification } from "@/features/normal/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export default function ProductInfo({
    product,
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
}) {
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const params = useSearchParams()
    const router = useRouter()

    const handleAddToCart = () => {
        if (!session)
            dispatch(addNotification({
                message: 'تحتاج الي تسجيل الدخول',
                type: 'warning',
            }))

        dispatch(uploadProductToCart({ savedProductsId: params.get('q') }))
        dispatch(addNotification({
            message: 'تمت الإضافة للسله',
            type: 'success',
        }))
        try {

        } catch (err) {
            dispatch(addNotification({
                message: 'حدث حطأ',
                type: 'error',
            }))
        }
    }

    const handleDelete = () => {
        dispatch(deleteProduct(product?.id))
        dispatch(addNotification({
            type: 'success',
            message: 'تم حذف المنتج',
        }))
        router.push('/')
    }

    return (
        <section className="flex flex-col space-y-8 font-tajawal text-right px-2" dir="rtl">

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <span className="text-red-300 font-bold tracking-wider text-sm bg-red-50/50 px-3 py-1 rounded-full">
                    {product?.brand}
                </span>
                <h1 className="text-4xl font-black mt-4 text-gray-900 leading-tight">
                    {product?.name}
                </h1>
            </motion.div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl w-fit">
                <span className="text-4xl font-black text-gray-900">
                    {product?.price.toLocaleString()} {product?.currency}
                </span>
                {product?.discount.isActive && (
                    <div className="flex flex-col">
                        <span className="line-through text-gray-400 text-sm">
                            {product?.oldPrice.toLocaleString()} {product?.currency}
                        </span>
                        <span className="text-red-500 text-xs font-bold">
                            وفر {product?.discount.percentage}%
                        </span>
                    </div>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">اللون المختارة: {selectedVariant?.color}</h3>
                    <span className="text-xs text-gray-400">متوفر {selectedVariant?.stock} قطعة</span>
                </div>
                <div className="flex gap-2">
                    {product?.variants.map((variant) => (
                        <button
                            key={variant.variantId}
                            onClick={() => setSelectedVariant(variant)}
                            className={`relative w-12 h-12 rounded-full border-4 transition-all duration-300 ${selectedVariant?.variantId === variant?.variantId
                                ? "border-red-300 scale-110 shadow-lg"
                                : "border-white shadow-sm hover:scale-105"
                                }`}
                            style={{ backgroundColor: variant?.hex }}
                        >
                            {selectedVariant?.variantId === variant?.variantId && (
                                <motion.span
                                    layoutId="active-dot"
                                    className="absolute -bottom-1 -right-1 bg-red-300 text-white rounded-full p-0.5 px-1.5 text-[10px]"
                                >
                                    ✓
                                </motion.span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. الكمية والأزرار */}
            <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-6">
                    <label className="font-bold text-gray-800">الكمية:</label>
                    <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden bg-white">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-5 py-2 hover:bg-gray-200 transition-colors font-bold text-xl"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-black text-lg">{quantity}</span>
                        <button
                            onClick={() => {
                                quantity < product?.inventory.totalStock ? setQuantity(q => q + 1) : null
                            }}
                            className="px-5 py-2 hover:bg-gray-200 transition-colors font-bold text-xl text-red-300"
                        >
                            +
                        </button>
                    </div>
                </div>

                {
                    session?.user.role !== 'admin' ? (
                        <div className="flex gap-3 mt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white py-5 rounded-xl font-black text-xl shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                            >
                                <span>إضافة للسلة</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#fee2e2" }}
                                className="p-5 border-2 border-gray-200 rounded-xl text-gray-400"
                            >
                                ❤
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex gap-3 mt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-black text-white py-5 rounded-xl font-black text-xl shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                            >
                                <span> تعديل</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#fee2e2" }}
                                className="p-5 border-2 border-gray-200 rounded-xl text-gray-400"
                                onClick={handleDelete}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </motion.button>
                        </div>
                    )
                }
            </div>

        </section>
    );
}