/**
 * Input Component
 * Componente adicional para forms
 */

import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  className,
  ...props
}: InputProps) {
  return (
    <div className={clsx('flex flex-col', { 'w-full': fullWidth })}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <input
        className={clsx(
          'px-3 py-2 border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-[#0087A8] focus:border-transparent',
          'transition-colors duration-200',
          {
            'border-gray-300': !error,
            'border-red-500 focus:ring-red-500': error,
          },
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
