import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "secondary" | "destructive" | "ghost" | "outline";
    size?: "default" | "sm" | "lg";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";

  const variantStyles = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10",
    secondary:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-900/10",
    destructive:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-500/10",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    outline:
      "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  };

  const sizeStyles = {
    default: "h-11 px-5 text-sm",
    sm: "h-9 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
