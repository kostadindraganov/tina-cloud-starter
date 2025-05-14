'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithLoadingProps {
  src: string;
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
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
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
    </div>
  );
}

export default ImageWithLoading; 