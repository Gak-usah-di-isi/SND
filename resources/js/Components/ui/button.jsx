import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

const Button = forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const variants = {
      default: 'bg-blue-600 text-white shadow hover:bg-blue-700',
      destructive: 'bg-red-500 text-white shadow hover:bg-red-600',
      outline: 'border border-gray-200 bg-white shadow hover:bg-gray-50 hover:text-gray-900',
      secondary: 'bg-gray-100 text-gray-800 shadow hover:bg-gray-200',
      ghost: 'hover:bg-gray-100 hover:text-gray-900',
      link: 'text-blue-600 underline-offset-4 hover:underline',
    };
    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3',
      lg: 'h-10 rounded-md px-6',
      icon: 'size-9',
    };
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
          variants[variant] ?? variants.default,
          sizes[size] ?? sizes.default,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
