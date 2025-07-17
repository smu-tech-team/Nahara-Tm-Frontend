const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-md flex gap-4">
    <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
    </div>
  </div>
);

export default SkeletonCard;
