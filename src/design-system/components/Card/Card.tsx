/**
 * Design System v3.0 - Card Component
 * Card moderno com glassmorphism, variantes e hover effects
 */

import React from 'react';

export interface CardProps {
  variant?: 'default' | 'glass' | 'gradient' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className = '',
  children,
  onClick,
}) => {
  // Estilos base
  const baseStyles = `
    rounded-xl
    transition-all duration-300
    ${clickable || onClick ? 'cursor-pointer' : ''}
  `;

  // Variantes
  const variants = {
    default: `
      bg-white
      shadow-lg
      hover:shadow-xl
      border border-gray-100
      ${hoverable ? 'hover:-translate-y-1' : ''}
    `,
    glass: `
      bg-white/80
      backdrop-blur-xl
      shadow-2xl
      border border-white/20
      ring-1 ring-gray-900/5
      ${hoverable ? 'hover:scale-[1.02]' : ''}
    `,
    gradient: `
      bg-gradient-to-br from-primary-400 to-primary-600
      shadow-lg shadow-primary-500/30
      text-white
      ${hoverable ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/40' : ''}
    `,
    bordered: `
      bg-white
      border-2 border-gray-200
      hover:border-primary-400
      ${hoverable ? 'hover:-translate-y-1 hover:shadow-md' : ''}
    `,
  };

  // Padding
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Sub-componentes
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={className}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>{children}</div>
);
