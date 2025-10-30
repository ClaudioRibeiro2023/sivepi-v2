/**
 * Gráfico de Linha Interativo - Sprint 2
 * Com drill-down, zoom, tooltips avançados
 */

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../ui';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface InteractiveLineChartProps {
  data: any[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }[];
  title: string;
  xAxisKey: string;
  yAxisLabel?: string;
  showBrush?: boolean;
  showGrid?: boolean;
  onPointClick?: (data: any) => void;
  referenceLines?: {
    y?: number;
    label?: string;
    color?: string;
  }[];
}

export function InteractiveLineChart({
  data,
  lines,
  title,
  xAxisKey,
  yAxisLabel,
  showBrush = true,
  showGrid = true,
  onPointClick,
  referenceLines = [],
}: InteractiveLineChartProps) {
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.name}:</span>
            <span className="font-bold" style={{ color: entry.color }}>
              {typeof entry.value === 'number'
                ? entry.value.toFixed(2)
                : entry.value}
            </span>
          </div>
        ))}
        {onPointClick && (
          <button
            onClick={() => onPointClick(payload[0].payload)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Ver detalhes →
          </button>
        )}
      </div>
    );
  };

  const handleZoomIn = () => {
    if (!zoomDomain) {
      const mid = Math.floor(data.length / 2);
      const quarter = Math.floor(data.length / 4);
      setZoomDomain([mid - quarter, mid + quarter]);
    } else {
      const [start, end] = zoomDomain;
      const range = end - start;
      const newRange = Math.max(Math.floor(range * 0.7), 2);
      const mid = Math.floor((start + end) / 2);
      setZoomDomain([
        Math.max(0, mid - Math.floor(newRange / 2)),
        Math.min(data.length - 1, mid + Math.floor(newRange / 2)),
      ]);
    }
  };

  const handleZoomOut = () => {
    if (!zoomDomain) return;
    
    const [start, end] = zoomDomain;
    const range = end - start;
    const newRange = Math.min(Math.floor(range * 1.5), data.length);
    const mid = Math.floor((start + end) / 2);
    const newStart = Math.max(0, mid - Math.floor(newRange / 2));
    const newEnd = Math.min(data.length - 1, mid + Math.floor(newRange / 2));
    
    if (newStart === 0 && newEnd === data.length - 1) {
      setZoomDomain(null);
    } else {
      setZoomDomain([newStart, newEnd]);
    }
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

  const displayData = zoomDomain
    ? data.slice(zoomDomain[0], zoomDomain[1] + 1)
    : data;

  const chartHeight = isFullscreen ? 600 : 400;

  return (
    <Card className={isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {zoomDomain && (
              <Badge variant="medium" size="sm" className="mt-2">
                Zoom ativo ({zoomDomain[1] - zoomDomain[0] + 1} pontos)
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={!zoomDomain}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </Button>
            {zoomDomain && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetZoom}
              >
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Fullscreen"
            >
              <Maximize2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={displayData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
            <XAxis
              dataKey={xAxisKey}
              angle={-45}
              textAnchor="end"
              height={80}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              label={{
                value: yAxisLabel || '',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '14px' },
              }}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              onClick={(e) => console.log('Legend clicked:', e)}
            />
            
            {/* Reference Lines */}
            {referenceLines.map((line, idx) => (
              <ReferenceLine
                key={idx}
                y={line.y}
                stroke={line.color || '#ef4444'}
                strokeDasharray="5 5"
                label={{
                  value: line.label || '',
                  position: 'right',
                  style: { fontSize: '12px', fill: line.color || '#ef4444' },
                }}
              />
            ))}

            {/* Lines */}
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{
                  r: 6,
                  onClick: (_: any, payload: any) => onPointClick?.(payload.payload),
                  style: { cursor: onPointClick ? 'pointer' : 'default' },
                }}
              />
            ))}

            {/* Brush para navegação */}
            {showBrush && !zoomDomain && (
              <Brush
                dataKey={xAxisKey}
                height={30}
                stroke="#0087A8"
                onChange={(e: any) => {
                  if (e.startIndex !== undefined && e.endIndex !== undefined) {
                    setZoomDomain([e.startIndex, e.endIndex]);
                  }
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Estatísticas do período visível */}
        <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {lines.map((line) => {
            const values = displayData
              .map((d) => d[line.dataKey])
              .filter((v) => typeof v === 'number');
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = sum / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);

            return (
              <div key={line.dataKey} className="text-center">
                <p className="text-xs text-gray-600 mb-1">{line.name}</p>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-gray-500">Média:</span>{' '}
                    <span className="font-bold" style={{ color: line.color }}>
                      {avg.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Min/Max:</span>{' '}
                    <span className="font-bold" style={{ color: line.color }}>
                      {min.toFixed(0)} / {max.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
