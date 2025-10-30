/**
 * Timeline Slider Component - Sprint 2
 * Slider temporal com play/pause e animação
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button } from './ui';
import { Play, Pause, SkipBack, SkipForward, Calendar } from 'lucide-react';

interface TimelineSliderProps {
  periods: string[]; // Array de períodos (ex: ['2024-01', '2024-02', ...])
  currentPeriod: string;
  onPeriodChange: (period: string) => void;
  playSpeed?: number; // ms entre cada mudança
  formatLabel?: (period: string) => string;
}

export function TimelineSlider({
  periods,
  currentPeriod,
  onPeriodChange,
  playSpeed = 1000,
  formatLabel = (p) => p,
}: TimelineSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(
    periods.indexOf(currentPeriod) || 0
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar index com currentPeriod
  useEffect(() => {
    const index = periods.indexOf(currentPeriod);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [currentPeriod, periods]);

  // Controle de play/pause
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= periods.length) {
            setIsPlaying(false);
            return 0; // Volta ao início
          }
          onPeriodChange(periods[next]);
          return next;
        });
      }, playSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playSpeed, periods, onPeriodChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setCurrentIndex(index);
    onPeriodChange(periods[index]);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    const prev = Math.max(0, currentIndex - 1);
    setCurrentIndex(prev);
    onPeriodChange(periods[prev]);
    setIsPlaying(false);
  };

  const handleNext = () => {
    const next = Math.min(periods.length - 1, currentIndex + 1);
    setCurrentIndex(next);
    onPeriodChange(periods[next]);
    setIsPlaying(false);
  };

  const handleSkipToStart = () => {
    setCurrentIndex(0);
    onPeriodChange(periods[0]);
    setIsPlaying(false);
  };

  const handleSkipToEnd = () => {
    setCurrentIndex(periods.length - 1);
    onPeriodChange(periods[periods.length - 1]);
    setIsPlaying(false);
  };

  const progress = ((currentIndex + 1) / periods.length) * 100;

  return (
    <Card className="border-2 border-[#0087A8]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header com período atual */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#0087A8]" />
              <span className="text-sm font-medium text-gray-600">
                Período Temporal
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#0087A8]">
                {formatLabel(periods[currentIndex])}
              </div>
              <div className="text-xs text-gray-500">
                {currentIndex + 1} de {periods.length}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={periods.length - 1}
              value={currentIndex}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #0087A8 0%, #0087A8 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
              }}
            />
            {/* Marcadores no slider */}
            <div className="flex justify-between mt-1">
              {periods.map((period, idx) => {
                if (idx % Math.ceil(periods.length / 10) === 0 || idx === periods.length - 1) {
                  return (
                    <div
                      key={idx}
                      className="text-xs text-gray-400"
                      style={{ width: '40px', textAlign: 'center' }}
                    >
                      {formatLabel(period).substring(0, 7)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipToStart}
              disabled={currentIndex === 0}
              title="Ir para o início"
            >
              <SkipBack size={16} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              title="Anterior"
            >
              <SkipBack size={16} className="rotate-180" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handlePlayPause}
              className="px-6"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === periods.length - 1}
              title="Próximo"
            >
              <SkipForward size={16} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipToEnd}
              disabled={currentIndex === periods.length - 1}
              title="Ir para o fim"
            >
              <SkipForward size={16} className="rotate-180" />
            </Button>
          </div>

          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-[#0087A8] h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
