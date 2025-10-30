/**
 * Layout Component
 * Conforme ROADMAP.md - FASE 4.2
 */

import { Outlet, Link, useLocation } from 'react-router-dom';
import { Map, BarChart3, Bug, Shield, Home, FileText, Settings, Palette, CheckCircle, TrendingUp } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'WebMapa', path: '/webmapa', icon: Map },
    { name: 'Panorama', path: '/panorama', icon: BarChart3 },
    { name: 'Vigilância', path: '/vigilancia', icon: Bug },
    { name: 'Qualidade', path: '/qualidade', icon: CheckCircle },
    { name: 'Sazonal', path: '/sazonal', icon: TrendingUp },
    { name: 'Resposta', path: '/resposta', icon: Shield },
    { name: 'Relatórios', path: '/relatorios', icon: FileText },
    { name: 'Configurações', path: '/configuracoes', icon: Settings },
    { name: 'Design System', path: '/design-system', icon: Palette },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#262832] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-[#0087A8]">SIVEPI</h1>
          <p className="text-sm text-gray-400 mt-1">Versão 2.0</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive(item.path)
                  ? 'bg-[#0087A8] text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            © 2025 SIVEPI - Montes Claros/MG
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
