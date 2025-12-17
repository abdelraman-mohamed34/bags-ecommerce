import { motion } from 'framer-motion'

export function EmptyProducts() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4"
        >
            <div className="text-6xl text-gray-300">🛍️</div>
            <h3 className="text-xl font-black text-gray-900">لا توجد منتجات حالياً</h3>
            <p className="text-gray-500 max-w-xs">عذراً، لم نجد أي منتجات تطابق بحثك أو متوفرة في هذا القسم حالياً.</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
            >
                تحديث الصفحة
            </button>
        </motion.div>
    );
}