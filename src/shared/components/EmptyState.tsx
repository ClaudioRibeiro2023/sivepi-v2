/**
 * Empty State Component
 * Exibe mensagem quando não há dados
 * Sprint 3 - UX & Acessibilidade
 */

import React from 'react';
import { LucideIcon, Database, Search, AlertCircle, Inbox, FileQuestion } from 'lucide-react';
import { Button, Card, CardContent } from './ui';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'error' | 'no-data';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className = '',
}) => {
  // Ícone padrão por variante
  const getDefaultIcon = (): LucideIcon => {
    switch (variant) {
      case 'search':
        return Search;
      case 'error':
        return AlertCircle;
      case 'no-data':
        return Database;
      default:
        return Inbox;
    }
  };

  const FinalIcon = Icon || getDefaultIcon();

  // Cores por variante
  const colors = {
    default: {
      bg: 'bg-gray-100',
      icon: 'text-gray-400',
      title: 'text-gray-900',
      desc: 'text-gray-600',
    },
    search: {
      bg: 'bg-blue-100',
      icon: 'text-blue-400',
      title: 'text-blue-900',
      desc: 'text-blue-700',
    },
    error: {
      bg: 'bg-red-100',
      icon: 'text-red-400',
      title: 'text-red-900',
      desc: 'text-red-700',
    },
    'no-data': {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-400',
      title: 'text-yellow-900',
      desc: 'text-yellow-700',
    },
  };

  const currentColors = colors[variant];

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center max-w-md">
        {/* Ícone */}
        <div className={`w-16 h-16 ${currentColors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <FinalIcon className={`w-8 h-8 ${currentColors.icon}`} />
        </div>

        {/* Título */}
        <h3 className={`text-xl font-semibold mb-2 ${currentColors.title}`}>
          {title}
        </h3>

        {/* Descrição */}
        {description && (
          <p className={`text-sm mb-6 ${currentColors.desc}`}>
            {description}
          </p>
        )}

        {/* Ação */}
        {action && (
          <Button onClick={action.onClick} variant="primary">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Empty State para Listas/Tabelas
 */
export const EmptyList: React.FC<{
  title?: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}> = ({
  title = 'Nenhum registro encontrado',
  description = 'Não há dados para exibir no momento.',
  onAdd,
  addLabel = 'Adicionar',
}) => {
  return (
    <EmptyState
      icon={Database}
      title={title}
      description={description}
      action={onAdd ? { label: addLabel, onClick: onAdd } : undefined}
      variant="no-data"
    />
  );
};

/**
 * Empty State para Busca sem resultados
 */
export const EmptySearch: React.FC<{
  searchTerm?: string;
  onClear?: () => void;
}> = ({ searchTerm, onClear }) => {
  return (
    <EmptyState
      icon={Search}
      title="Nenhum resultado encontrado"
      description={
        searchTerm
          ? `Nenhum resultado para "${searchTerm}". Tente ajustar sua busca.`
          : 'Nenhum resultado encontrado. Tente ajustar os filtros.'
      }
      action={onClear ? { label: 'Limpar Filtros', onClick: onClear } : undefined}
      variant="search"
    />
  );
};

/**
 * Empty State para Erros
 */
export const EmptyError: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({
  title = 'Erro ao carregar dados',
  description = 'Ocorreu um erro ao carregar os dados. Tente novamente.',
  onRetry,
}) => {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={onRetry ? { label: 'Tentar Novamente', onClick: onRetry } : undefined}
      variant="error"
    />
  );
};

/**
 * Empty State para Cards
 */
export const EmptyCard: React.FC<{
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ title, description, icon, action }) => {
  return (
    <Card>
      <CardContent className="py-12">
        <EmptyState
          icon={icon || FileQuestion}
          title={title}
          description={description}
          action={action}
        />
      </CardContent>
    </Card>
  );
};
