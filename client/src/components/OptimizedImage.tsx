import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  loading = 'lazy',
  priority = false,
  sizes,
  quality = 75,
  onLoad,
  onError,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!loading || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Generate optimized URLs
  const getOptimizedSrc = (originalSrc: string, format: 'webp' | 'avif' | 'original' = 'original') => {
    if (format === 'original') return originalSrc;
    
    // Replace extension with optimized format
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
  };
  
  // Generate srcSet for responsive images
  const generateSrcSet = (src: string, format: 'webp' | 'avif' | 'original' = 'original') => {
    if (!width) return undefined;
    
    const baseSrc = getOptimizedSrc(src, format);
    const sizes = [width];
    
    // Add 2x and 3x variants for high DPI displays
    if (width <= 800) {
      sizes.push(width * 2, width * 3);
    }
    
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  };
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || priority) {
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [loading, priority]);
  
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  const handleError = () => {
    setHasError(true);
    onError?.();
  };
  
  // Placeholder component
  const renderPlaceholder = () => {
    if (placeholder === 'blur' && blurDataURL) {
      return (
        <img
          src={blurDataURL}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      );
    }
    
    return (
      <div 
        className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />
    );
  };
  
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {placeholder !== 'empty' && renderPlaceholder()}
      
      {isInView && (
        <picture>
          {/* AVIF format for supported browsers */}
          <source 
            srcSet={generateSrcSet(src, 'avif')} 
            type="image/avif" 
            sizes={sizes}
          />
          
          {/* WebP format for supported browsers */}
          <source 
            srcSet={generateSrcSet(src, 'webp')} 
            type="image/webp" 
            sizes={sizes}
          />
          
          {/* Original format as fallback */}
          <img
            src={getOptimizedSrc(src)}
            srcSet={generateSrcSet(src, 'original')}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      )}
    </div>
  );
}

// Higher-order component for logo optimization
export function OptimizedLogo({ 
  src, 
  alt, 
  className = 'max-w-full max-h-full object-contain' 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={120}
      height={80}
      className={className}
      loading="lazy"
      sizes="(max-width: 768px) 100px, 120px"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo="
    />
  );
}