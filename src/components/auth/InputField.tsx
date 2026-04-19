import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon: Icon, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Icon className="h-5 w-5" />
          </div>
          <input
            ref={ref}
            type={currentType}
            className={`
              block w-full pl-10 pr-10 py-3 
              bg-white/5 border border-white/10 rounded-xl
              text-white placeholder-gray-500
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
              transition-all duration-200
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
