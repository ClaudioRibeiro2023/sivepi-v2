import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppV3'; // ✅ v3.0 ATIVADO!
import 'mapbox-gl/dist/mapbox-gl.css';

// Renderiza a aplicação v3.0 - Design System Moderno
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
