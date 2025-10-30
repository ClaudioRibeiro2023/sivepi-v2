/**
 * FilterPanel Component
 * Sistema de filtros avançados reutilizável
 */

import { useMemo } from 'react';
import { Card, CardContent, Button } from './ui';
import { Filter, X, Calendar, MapPin } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';

interface FilterPanelProps {
  data: any[];
  onFilterChange?: () => void;
  showBairroFilter?: boolean;
  showPeriodFilter?: boolean;
  showWeekFilter?: boolean;
  showOvosRangeFilter?: boolean;
}

export function FilterPanel({
  data,
  onFilterChange,
  showBairroFilter = true,
  showPeriodFilter = true,
  showWeekFilter = true,
  showOvosRangeFilter = false,
}: FilterPanelProps) {
  const { filters, setFilters, clearFilters } = useDataStore();

  // Extrair valores únicos dos dados
  const { years, months, weeks, bairros } = useMemo(() => {
    const yearsSet = new Set<string>();
    const monthsSet = new Set<string>();
    const weeksSet = new Set<number>();
    const bairrosSet = new Set<string>();

    data.forEach((record) => {
      if (record.ano) yearsSet.add(String(record.ano));
      if (record.mes) monthsSet.add(String(record.mes));
      if (record.semana_epidemiologica) weeksSet.add(record.semana_epidemiologica);
      if (record.bairro) bairrosSet.add(record.bairro);
    });

    return {
      years: Array.from(yearsSet).sort((a, b) => Number(b) - Number(a)),
      months: Array.from(monthsSet).sort((a, b) => Number(a) - Number(b)),
      weeks: Array.from(weeksSet).sort((a, b) => a - b),
      bairros: Array.from(bairrosSet).sort(),
    };
  }, [data]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value });
    onFilterChange?.();
  };

  const handleClearFilters = () => {
    clearFilters();
    onFilterChange?.();
  };

  const hasActiveFilters = filters.year || filters.month || filters.week || filters.bairro || 
                           filters.ovosMin !== undefined || filters.ovosMax !== undefined;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[#0087A8]" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X size={16} className="mr-1" />
              Limpar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro de Ano */}
          {showPeriodFilter && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Ano
              </label>
              <select
                value={filters.year || ''}
                onChange={(e) => handleFilterChange('year', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0087A8] bg-white"
              >
                <option value="">Todos os anos</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro de Mês */}
          {showPeriodFilter && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Mês
              </label>
              <select
                value={filters.month || ''}
                onChange={(e) => handleFilterChange('month', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0087A8] bg-white"
              >
                <option value="">Todos os meses</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {monthNames[Number(month) - 1] || `Mês ${month}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro de Semana Epidemiológica */}
          {showWeekFilter && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Semana Epidemiológica
              </label>
              <select
                value={filters.week || ''}
                onChange={(e) => handleFilterChange('week', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0087A8] bg-white"
              >
                <option value="">Todas as semanas</option>
                {weeks.map((week) => (
                  <option key={week} value={week}>
                    Semana {week}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro de Bairro */}
          {showBairroFilter && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} />
                Bairro
              </label>
              <select
                value={filters.bairro || ''}
                onChange={(e) => handleFilterChange('bairro', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0087A8] bg-white"
              >
                <option value="">Todos os bairros</option>
                {bairros.map((bairro) => (
                  <option key={bairro} value={bairro}>
                    {bairro}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro de Faixa de Ovos */}
          {showOvosRangeFilter && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ovos Mínimo
                </label>
                <input
                  type="number"
                  value={filters.ovosMin ?? ''}
                  onChange={(e) => handleFilterChange('ovosMin', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0087A8]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ovos Máximo
                </label>
                <input
                  type="number"
                  value={filters.ovosMax ?? ''}
                  onChange={(e) => handleFilterChange('ovosMax', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="999999"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0087A8]"
                />
              </div>
            </>
          )}
        </div>

        {/* Indicador de filtros ativos */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {filters.year && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Ano: {filters.year}
                </span>
              )}
              {filters.month && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Mês: {monthNames[Number(filters.month) - 1]}
                </span>
              )}
              {filters.week && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Semana: {filters.week}
                </span>
              )}
              {filters.bairro && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Bairro: {filters.bairro}
                </span>
              )}
              {(filters.ovosMin !== undefined || filters.ovosMax !== undefined) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Ovos: {filters.ovosMin ?? 0} - {filters.ovosMax ?? '∞'}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
