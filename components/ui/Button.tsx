import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { z } from "zod";

// =============================================================================
// VARIANTS & STYLES
// =============================================================================

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const ButtonVariantSchema = z.enum([
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
]);

const ButtonSizeSchema = z.enum(["default", "sm", "lg", "icon"]);

// =============================================================================
// TYPES
// =============================================================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: ButtonProps) {
  if (process.env.NODE_ENV === "development") {
    const variantCheck = props.variant
      ? ButtonVariantSchema.safeParse(props.variant)
      : { success: true };
    const sizeCheck = props.size ? ButtonSizeSchema.safeParse(props.size) : { success: true };

    if (!variantCheck.success) {
      console.warn(
        `[Button] Invalid variant: '${props.variant}'. Expected one of: ${ButtonVariantSchema.options.join(
          ", "
        )}`
      );
    }

    if (!sizeCheck.success) {
      console.warn(
        `[Button] Invalid size: '${props.size}'. Expected one of: ${ButtonSizeSchema.options.join(
          ", "
        )}`
      );
    }
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Validate props in dev mode
    validateProps({ variant, size, ...props });

    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
