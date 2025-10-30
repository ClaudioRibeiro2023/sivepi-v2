import React from 'react';
import { Activity } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '24px'
      }}
    >
      <div style={{ position: 'relative' }}>
        <Activity size={48} color="#0087A8" style={{ animation: 'spin 2s linear infinite' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', margin: 0, marginBottom: '8px', color: '#0087A8' }}>
          Carregando SIVEPI
        </h2>
        <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
          Aguarde enquanto preparamos os dados...
        </p>
      </div>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
