/**
 * App Component - SIVEPI V2
 * Conforme ROADMAP.md - FASE 4.3
 */

import { QueryProvider } from './shared/providers/QueryProvider';
import { AppProvider } from './contexts/AppContext';
import { Router } from './shared/router/Router';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import './styles/global.css';

const App = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Aqui poderia integrar com Sentry, LogRocket, etc
        console.error('Global error:', error, errorInfo);
      }}
    >
      <QueryProvider>
        <AppProvider>
          <Router />
        </AppProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
