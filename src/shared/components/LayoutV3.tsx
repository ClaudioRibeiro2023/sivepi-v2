/**
 * Layout v3.0 - REDESIGN COMPLETO
 * Navegação moderna com microinterações + Dark Mode + Mobile
 */

import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  BarChart3, 
  Bug, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  FileText,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { Badge } from '../../design-system/components/Badge/Badge';
import { useDarkMode } from '../hooks/useDarkMode';

export function LayoutV3() {
  const location = useLocation();
  const { isDark, toggle } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: 'Visão Geral', 
      path: '/dashboard-v3', 
      icon: Home,
      badge: null,
    },
    { 
      name: 'Mapa Interativo', 
      path: '/webmapa', 
      icon: Map,
      badge: null,
    },
    { 
      name: 'Panorama Executivo', 
      path: '/panorama', 
      icon: BarChart3,
      badge: null,
    },
    { 
      name: 'Vigilância', 
      path: '/vigilancia', 
      icon: Bug,
      badge: { text: 'Novo', variant: 'success' as const },
    },
    { 
      name: 'Qualidade', 
      path: '/qualidade', 
      icon: CheckCircle,
      badge: null,
    },
    { 
      name: 'Análise Sazonal', 
      path: '/sazonal', 
      icon: TrendingUp,
      badge: null,
    },
    { 
      name: 'Resposta', 
      path: '/resposta', 
      icon: Shield,
      badge: null,
    },
    { 
      name: 'Relatórios', 
      path: '/relatorios', 
      icon: FileText,
      badge: null,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-xl shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl
        lg:relative fixed inset-y-0 left-0 z-40
        transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-2xl font-bold">SI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">SIVEPI</h1>
              <p className="text-xs text-gray-400">Versão 3.0</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group relative flex items-center justify-between px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    size={20} 
                    className={`
                      transition-transform duration-200
                      ${active ? 'scale-110' : 'group-hover:scale-105'}
                    `}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                
                {item.badge && (
                  <Badge variant={item.badge.variant} size="sm">
                    {item.badge.text}
                  </Badge>
                )}
                
                {active && (
                  <ChevronRight 
                    size={16} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 space-y-3">
          <Link
            to="/configuracoes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
          >
            <Settings size={20} />
            <span className="font-medium text-sm">Configurações</span>
          </Link>
          
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 text-center">
              © 2025 SIVEPI • Montes Claros/MG
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(n => n.path === location.pathname)?.name || 'SIVEPI'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggle}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? (
                  <Sun size={20} className="text-gray-600" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors hidden sm:block">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              {/* Avatar */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Usuário</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
