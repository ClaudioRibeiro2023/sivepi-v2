import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import {
  BarChart3,
  Map,
  Activity,
  Truck,
  FileText,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  Home
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { preferences, setPreferences, stats } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/panorama', label: 'Panorama Executivo', icon: BarChart3 },
    { path: '/vigilancia', label: 'Vigilância Entomológica', icon: Activity },
    { path: '/operacional', label: 'Sistema Operacional', icon: Truck },
    { path: '/mapa', label: 'Mapa Interativo', icon: Map },
    { path: '/relatorios', label: 'Relatórios', icon: FileText },
    { path: '/configuracoes', label: 'Configurações', icon: Settings }
  ];

  const toggleDarkMode = () => {
    setPreferences({ darkMode: !preferences.darkMode });
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '70px',
          backgroundColor: preferences.darkMode ? '#262832' : '#ffffff',
          borderRight: `1px solid ${preferences.darkMode ? '#404040' : '#e0e0e0'}`,
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000
        }}
      >
        {/* Header da Sidebar */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${preferences.darkMode ? '#404040' : '#e0e0e0'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {sidebarOpen && (
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0087A8', margin: 0 }}>
                  SIVEPI
                </h1>
                <p style={{ fontSize: '11px', color: preferences.darkMode ? '#b0b0b0' : '#6c757d', margin: 0 }}>
                  Montes Claros/MG
                </p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  padding: sidebarOpen ? '12px 20px' : '12px',
                  border: 'none',
                  background: isActive ? '#0087A820' : 'transparent',
                  borderLeft: isActive ? '3px solid #0087A8' : '3px solid transparent',
                  color: isActive ? '#0087A8' : preferences.darkMode ? '#b0b0b0' : '#6c757d',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer da Sidebar */}
        {sidebarOpen && (
          <div style={{ padding: '16px', borderTop: `1px solid ${preferences.darkMode ? '#404040' : '#e0e0e0'}` }}>
            <div style={{ fontSize: '11px', color: preferences.darkMode ? '#b0b0b0' : '#6c757d' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>{stats.totalRegistros.toLocaleString('pt-BR')}</strong> registros
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>{stats.ovitrampasUnicas}</strong> ovitrampas
              </div>
              <div>
                <strong>{stats.bairrosUnicos}</strong> bairros
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Conteúdo Principal */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '260px' : '70px',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        {/* Header Principal */}
        <header
          style={{
            height: '70px',
            borderBottom: `1px solid ${preferences.darkMode ? '#404040' : '#e0e0e0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            backgroundColor: preferences.darkMode ? '#2d2d2d' : '#ffffff',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', margin: 0, fontWeight: '600' }}>
              {menuItems.find(item => item.path === location.pathname)?.label || 'SIVEPI'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                background: 'none',
                border: `1px solid ${preferences.darkMode ? '#404040' : '#e0e0e0'}`,
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              {preferences.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Conteúdo das Páginas */}
        <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
