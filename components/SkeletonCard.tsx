export default function SkeletonCard() {
  return (
    <div className="p-6 border rounded-2xl">
      <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
      <div className="mt-6 h-4 w-full rounded bg-gray-200 animate-pulse" />
      <div className="mt-4 h-4 w-full rounded bg-gray-200 animate-pulse" />
      <div className="mt-6 h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
    </div>
  );
}