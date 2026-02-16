import { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  type?: 'text' | 'email' | 'password';
  error?: string;
  success?: boolean;
}

export function TextInput({ 
  label, 
  type = 'text', 
  error, 
  success,
  className = '',
  ...props 
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const getBorderColor = () => {
    if (error) return 'border-destructive focus:ring-destructive';
    if (success) return 'border-primary focus:ring-primary';
    if (isFocused) return 'border-border focus:ring-primary';
    return 'border-border focus:ring-primary';
  };

  const getIconColor = () => {
    if (error) return 'text-destructive';
    if (success) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-bold text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full rounded-lg border-2 bg-card px-4 py-3 font-medium
            text-foreground placeholder-muted-foreground
            transition-all duration-200
            focus:outline-none focus:ring-2
            disabled:bg-muted disabled:text-muted-foreground
            ${getBorderColor()}
            ${isPassword ? 'pr-10' : ''}
            ${error || success ? 'pr-10' : ''}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Password toggle icon */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Error/Success icon */}
        {!isPassword && error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className={`h-5 w-5 ${getIconColor()}`} />
          </div>
        )}
        {!isPassword && success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className={`h-5 w-5 ${getIconColor()}`} />
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-destructive font-medium flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
