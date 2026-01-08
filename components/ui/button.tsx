import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button variants configuration
 * CUSTOMIZE: Adjust styles to match client brand guidelines
 */
const buttonVariants = {
  variant: {
    // Dark button - main CTA style from landing page (square)
    primary:
      "bg-foreground text-background hover:bg-foreground/90",
    // Accent button - prominent gold CTA style from landing page (square)
    accent:
      "bg-accent text-accent-foreground hover:bg-accent-hover",
    // Light button - cream/off-white
    secondary:
      "bg-primary text-primary-foreground hover:bg-primary-hover",
    // Outline button
    outline:
      "border border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
    // Ghost button
    ghost: "text-foreground hover:bg-muted hover:text-foreground",
    // Destructive button
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    // Link style
    link: "text-accent underline-offset-4 hover:underline",
  },
  size: {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  },
};

/**
 * Get button class names based on variant and size
 */
export function getButtonStyles(
  variant: keyof typeof buttonVariants.variant = "primary",
  size: keyof typeof buttonVariants.size = "md",
  className?: string
) {
  return cn(
    "flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap cursor-pointer rounded-[4px]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    buttonVariants.variant[variant],
    buttonVariants.size[size],
    className
  );
}

type ButtonBaseProps = {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  isLoading?: boolean;
};

export type ButtonProps = ButtonBaseProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: false })
    | (React.PropsWithChildren<{ asChild: true; className?: string }>)
  );

/**
 * Primary button component with multiple variants and sizes.
 * Supports rendering as a child element via asChild prop.
 *
 * @example
 * <Button variant="primary" size="lg">Get Started</Button>
 * <Button variant="outline">Learn More</Button>
 * <Button asChild><Link href="/dashboard">Dashboard</Link></Button>
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    isLoading = false,
    className,
    children,
  } = props;

  const buttonClassName = getButtonStyles(variant, size, className);

  // Handle asChild - render children with button styles
  if ("asChild" in props && props.asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string;
    }>;
    return React.cloneElement(child, {
      className: cn(buttonClassName, child.props.className),
    });
  }

  // Regular button rendering - extract custom props to avoid passing them to DOM
  const {
    variant: _variant,
    size: _size,
    isLoading: _isLoading,
    className: _className,
    disabled,
    ...buttonProps
  } = props as React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonBaseProps;

  return (
    <button
      className={cn(buttonClassName, "relative")}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      <span className={cn("flex items-center gap-2", isLoading && "invisible")}>
        {children}
      </span>
    </button>
  );
}
