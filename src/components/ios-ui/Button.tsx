
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-ios-blue text-white hover:bg-ios-blue/90 rounded-xl": variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl": variant === "secondary",
            "bg-ios-red text-white hover:bg-ios-red/90 rounded-xl": variant === "destructive",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-xl": variant === "outline",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "text-ios-blue underline-offset-4 hover:underline": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-lg px-3": size === "sm",
            "h-11 rounded-xl px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
