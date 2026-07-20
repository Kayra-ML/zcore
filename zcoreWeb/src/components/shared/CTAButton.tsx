import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
}

const variants = {
  primary:
    "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 border border-emerald-500/20",
  secondary:
    "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10",
  ghost: "hover:bg-white/[0.06] text-zinc-400 hover:text-white",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2",
};

export default function CTAButton({
  variant = "primary",
  size = "md",
  children,
  className,
  as = "button",
  href,
  ...props
}: CTAButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none",
    "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
