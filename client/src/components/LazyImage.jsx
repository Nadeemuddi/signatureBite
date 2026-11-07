import { useState } from 'react';

/**
 * Image with native lazy-loading and a shimmer placeholder until it loads.
 * Falls back to a neutral food emoji tile if the image fails.
 */
export default function LazyImage({ src, alt, className = '', imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && <div className="skeleton absolute inset-0" />}
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-4xl dark:bg-gray-800">
          🍽️
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
