import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps {
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  children: React.ReactNode;
  className?: string;
  name?: string;
}

interface RadioGroupItemProps {
  value: string | number;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<{
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  name?: string;
}>({});

/**
 * RadioGroup - Container for radio options
 */
export function RadioGroup({
  value,
  onValueChange,
  children,
  className,
  name,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div role="radiogroup" className={cn("space-y-2", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

/**
 * RadioGroupItem - Individual radio option with custom styling
 */
export function RadioGroupItem({
  value,
  children,
  className,
  disabled = false,
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const isSelected = context.value === value;

  const handleClick = () => {
    if (!disabled && context.onValueChange) {
      context.onValueChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      context.onValueChange?.(value);
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all duration-200",
        isSelected
          ? "border-accent bg-accent/5"
          : "border-border hover:border-muted-foreground/30 hover:bg-muted/30",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {/* Custom radio indicator */}
      <div
        className={cn(
          "relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          isSelected
            ? "border-accent"
            : "border-muted-foreground/50 group-hover:border-muted-foreground"
        )}
      >
        {/* Inner dot */}
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-200",
            isSelected
              ? "scale-100 bg-accent"
              : "scale-0 bg-transparent"
          )}
        />
      </div>

      {/* Hidden native input for form compatibility */}
      <input
        type="radio"
        name={context.name}
        value={String(value)}
        checked={isSelected}
        onChange={() => context.onValueChange?.(value)}
        disabled={disabled}
        className="sr-only"
      />

      {/* Label content */}
      <span className="flex-1 text-sm">{children}</span>
    </div>
  );
}

