export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm font-tajawal animate-pulse">
      <div className="aspect-[4/2] bg-gray-200" />

      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-8 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
        <div className="flex gap-1.5 mt-2">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}