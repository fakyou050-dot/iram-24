import { useState, useEffect, useRef, ReactNode } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  onError?: () => void;
  /** Optional fallback rendered if the image fails to load. */
  fallback?: ReactNode;
  /** Optional explicit width/height to reserve space and avoid CLS. */
  width?: number;
  height?: number;
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";

const LazyImage = ({ src, alt, className = "", loading = "lazy", fetchPriority, onError, fallback, width, height }: LazyImageProps) => {
  const [isVisible, setIsVisible] = useState(loading === "eager");
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (loading === "eager" || !imgRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "400px" }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (hasError) return <>{fallback ?? null}</>;

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : PLACEHOLDER}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      {...({ fetchpriority: fetchPriority || (loading === "eager" ? "high" : undefined) } as any)}
      width={width}
      height={height}
      onError={() => {
        setHasError(true);
        onError?.();
      }}
    />
  );
};

export default LazyImage;
