/**
 * Products Page Loading Skeleton
 * Displays animated placeholder cards while products are loading
 */

/** Number of skeleton cards to display */
const SKELETON_COUNT = 6;

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Title skeleton */}
      <div className="h-12 w-48 bg-sand rounded mb-8 animate-pulse" aria-hidden="true" />

      {/* Product grid skeleton */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="status"
        aria-label="Loading products"
      >
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <div key={index} className="h-96 bg-ivory rounded-2xl animate-pulse" aria-hidden="true" />
        ))}
        <span className="sr-only">Loading products...</span>
      </div>
    </div>
  );
}
