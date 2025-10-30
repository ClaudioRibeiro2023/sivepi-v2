import React from 'react';
import { useApp } from '../contexts/AppContext';

const Relatorios: React.FC = () => {
  const { data } = useApp();

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Relatórios
      </h1>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '18px', color: '#6c757d', marginBottom: '16px' }}>
          Módulo em desenvolvimento
        </p>
        <p style={{ color: '#6c757d' }}>
          Este módulo conterá geração de relatórios técnicos, exportação de dados e dashboards customizáveis.
        </p>
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#0087A8' }}>
          {data.length} registros disponíveis para relatórios
        </p>
      </div>
    </div>
  );
};

export default Relatorios;
