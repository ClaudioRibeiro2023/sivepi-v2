/**
 * Badge Component
 * Conforme ROADMAP.md - FASE 2.3
 */

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  return (
    <span
      className={clsx(
        // Base styles
        'inline-flex items-center font-medium rounded-full',
        
        // Variants
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-green-100 text-green-800': variant === 'success' || variant === 'low',
          'bg-yellow-100 text-yellow-800': variant === 'warning' || variant === 'medium',
          'bg-orange-100 text-orange-800': variant === 'high',
          'bg-red-100 text-red-800': variant === 'danger' || variant === 'critical',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
        
        // Sizes
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
          'px-3 py-1.5 text-base': size === 'lg',
        },
        
        className
      )}
    >
      {children}
    </span>
  );
}
