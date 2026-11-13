import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "bestseller" | "new" | "handmade" | "limited" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  const variantStyles = {
    bestseller: "bg-amber-100 text-amber-900 border-amber-300",
    new: "bg-emerald-100 text-emerald-900 border-emerald-300",
    handmade: "bg-indigo-100 text-indigo-950 border-indigo-300",
    limited: "bg-rose-100 text-rose-950 border-rose-300",
    neutral: "bg-stone-100 text-stone-800 border-stone-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
