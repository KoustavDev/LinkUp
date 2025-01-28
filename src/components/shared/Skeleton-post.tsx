export default function SkeletonPost() {
  return (
    <div className="w-full max-w-xl bg-black/90 rounded-xl p-4 space-y-4">
      {/* Header with avatar and timestamp */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-700/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Main image */}
      <div className="aspect-[4/3] w-full rounded-xl bg-gray-700 animate-pulse" />

      {/* Engagement metrics */}
      <div className="flex space-x-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-700 animate-pulse" />
            <div className="w-8 h-4 bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Comment input */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
        <div className="flex-1 h-10 rounded-full bg-gray-700/50 animate-pulse" />
      </div>
    </div>
  );
}
