/**
 * Componente de Card de Indicador
 * Exibe indicadores epidemiológicos de forma visual
 */

import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, Badge } from './ui';
import { LucideIcon } from 'lucide-react';

interface IndicadorCardProps {
  titulo: string;
  valor: number | string;
  subtitulo?: string;
  icone?: LucideIcon;
  cor?: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray';
  risco?: 'baixo' | 'medio' | 'alto' | 'critico';
  formato?: 'numero' | 'percentual' | 'decimal';
  descricao?: string;
}

export const IndicadorCard = React.memo(function IndicadorCard({
  titulo,
  valor,
  subtitulo,
  icone: Icone,
  cor = 'blue',
  risco,
  formato = 'numero',
  descricao,
}: IndicadorCardProps) {
  const coresCard = {
    blue: 'border-blue-300 bg-blue-50',
    green: 'border-green-300 bg-green-50',
    yellow: 'border-yellow-300 bg-yellow-50',
    orange: 'border-orange-300 bg-orange-50',
    red: 'border-red-300 bg-red-50',
    gray: 'border-gray-300 bg-gray-50',
  };

  const coresTexto = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    yellow: 'text-yellow-800',
    orange: 'text-orange-800',
    red: 'text-red-800',
    gray: 'text-gray-800',
  };

  const coresIcone = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
    gray: 'text-gray-400',
  };

  const formatarValor = useCallback((v: number | string): string => {
    if (typeof v === 'string') return v;
    
    if (formato === 'percentual') {
      return `${v.toFixed(2)}%`;
    } else if (formato === 'decimal') {
      return v.toFixed(2);
    } else {
      return v.toLocaleString('pt-BR');
    }
  }, [formato]);

  const riscoBadge = useMemo(() => {
    if (!risco) return null;
    
    const variants = {
      baixo: 'low',
      medio: 'medium',
      alto: 'high',
      critico: 'critical',
    } as const;

    return (
      <Badge variant={variants[risco]} size="sm" className="mt-2">
        Risco {risco.charAt(0).toUpperCase() + risco.slice(1)}
      </Badge>
    );
  }, [risco]);

  return (
    <Card className={`border-2 ${coresCard[cor]}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium ${coresTexto[cor]} opacity-90`}>
              {titulo}
            </p>
            <p className={`text-3xl font-bold mt-2 ${coresTexto[cor]}`}>
              {formatarValor(valor)}
            </p>
            {subtitulo && (
              <p className={`text-sm mt-2 ${coresTexto[cor]} opacity-75`}>
                {subtitulo}
              </p>
            )}
            {descricao && (
              <p className="text-xs mt-2 text-gray-600">
                {descricao}
              </p>
            )}
            {riscoBadge}
          </div>
          {Icone && (
            <div className={coresIcone[cor]}>
              <Icone size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
