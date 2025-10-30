/**
 * Módulo de Qualidade de Dados - Sprint 1
 * Validação, score e detecção de anomalias
 */

import { useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../shared/components/ui';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  FileText,
} from 'lucide-react';

interface QualityMetrics {
  scoreGeral: number;
  totalRegistros: number;
  registrosCompletos: number;
  registrosIncompletos: number;
  camposFaltantes: Record<string, number>;
  anomalias: any[];
  scoresPorBairro: any[];
}

export default function QualidadeDados() {
  const { data, isLoading, error } = useOvitrapData();

  const metricas = useMemo((): QualityMetrics => {
    if (!data || data.length === 0) {
      return {
        scoreGeral: 0,
        totalRegistros: 0,
        registrosCompletos: 0,
        registrosIncompletos: 0,
        camposFaltantes: {},
        anomalias: [],
        scoresPorBairro: [],
      };
    }

    // Campos obrigatórios e seus pesos
    const camposObrigatorios = {
      id_ovitrampa: 1,
      data_coleta: 1,
      latitude: 1,
      longitude: 1,
      bairro: 1,
      quantidade_ovos: 0.8,
      semana_epidemiologica: 0.6,
      mes: 0.5,
      ano: 1,
    };

    let registrosCompletos = 0;
    let registrosIncompletos = 0;
    const camposFaltantes: Record<string, number> = {};
    const anomalias: any[] = [];

    // Analisar cada registro
    const scoresRegistros = data.map((record, idx) => {
      let scoreRegistro = 0;
      let camposFaltantesRegistro = [];

      // Verificar campos obrigatórios
      for (const [campo, peso] of Object.entries(camposObrigatorios)) {
        const valor = (record as any)[campo];
        
        if (valor === null || valor === undefined || valor === '') {
          camposFaltantes[campo] = (camposFaltantes[campo] || 0) + 1;
          camposFaltantesRegistro.push(campo);
        } else {
          scoreRegistro += peso;
        }
      }

      // Validações específicas
      // 1. Coordenadas válidas
      if (record.latitude && record.longitude) {
        if (record.latitude < -90 || record.latitude > 90 ||
            record.longitude < -180 || record.longitude > 180) {
          anomalias.push({
            tipo: 'coordenadas_invalidas',
            registro: idx + 1,
            mensagem: `Coordenadas fora do range válido: (${record.latitude}, ${record.longitude})`,
            severidade: 'alta',
          });
        }
      }

      // 2. Quantidade de ovos anômala (outlier extremo)
      if (record.quantidade_ovos > 10000) {
        anomalias.push({
          tipo: 'ovos_anomalo',
          registro: idx + 1,
          mensagem: `Quantidade de ovos muito alta: ${record.quantidade_ovos}`,
          severidade: 'media',
        });
      }

      // 3. Data futura
      if (record.data_coleta) {
        const dataColeta = new Date(record.data_coleta);
        if (dataColeta > new Date()) {
          anomalias.push({
            tipo: 'data_futura',
            registro: idx + 1,
            mensagem: `Data de coleta no futuro: ${record.data_coleta}`,
            severidade: 'alta',
          });
        }
      }

      // 4. Semana epidemiológica inválida
      if (record.semana_epidemiologica && 
          (record.semana_epidemiologica < 1 || record.semana_epidemiologica > 53)) {
        anomalias.push({
          tipo: 'semana_invalida',
          registro: idx + 1,
          mensagem: `Semana epidemiológica inválida: ${record.semana_epidemiologica}`,
          severidade: 'baixa',
        });
      }

      // Calcular % de completude
      const pesoTotal = Object.values(camposObrigatorios).reduce((sum, p) => sum + p, 0);
      const percentualCompleto = (scoreRegistro / pesoTotal) * 100;

      if (percentualCompleto >= 95) registrosCompletos++;
      else registrosIncompletos++;

      return {
        indice: idx,
        score: percentualCompleto,
        camposFaltantes: camposFaltantesRegistro,
      };
    });

    // Score geral (média)
    const scoreGeral = scoresRegistros.reduce((sum, r) => sum + r.score, 0) / data.length;

    // Scores por bairro
    const bairrosMap = data.reduce((acc, record, idx) => {
      const bairro = record.bairro || 'Não Informado';
      if (!acc[bairro]) {
        acc[bairro] = { registros: [], scores: [] };
      }
      acc[bairro].registros.push(record);
      acc[bairro].scores.push(scoresRegistros[idx].score);
      return acc;
    }, {} as Record<string, any>);

    const scoresPorBairro = Object.entries(bairrosMap).map(([bairro, data]) => {
      const scoreMedia = data.scores.reduce((sum: number, s: number) => sum + s, 0) / data.scores.length;
      return {
        bairro,
        score: scoreMedia,
        total: data.registros.length,
      };
    }).sort((a, b) => a.score - b.score);

    return {
      scoreGeral,
      totalRegistros: data.length,
      registrosCompletos,
      registrosIncompletos,
      camposFaltantes,
      anomalias,
      scoresPorBairro,
    };
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="p-8 text-center">
        <Badge variant="danger">Erro ao carregar dados</Badge>
        <p className="mt-4 text-gray-600">{error.message}</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 95) return 'low';
    if (score >= 80) return 'medium';
    if (score >= 60) return 'high';
    return 'critical';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="text-[#0087A8]" size={32} />
          Qualidade dos Dados
        </h1>
        <p className="text-gray-600 mt-2">
          Análise de completude, validação e detecção de anomalias
        </p>
      </div>

      {/* Score Geral */}
      <Card className={`border-2 ${
        metricas.scoreGeral >= 95
          ? 'border-green-300 bg-green-50'
          : metricas.scoreGeral >= 80
          ? 'border-yellow-300 bg-yellow-50'
          : 'border-red-300 bg-red-50'
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">Score Geral de Qualidade</p>
              <p className={`text-5xl font-bold mt-2 ${getScoreColor(metricas.scoreGeral)}`}>
                {metricas.scoreGeral.toFixed(1)}%
              </p>
              <Badge variant={getScoreBadge(metricas.scoreGeral)} className="mt-3">
                {metricas.scoreGeral >= 95
                  ? 'Excelente'
                  : metricas.scoreGeral >= 80
                  ? 'Bom'
                  : metricas.scoreGeral >= 60
                  ? 'Regular'
                  : 'Ruim'}
              </Badge>
            </div>
            <TrendingUp size={80} className="opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registros Completos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {metricas.registrosCompletos}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {((metricas.registrosCompletos / metricas.totalRegistros) * 100).toFixed(1)}% do total
                </p>
              </div>
              <CheckCircle size={40} className="text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registros Incompletos</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {metricas.registrosIncompletos}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {((metricas.registrosIncompletos / metricas.totalRegistros) * 100).toFixed(1)}% do total
                </p>
              </div>
              <XCircle size={40} className="text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Anomalias Detectadas</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {metricas.anomalias.length}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Requerem revisão
                </p>
              </div>
              <AlertTriangle size={40} className="text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campos Faltantes */}
      {Object.keys(metricas.camposFaltantes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campos com Dados Faltantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metricas.camposFaltantes)
                .sort((a, b) => b[1] - a[1])
                .map(([campo, count]) => (
                  <div key={campo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle size={20} className="text-red-500" />
                      <span className="font-medium text-gray-900">{campo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {count} registros ({((count / metricas.totalRegistros) * 100).toFixed(1)}%)
                      </span>
                      <Badge variant="danger" size="sm">
                        {count}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Anomalias */}
      {metricas.anomalias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Anomalias Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metricas.anomalias.slice(0, 20).map((anomalia, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 ${
                    anomalia.severidade === 'alta'
                      ? 'border-red-500 bg-red-50'
                      : anomalia.severidade === 'media'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={16}
                      className={`mt-0.5 ${
                        anomalia.severidade === 'alta'
                          ? 'text-red-600'
                          : anomalia.severidade === 'media'
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Registro #{anomalia.registro}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{anomalia.mensagem}</p>
                    </div>
                    <Badge
                      variant={
                        anomalia.severidade === 'alta'
                          ? 'critical'
                          : anomalia.severidade === 'media'
                          ? 'high'
                          : 'medium'
                      }
                      size="sm"
                    >
                      {anomalia.severidade}
                    </Badge>
                  </div>
                </div>
              ))}
              {metricas.anomalias.length > 20 && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  E mais {metricas.anomalias.length - 20} anomalias...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scores por Bairro */}
      <Card>
        <CardHeader>
          <CardTitle>Qualidade por Bairro (Top 10 Piores)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metricas.scoresPorBairro.slice(0, 10).map((bairro, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{bairro.bairro}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{bairro.total} registros</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(bairro.score)}`}>
                      {bairro.score.toFixed(1)}%
                    </span>
                    <Badge variant={getScoreBadge(bairro.score)} size="sm">
                      {bairro.score >= 95 ? '✓' : bairro.score >= 80 ? '!' : '!!'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-900">
            {metricas.scoreGeral < 95 && (
              <li>• Revisar e completar campos faltantes nos registros incompletos</li>
            )}
            {metricas.anomalias.length > 0 && (
              <li>• Investigar e corrigir as {metricas.anomalias.length} anomalias detectadas</li>
            )}
            {metricas.scoresPorBairro[0] && metricas.scoresPorBairro[0].score < 80 && (
              <li>• Priorizar melhoria da qualidade no bairro "{metricas.scoresPorBairro[0].bairro}"</li>
            )}
            {Object.keys(metricas.camposFaltantes).length > 0 && (
              <li>• Implementar validação obrigatória nos campos críticos durante a coleta</li>
            )}
            <li>• Manter monitoramento contínuo da qualidade dos dados</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
