/**
 * App Component - SIVEPI V2
 * Conforme ROADMAP.md - FASE 4.3
 */

import { QueryProvider } from './shared/providers/QueryProvider';
import { AppProvider } from './contexts/AppContext';
import { Router } from './shared/router/Router';
import './styles/global.css';

const App = () => {
  return (
    <QueryProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </QueryProvider>
  );
};

export default App;
