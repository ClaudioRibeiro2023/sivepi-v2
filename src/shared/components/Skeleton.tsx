/**
 * Skeleton Loader Components
 * Feedback visual durante carregamento
 * Sprint 3 - UX & Acessibilidade
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Carregando..."
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

/**
 * Skeleton para Cards
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
      <Skeleton width="60%" height="24px" className="mb-4" />
      <Skeleton width="100%" height="16px" className="mb-2" />
      <Skeleton width="80%" height="16px" className="mb-4" />
      <Skeleton width="40%" height="32px" />
    </div>
  );
};

/**
 * Skeleton para Tabela
 */
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} width={`${100 / columns}%`} height="20px" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="p-4 flex gap-4 border-t border-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              width={`${100 / columns}%`}
              height="16px"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton para Gráfico
 */
export const SkeletonChart: React.FC<{ height?: number; className?: string }> = ({
  height = 300,
  className = '',
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
      <Skeleton width="40%" height="24px" className="mb-6" />
      <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
        {[60, 80, 40, 90, 70, 85, 65, 75].map((h, i) => (
          <Skeleton
            key={i}
            width="12%"
            height={`${h}%`}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton para Lista
 */
export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({
  items = 5,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
          <Skeleton variant="circular" width="48px" height="48px" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton para Dashboard/Grid
 */
export const SkeletonDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Tabela */}
      <SkeletonTable />
    </div>
  );
};
