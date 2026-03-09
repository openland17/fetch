"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Variant = "blue" | "orange" | "green" | "grey";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  blue: "bg-lightblue text-blue",
  orange: "bg-lightorange text-orange",
  green: "bg-success/15 text-success",
  grey: "bg-grey/15 text-grey",
};

export default function Badge({
  children,
  variant = "grey",
  className,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
