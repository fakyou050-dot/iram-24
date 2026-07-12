const PremiumSkeleton = () => (
  <div className="space-y-10 py-8 animate-fade-in">
    {/* Hero skeleton */}
    <div className="grid grid-cols-12 gap-px">
      <div className="col-span-12 lg:col-span-8">
        <div className="aspect-[16/9] skeleton-shimmer" />
        <div className="space-y-3 mt-5">
          <div className="h-3 w-20 skeleton-shimmer" />
          <div className="h-8 w-3/4 skeleton-shimmer" />
          <div className="h-8 w-1/2 skeleton-shimmer" />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-px">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[4/3] lg:aspect-[16/10] skeleton-shimmer" />
        ))}
      </div>
    </div>

    {/* Section grid skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-[4/3] skeleton-shimmer" />
          <div className="h-3 w-16 skeleton-shimmer" />
          <div className="h-4 w-full skeleton-shimmer" />
          <div className="h-4 w-4/5 skeleton-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

export default PremiumSkeleton;
