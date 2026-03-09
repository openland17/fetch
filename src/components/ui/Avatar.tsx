"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

type Size = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<Size, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: Size;
  className?: string;
  bordered?: boolean;
  /** Set true for the first visible dog photo on a screen to load eagerly */
  priority?: boolean;
}

export default function Avatar({
  src,
  alt = "",
  fallback = "🐕",
  size = "md",
  className,
  bordered,
  priority = false,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    setImgError(false);
  }, [src]);
  const px = sizeMap[size];
  const showImage = src && !imgError;

  const wrapperClass = twMerge(
    "rounded-full overflow-hidden shrink-0 flex items-center justify-center font-medium text-charcoal bg-lightblue",
    bordered && "ring-2 ring-orange ring-offset-2 ring-offset-offwhite",
    className
  );

  const textSize =
    size === "sm" ? "text-xs" : size === "md" ? "text-base" : size === "lg" ? "text-xl" : "text-2xl";

  if (showImage) {
    return (
      <div
        className={wrapperClass}
        style={{ width: px, height: px, aspectRatio: "1" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={src}
          alt={alt}
          width={px}
          height={px}
          loading={priority ? "eager" : "lazy"}
          className="object-cover w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={twMerge(wrapperClass, textSize)}
      style={{ width: px, height: px, aspectRatio: "1" }}
    >
      {fallback}
    </div>
  );
}
