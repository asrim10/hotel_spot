import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        variant === "default"
          ? "border border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          : variant === "success"
            ? "border border-green-200 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-100"
            : variant === "warning"
              ? "border border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
              : variant === "destructive"
                ? "border border-red-200 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-100"
                : ""
      } ${className}`}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { Badge };
