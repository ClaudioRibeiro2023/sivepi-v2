/**
 * Design System v3.0 - Badge Component
 * Badge moderno para status, tags e indicadores
 */

import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  children,
}) => {
  // Estilos base
  const baseStyles = `
    inline-flex items-center gap-1.5
    font-medium rounded-full
    transition-all duration-200
  `;

  // Variantes
  const variants = {
    primary: 'bg-primary-100 text-primary-700 ring-1 ring-primary-200',
    success: 'bg-green-100 text-green-700 ring-1 ring-green-200',
    warning: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    error: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    info: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    neutral: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
  };

  // Tamanhos
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Dot colors
  const dotColors = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {dot && (
        <span 
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
