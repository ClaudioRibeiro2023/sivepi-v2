/**
 * Hook useDebounce
 * Debounce para evitar execuções excessivas (ex: filtros, busca)
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Criar timer para atualizar valor debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpar timeout se value mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook useThrottle
 * Throttle para limitar frequência de execução
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastExecuted, setLastExecuted] = useState<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecuted = now - lastExecuted;

    if (timeSinceLastExecuted >= interval) {
      setThrottledValue(value);
      setLastExecuted(now);
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        setLastExecuted(Date.now());
      }, interval - timeSinceLastExecuted);

      return () => clearTimeout(timer);
    }
  }, [value, interval, lastExecuted]);

  return throttledValue;
}
