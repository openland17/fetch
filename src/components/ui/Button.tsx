"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-blue text-white active:bg-blue/90",
  secondary: "bg-grey/20 text-charcoal active:bg-grey/30",
  outline: "border-2 border-blue text-blue bg-transparent active:bg-lightblue",
  ghost: "text-charcoal active:bg-grey/10",
  danger: "bg-error text-white active:bg-error/90",
};

const sizeStyles: Record<Size, string> = {
  sm: "py-2 px-3 text-sm rounded-lg min-h-[44px] min-w-[44px]",
  md: "py-3 px-4 text-[15px] rounded-xl min-h-[44px] min-w-[44px]",
  lg: "py-4 px-5 text-base rounded-xl min-h-[44px] min-w-[44px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.span
      className={fullWidth ? "block w-full" : "inline-block"}
      whileTap={{ scale: 0.95 }}
    >
      <button
        type="button"
        className={twMerge(
          "font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:pointer-events-none",
          fullWidth ? "w-full" : "",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 rounded-full bg-current/40 animate-pulse" />
        ) : (
          children
        )}
      </button>
    </motion.span>
  );
}
