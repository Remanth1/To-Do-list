import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = `
    relative px-6 py-3 rounded-lg font-bold border-2 border-border
    transition-all duration-200
    disabled:cursor-not-allowed disabled:opacity-50
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  `;

  const variantStyles = {
    primary: `
      bg-primary text-primary-foreground
      brutal-shadow
      hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none
      active:translate-x-1 active:translate-y-1 active:shadow-none
      focus:ring-primary
    `,
    secondary: `
      bg-card text-foreground
      brutal-shadow-sm
      hover:bg-muted hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none
      focus:ring-border
    `,
    ghost: `
      bg-transparent text-foreground border-transparent
      hover:bg-muted
      focus:ring-border
    `
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
