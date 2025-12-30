/**
 * LoadingSkeleton Component
 * Reusable skeleton loading component for dashboard cards and other content
 */

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
