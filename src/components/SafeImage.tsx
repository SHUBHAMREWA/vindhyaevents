"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  skeletonClassName?: string;
}

// Global royalty-free wedding & event image as universal fallback
const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

export default function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className = "",
  skeletonClassName = "",
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const effectiveSrc = hasError || !imgSrc ? fallbackSrc : imgSrc;

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse z-1 pointer-events-none rounded-[inherit] ${skeletonClassName}`}
          aria-hidden="true"
        >
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-8 h-8 opacity-40 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z" />
            </svg>
          </div>
        </div>
      )}
      <Image
        {...props}
        src={effectiveSrc}
        alt={alt || "RIWAJ Events"}
        unoptimized={true}
        className={`${className} transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
            setIsLoading(false);
          }
        }}
      />
    </>
  );
}
