import React, { useState } from "react";

interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: any;
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt = "",
  className = "",
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const imgSrc = typeof src === "string" ? src : (src as any)?.src || "";

  if (error || !imgSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-semibold rounded ${className}`}
      >
        <span>{alt || "INSA ERP"}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
