import { Loader2 } from 'lucide-react';

export function AdminLoading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export function TableLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  );
}