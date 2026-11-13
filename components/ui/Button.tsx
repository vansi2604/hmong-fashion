import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 rounded-full gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-full gap-2",
    lg: "text-base px-7 py-3.5 rounded-full gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm focus-visible:ring-neutral-900",
    secondary:
      "bg-amber-800/10 text-amber-900 hover:bg-amber-800/20 focus-visible:ring-amber-800",
    outline:
      "border border-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-400 focus-visible:ring-neutral-400",
    accent:
      "bg-rose-700 text-white hover:bg-rose-800 shadow-md shadow-rose-900/10 focus-visible:ring-rose-700",
    ghost:
      "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
