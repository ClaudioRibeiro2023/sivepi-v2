/**
 * Router v3.0 - REDESIGN COMPLETO
 * Configuração de rotas com Layout e Dashboard modernos
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import { LayoutV3 } from '../components/LayoutV3';

// Lazy loading dos módulos
const DashboardV3 = lazy(() => import('../../modules/DashboardV3'));
const PanoramaExecutivo = lazy(() => import('../../modules/PanoramaExecutivoV3'));
const VigilanciaEntomologica = lazy(() => import('../../modules/VigilanciaEntomologicaCompleta'));
const SistemaOperacional = lazy(() => import('../../modules/RespostaOperacional'));
const MapaInterativo = lazy(() => import('../../modules/WebMapaCompleto'));
const QualidadeDados = lazy(() => import('../../modules/QualidadeDados'));
const AnaliseSazonal = lazy(() => import('../../modules/AnaliseSazonal'));
const Relatorios = lazy(() => import('../../modules/Relatorios'));
const Configuracoes = lazy(() => import('../../modules/Configuracoes'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutV3 />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard-v3" replace />,
      },
      {
        path: 'dashboard-v3',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboardV3 />
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
        path: '*',
        element: <Navigate to="/dashboard-v3" replace />,
      },
    ],
  },
]);

export function RouterV3() {
  return <RouterProvider router={router} />;
}
