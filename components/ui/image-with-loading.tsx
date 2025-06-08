'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithLoadingProps {
  src: string | undefined | null;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ImageWithLoading({ 
  src, 
  alt, 
  fill, 
  priority, 
  sizes, 
  className 
}: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle undefined/null src
  if (!src) {
    return (
      <span className={`inline-block bg-gray-200 dark:bg-gray-700 ${className}`}>
        <span className="sr-only">{alt}</span>
      </span>
    );
  }

  return (
    <span className="relative inline-block w-full h-full">
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <span className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
            <span className="sr-only">Loading...</span>
          </span>
        </span>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
        onLoad={() => setIsLoading(false)}
      />
    </span>
  );
}

export default ImageWithLoading; 