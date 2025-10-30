/**
 * App v3.0 - REDESIGN COMPLETO
 * Aplicação com Design System v3.0
 */

import { QueryProvider } from './shared/providers/QueryProvider';
import { AppProvider } from './contexts/AppContext';
import { RouterV3 } from './shared/router/RouterV3';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import './styles/global.css';

const AppV3 = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Global error:', error, errorInfo);
      }}
    >
      <QueryProvider>
        <AppProvider>
          <RouterV3 />
        </AppProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default AppV3;
