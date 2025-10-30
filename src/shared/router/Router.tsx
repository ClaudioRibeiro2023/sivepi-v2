/**
 * Router Configuration
 * Conforme ROADMAP.md - FASE 4.1
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import { Layout } from '../components/Layout';

// Lazy loading dos módulos
const Dashboard = lazy(() => import('../../modules/DashboardCompleto'));
const PanoramaExecutivo = lazy(() => import('../../modules/PanoramaExecutivoCompleto'));
const VigilanciaEntomologica = lazy(() => import('../../modules/VigilanciaEntomologicaCompleta'));
const SistemaOperacional = lazy(() => import('../../modules/RespostaOperacional'));
const MapaInterativo = lazy(() => import('../../modules/WebMapaCompleto'));
const QualidadeDados = lazy(() => import('../../modules/QualidadeDados'));
const AnaliseSazonal = lazy(() => import('../../modules/AnaliseSazonal'));
const Relatorios = lazy(() => import('../../modules/Relatorios'));
const Configuracoes = lazy(() => import('../../modules/Configuracoes'));
const DesignSystemTest = lazy(() => import('../../modules/DesignSystemTest'));

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'webmapa',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <MapaInterativo />
          </Suspense>
        ),
      },
      {
        path: 'panorama',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PanoramaExecutivo />
          </Suspense>
        ),
      },
      {
        path: 'vigilancia',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <VigilanciaEntomologica />
          </Suspense>
        ),
      },
      {
        path: 'qualidade',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <QualidadeDados />
          </Suspense>
        ),
      },
      {
        path: 'sazonal',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AnaliseSazonal />
          </Suspense>
        ),
      },
      {
        path: 'resposta',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SistemaOperacional />
          </Suspense>
        ),
      },
      {
        path: 'relatorios',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Relatorios />
          </Suspense>
        ),
      },
      {
        path: 'configuracoes',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Configuracoes />
          </Suspense>
        ),
      },
      {
        path: 'design-system',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DesignSystemTest />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
