/**
 * Gráfico de Barras Interativo - Sprint 2
 * Com drill-down e tooltips avançados
 */

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { ArrowLeft } from 'lucide-react';

interface InteractiveBarChartProps {
  data: any[];
  bars: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  title: string;
  xAxisKey: string;
  yAxisLabel?: string;
  onBarClick?: (data: any) => void;
  drillDownData?: (item: any) => any[] | null;
}

export function InteractiveBarChart({
  data,
  bars,
  title,
  xAxisKey,
  yAxisLabel,
  onBarClick,
  drillDownData,
}: InteractiveBarChartProps) {
  const [drillDownStack, setDrillDownStack] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const currentData = drillDownStack.length > 0
    ? drillDownStack[drillDownStack.length - 1].data
    : data;

  const handleBarClick = (data: any, index: number) => {
    if (drillDownData) {
      const drillDown = drillDownData(data);
      if (drillDown && drillDown.length > 0) {
        setDrillDownStack([
          ...drillDownStack,
          { item: data, data: drillDown },
        ]);
      }
    }
    onBarClick?.(data);
  };

  const handleBack = () => {
    setDrillDownStack(drillDownStack.slice(0, -1));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">
          {payload[0].payload[xAxisKey]}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-gray-700">{entry.name}:</span>
            </div>
            <span className="font-bold" style={{ color: entry.fill }}>
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
        {drillDownData && (
          <p className="mt-2 text-xs text-blue-600">Clique para detalhar →</p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {drillDownStack.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft size={16} className="mr-1" />
                Voltar
              </Button>
            )}
            <CardTitle>
              {title}
              {drillDownStack.length > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  → {drillDownStack[drillDownStack.length - 1].item[xAxisKey]}
                </span>
              )}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey={xAxisKey}
              angle={-45}
              textAnchor="end"
              height={100}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              label={{
                value: yAxisLabel || '',
                angle: -90,
                position: 'insideLeft',
              }}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color}
                onClick={handleBarClick}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ cursor: drillDownData ? 'pointer' : 'default' }}
              >
                {currentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      activeIndex === index
                        ? adjustColor(bar.color, -20)
                        : bar.color
                    }
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Função auxiliar para ajustar cor no hover
function adjustColor(color: string, amount: number): string {
  // Implementação simplificada
  return color;
}
