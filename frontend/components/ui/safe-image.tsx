"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackEmoji?: string;
  fallbackColor?: string;
}

/**
 * Composant Image avec fallback automatique
 * - Si l'image locale existe : l'affiche
 * - Si non : affiche un placeholder coloré avec emoji
 * - Garantit que TOUJOURS quelque chose s'affiche
 */
export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  fallbackEmoji = "📦",
  fallbackColor = "#F5B400",
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: `linear-gradient(135deg, ${fallbackColor} 0%, ${fallbackColor}dd 100%)`,
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      >
        <span className="text-6xl">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          onError={() => setError(true)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => setError(true)}
        />
      )}
    </>
  );
}
