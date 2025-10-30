/**
 * Design System v3.0 - Button Component
 * Botão moderno com gradientes, microinterações e variantes
 */

import React from 'react';
import { tokens } from '../../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Estilos base
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variantes
  const variants = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600
      hover:from-primary-400 hover:to-primary-500
      active:from-primary-600 active:to-primary-700
      text-white
      shadow-lg shadow-primary-500/30
      hover:shadow-xl hover:shadow-primary-500/40
      hover:-translate-y-0.5
      focus:ring-primary-500/20
    `,
    secondary: `
      bg-white
      hover:bg-gray-50
      active:bg-gray-100
      text-gray-700
      border-2 border-gray-200
      hover:border-gray-300
      shadow-sm
      hover:shadow-md
      focus:ring-gray-300/50
    `,
    ghost: `
      bg-transparent
      hover:bg-gray-100/80
      active:bg-gray-200/80
      text-gray-600
      hover:text-gray-900
      focus:ring-gray-300/50
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-400 hover:to-red-500
      active:from-red-600 active:to-red-700
      text-white
      shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/40
      hover:-translate-y-0.5
      focus:ring-red-500/20
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600
      hover:from-green-400 hover:to-green-500
      active:from-green-600 active:to-green-700
      text-white
      shadow-lg shadow-green-500/30
      hover:shadow-xl hover:shadow-green-500/40
      hover:-translate-y-0.5
      focus:ring-green-500/20
    `,
  };

  // Tamanhos
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
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
      )}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </button>
  );
};
