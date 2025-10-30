/**
 * Vigilância Entomológica - FASE 7
 * Cálculo de IPO, análise por bairros e sistema de alertas
 */

import { useMemo, useState } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../shared/components/ui';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import {
  Bug,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertOctagon,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface BairroAnalysis {
  bairro: string;
  totalOvitrampas: number;
  positivas: number;
  ipo: number;
  totalOvos: number;
  mediaOvos: number;
  risco: 'baixo' | 'medio' | 'alto' | 'critico';
}

export default function VigilanciaEntomologicaCompleta() {
  const { data, isLoading, error } = useOvitrapData();
  const [sortBy, setSortBy] = useState<'ipo' | 'ovos' | 'bairro'>('ipo');

  // Cálculo global de IPO
  const ipoGlobal = useMemo(() => {
    const total = data.length;
    const positivas = data.filter((r) => r.quantidade_ovos > 0).length;
    const ipo = total > 0 ? (positivas / total) * 100 : 0;

    return {
      total,
      positivas,
      negativas: total - positivas,
      ipo: ipo.toFixed(2),
      risco:
        ipo < 1 ? 'baixo' : ipo < 5 ? 'medio' : ipo < 10 ? 'alto' : 'critico',
    };
  }, [data]);

  // Análise por bairro
  const bairrosAnalysis = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      const bairro = r.bairro || 'Não Informado';
      if (!acc[bairro]) {
        acc[bairro] = {
          bairro,
          total: 0,
          positivas: 0,
          totalOvos: 0,
        };
      }
      acc[bairro].total += 1;
      if (r.quantidade_ovos > 0) acc[bairro].positivas += 1;
      acc[bairro].totalOvos += r.quantidade_ovos || 0;
      return acc;
    }, {} as Record<string, any>);

    const analysis: BairroAnalysis[] = Object.values(grouped).map((item: any) => {
      const ipo = item.total > 0 ? (item.positivas / item.total) * 100 : 0;
      const mediaOvos = item.total > 0 ? item.totalOvos / item.total : 0;

      return {
        bairro: item.bairro,
        totalOvitrampas: item.total,
        positivas: item.positivas,
        ipo: parseFloat(ipo.toFixed(2)),
        totalOvos: item.totalOvos,
        mediaOvos: parseFloat(mediaOvos.toFixed(1)),
        risco:
          ipo < 1
            ? 'baixo'
            : ipo < 5
            ? 'medio'
            : ipo < 10
            ? 'alto'
            : 'critico',
      };
    });

    // Ordenar
    return analysis.sort((a, b) => {
      if (sortBy === 'ipo') return b.ipo - a.ipo;
      if (sortBy === 'ovos') return b.totalOvos - a.totalOvos;
      return a.bairro.localeCompare(b.bairro);
    });
  }, [data, sortBy]);

  // Alertas
  const alertas = useMemo(() => {
    const criticos = bairrosAnalysis.filter((b) => b.risco === 'critico');
    const altos = bairrosAnalysis.filter((b) => b.risco === 'alto');
    const ipoAlto = ipoGlobal.ipo > '5';

    return {
      criticos,
      altos,
      ipoAlto,
      total: criticos.length + altos.length + (ipoAlto ? 1 : 0),
    };
  }, [bairrosAnalysis, ipoGlobal]);

  // Estatísticas por nível de risco
  const riskStats = useMemo(() => {
    return {
      baixo: bairrosAnalysis.filter((b) => b.risco === 'baixo').length,
      medio: bairrosAnalysis.filter((b) => b.risco === 'medio').length,
      alto: bairrosAnalysis.filter((b) => b.risco === 'alto').length,
      critico: bairrosAnalysis.filter((b) => b.risco === 'critico').length,
    };
  }, [bairrosAnalysis]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="p-8 text-center">
        <Badge variant="danger">Erro ao carregar dados</Badge>
        <p className="mt-4 text-gray-600">{error.message}</p>
      </div>
    );
  }

  const getRiskColor = (risco: string) => {
    switch (risco) {
      case 'baixo':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'alto':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critico':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskBadge = (risco: string) => {
    const variants = {
      baixo: 'low',
      medio: 'medium',
      alto: 'high',
      critico: 'critical',
    } as const;
    return variants[risco as keyof typeof variants] || 'low';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Bug className="text-red-600" size={32} />
          Vigilância Entomológica
        </h1>
        <p className="text-gray-600 mt-2">
          Análise de IPO e monitoramento de áreas de risco
        </p>
      </div>

      {/* Alertas */}
      {alertas.total > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertOctagon className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-2">
                  {alertas.total} Alerta{alertas.total > 1 ? 's' : ''} Ativo
                  {alertas.total > 1 ? 's' : ''}
                </h3>
                <ul className="space-y-1 text-sm text-red-800">
                  {alertas.ipoAlto && (
                    <li>
                      • IPO Global acima de 5% ({ipoGlobal.ipo}%) - Atenção
                      redobrada necessária
                    </li>
                  )}
                  {alertas.criticos.length > 0 && (
                    <li>
                      • {alertas.criticos.length} bairro(s) em situação crítica
                      (IPO ≥ 10%)
                    </li>
                  )}
                  {alertas.altos.length > 0 && (
                    <li>
                      • {alertas.altos.length} bairro(s) em alto risco (IPO 5-10%)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* IPO Global */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={getRiskColor(ipoGlobal.risco)}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">IPO Global</p>
                <p className="text-4xl font-bold mt-2">{ipoGlobal.ipo}%</p>
              </div>
              <TrendingUp size={40} className="opacity-50" />
            </div>
            <div className="mt-4">
              <Badge variant={getRiskBadge(ipoGlobal.risco)}>
                Risco {ipoGlobal.risco.charAt(0).toUpperCase() + ipoGlobal.risco.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ovitrampas Positivas
                </p>
                <p className="text-4xl font-bold text-red-600 mt-2">
                  {ipoGlobal.positivas}
                </p>
              </div>
              <CheckCircle size={40} className="text-red-200" />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              de {ipoGlobal.total} ovitrampas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ovitrampas Negativas
                </p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {ipoGlobal.negativas}
                </p>
              </div>
              <XCircle size={40} className="text-green-200" />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {((ipoGlobal.negativas / ipoGlobal.total) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bairros</p>
                <p className="text-4xl font-bold text-[#0087A8] mt-2">
                  {bairrosAnalysis.length}
                </p>
              </div>
              <MapPin size={40} className="text-blue-200" />
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="critical" size="sm">
                {riskStats.critico}
              </Badge>
              <Badge variant="high" size="sm">
                {riskStats.alto}
              </Badge>
              <Badge variant="medium" size="sm">
                {riskStats.medio}
              </Badge>
              <Badge variant="low" size="sm">
                {riskStats.baixo}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Ordenação */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'ipo' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSortBy('ipo')}
              >
                IPO (maior)
              </Button>
              <Button
                variant={sortBy === 'ovos' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSortBy('ovos')}
              >
                Total Ovos
              </Button>
              <Button
                variant={sortBy === 'bairro' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSortBy('bairro')}
              >
                Nome (A-Z)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Bairros */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada por Bairro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Bairro
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    IPO (%)
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Risco
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Positivas
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Total Ovos
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Média Ovos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bairrosAnalysis.map((bairro, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 ${
                      bairro.risco === 'critico' || bairro.risco === 'alto'
                        ? 'bg-red-50'
                        : ''
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-900">
                      {bairro.bairro}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-lg">{bairro.ipo}%</span>
                        {bairro.ipo >= 5 && (
                          <ArrowUp className="text-red-500" size={16} />
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={getRiskBadge(bairro.risco)} size="sm">
                        {bairro.risco.charAt(0).toUpperCase() +
                          bairro.risco.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-3 text-center font-semibold text-red-600">
                      {bairro.positivas}
                    </td>
                    <td className="p-3 text-center text-gray-600">
                      {bairro.totalOvitrampas}
                    </td>
                    <td className="p-3 text-center font-semibold text-orange-600">
                      {bairro.totalOvos.toLocaleString()}
                    </td>
                    <td className="p-3 text-center text-gray-700">
                      {bairro.mediaOvos}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legenda e Interpretação */}
      <Card>
        <CardHeader>
          <CardTitle>Interpretação do IPO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="text-gray-700">
              <strong>IPO (Índice de Positividade de Ovitrampas)</strong>: Percentual
              de ovitrampas com presença de ovos em relação ao total de armadilhas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
                <div>
                  <p className="font-semibold text-green-900">IPO {'<'} 1%</p>
                  <p className="text-green-700 text-xs">
                    Situação satisfatória - Manter monitoramento de rotina
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1" />
                <div>
                  <p className="font-semibold text-yellow-900">IPO 1-5%</p>
                  <p className="text-yellow-700 text-xs">
                    Alerta - Intensificar ações de controle
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-3 h-3 rounded-full bg-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-orange-900">IPO 5-10%</p>
                  <p className="text-orange-700 text-xs">
                    Alto risco - Ações imediatas necessárias
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
                <div>
                  <p className="font-semibold text-red-900">IPO ≥ 10%</p>
                  <p className="text-red-700 text-xs">
                    Situação crítica - Mobilização urgente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
