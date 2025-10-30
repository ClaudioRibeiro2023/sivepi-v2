import React from 'react';
import { useApp } from '../contexts/AppContext';

const Configuracoes: React.FC = () => {
  const { preferences, setPreferences } = useApp();

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Configurações
      </h1>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '32px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Preferências do Sistema</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={preferences.darkMode}
              onChange={(e) => setPreferences({ darkMode: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
            <span>Modo Escuro</span>
          </label>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={preferences.explainMode}
              onChange={(e) => setPreferences({ explainMode: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
            <span>Modo Explicativo (simplifica termos técnicos)</span>
          </label>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences({ notifications: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
            <span>Notificações</span>
          </label>
        </div>

        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
            <strong>Versão:</strong> 2.0.0<br />
            <strong>Sistema:</strong> SIVEPI - Sistema Integrado de Vigilância Epidemiológica<br />
            <strong>Município:</strong> Montes Claros/MG
          </p>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
