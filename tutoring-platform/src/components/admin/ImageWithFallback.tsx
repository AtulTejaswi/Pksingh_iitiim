'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  initials: string;
  className?: string;
}

export default function ImageWithFallback({ src, alt, initials, className = '' }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (src && !error) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 300px"
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  const colors = [
    'from-indigo-600 to-blue-500',
    'from-emerald-600 to-teal-500',
    'from-orange-600 to-amber-500',
    'from-purple-600 to-pink-500',
    'from-rose-600 to-red-500',
    'from-cyan-600 to-sky-500',
  ];
  const colorIndex = alt.length % colors.length;

  return (
    <div className={`${className} bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center`}>
      <span className="text-white font-bold text-lg uppercase select-none">
        {initials.slice(0, 2)}
      </span>
    </div>
  );
}
