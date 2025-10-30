/**
 * Sistema de Resposta Operacional - Sprint 1 (Básico)
 * FASE 8 simplificada - Gestão de equipes e inventário
 */

import { useState, useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '../shared/components/ui';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import {
  Users,
  Package,
  Clipboard,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  PlusCircle,
} from 'lucide-react';

// Dados mockados para demonstração
const equipesIniciais = [
  { id: 1, nome: 'Equipe Norte', membros: 4, status: 'ativa', area: 'Zona Norte', ultimaAcao: '2025-10-29' },
  { id: 2, nome: 'Equipe Sul', membros: 3, status: 'ativa', area: 'Zona Sul', ultimaAcao: '2025-10-28' },
  { id: 3, nome: 'Equipe Centro', membros: 5, status: 'ativa', area: 'Centro', ultimaAcao: '2025-10-29' },
  { id: 4, nome: 'Equipe Leste', membros: 4, status: 'em_campo', area: 'Zona Leste', ultimaAcao: '2025-10-29' },
];

const inventarioInicial = [
  { id: 1, item: 'Ovitrampas', quantidade: 150, unidade: 'unidades', minimo: 50 },
  { id: 2, item: 'Larvicida BTI', quantidade: 25, unidade: 'kg', minimo: 10 },
  { id: 3, item: 'Equipamento de Proteção', quantidade: 30, unidade: 'kits', minimo: 20 },
  { id: 4, item: 'Pulverizadores', quantidade: 8, unidade: 'unidades', minimo: 5 },
];

export default function RespostaOperacional() {
  const { data, isLoading, error } = useOvitrapData();
  const [equipes] = useState(equipesIniciais);
  const [inventario] = useState(inventarioInicial);

  // Calcular áreas prioritárias baseadas nos dados
  const areasPrioritarias = useMemo(() => {
    const bairrosComProblema = data.reduce((acc, r) => {
      if (!r.bairro || r.quantidade_ovos === 0) return acc;
      
      if (!acc[r.bairro]) {
        acc[r.bairro] = { bairro: r.bairro, total: 0, positivas: 0, ovos: 0 };
      }
      acc[r.bairro].total++;
      if (r.quantidade_ovos > 0) acc[r.bairro].positivas++;
      acc[r.bairro].ovos += r.quantidade_ovos;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(bairrosComProblema)
      .map((b: any) => ({
        bairro: b.bairro,
        ipo: (b.positivas / b.total) * 100,
        totalOvos: b.ovos,
        prioridade: b.ovos > 1000 && (b.positivas / b.total) > 0.1 ? 'alta' : (b.ovos > 500 ? 'media' : 'baixa'),
      }))
      .filter((b) => b.prioridade === 'alta' || b.prioridade === 'media')
      .sort((a, b) => b.totalOvos - a.totalOvos)
      .slice(0, 10);
  }, [data]);

  // Estatísticas
  const stats = useMemo(() => {
    const equipesAtivas = equipes.filter(e => e.status === 'ativa' || e.status === 'em_campo').length;
    const itensAbaixoMinimo = inventario.filter(i => i.quantidade < i.minimo).length;
    
    return {
      totalEquipes: equipes.length,
      equipesAtivas,
      equipesEmCampo: equipes.filter(e => e.status === 'em_campo').length,
      totalMembros: equipes.reduce((sum, e) => sum + e.membros, 0),
      itensInventario: inventario.length,
      itensAbaixoMinimo,
      areasCriticas: areasPrioritarias.filter(a => a.prioridade === 'alta').length,
    };
  }, [equipes, inventario, areasPrioritarias]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="p-8 text-center">
        <Badge variant="danger">Erro ao carregar dados</Badge>
        <p className="mt-4 text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Clipboard className="text-[#0087A8]" size={32} />
          Sistema de Resposta Operacional
        </h1>
        <p className="text-gray-600 mt-2">
          Gestão de equipes, inventário e ações de campo
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equipes Ativas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.equipesAtivas}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  de {stats.totalEquipes} total
                </p>
              </div>
              <Users size={40} className="text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Campo Agora</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.equipesEmCampo}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  equipes atuando
                </p>
              </div>
              <MapPin size={40} className="text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventário</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.itensInventario}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.itensAbaixoMinimo} abaixo do mínimo
                </p>
              </div>
              <Package size={40} className="text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Áreas Críticas</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.areasCriticas}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  requerem atenção
                </p>
              </div>
              <AlertTriangle size={40} className="text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Áreas Prioritárias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Áreas Prioritárias para Intervenção</CardTitle>
            <Badge variant="critical">{areasPrioritarias.length} áreas</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {areasPrioritarias.map((area, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  area.prioridade === 'alta'
                    ? 'border-red-500 bg-red-50'
                    : 'border-orange-500 bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-600" />
                      <span className="font-bold text-gray-900">{area.bairro}</span>
                      <Badge variant={area.prioridade === 'alta' ? 'critical' : 'high'} size="sm">
                        Prioridade {area.prioridade}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-gray-700">
                      <span>IPO: {area.ipo.toFixed(1)}%</span>
                      <span>Total de ovos: {area.totalOvos.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm">
                    Despachar Equipe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gestão de Equipes e Inventário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Equipes de Campo</CardTitle>
              <Button variant="primary" size="sm">
                <PlusCircle size={16} className="mr-1" />
                Nova Equipe
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equipes.map((equipe) => (
                <div
                  key={equipe.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Users size={18} className="text-gray-600" />
                        <span className="font-semibold text-gray-900">{equipe.nome}</span>
                        {equipe.status === 'em_campo' && (
                          <Badge variant="high" size="sm">
                            Em Campo
                          </Badge>
                        )}
                        {equipe.status === 'ativa' && (
                          <Badge variant="low" size="sm">
                            Disponível
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-600 flex gap-4">
                        <span>{equipe.membros} membros</span>
                        <span>{equipe.area}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        Última ação: {equipe.ultimaAcao}
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventário */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Controle de Inventário</CardTitle>
              <Button variant="primary" size="sm">
                <PlusCircle size={16} className="mr-1" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventario.map((item) => {
                const abaixoMinimo = item.quantidade < item.minimo;
                const percentual = (item.quantidade / (item.minimo * 2)) * 100;
                
                return (
                  <div
                    key={item.id}
                    className={`p-4 border-2 rounded-lg ${
                      abaixoMinimo
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Package size={18} className={abaixoMinimo ? 'text-red-600' : 'text-gray-600'} />
                        <span className="font-semibold text-gray-900">{item.item}</span>
                      </div>
                      {abaixoMinimo && (
                        <Badge variant="critical" size="sm">
                          Estoque Baixo
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className={`font-bold ${abaixoMinimo ? 'text-red-600' : 'text-green-600'}`}>
                          {item.quantidade}
                        </span>
                        <span className="text-gray-600"> {item.unidade}</span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        Mínimo: {item.minimo}
                      </span>
                    </div>
                    
                    {/* Barra de progresso */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          abaixoMinimo ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentual, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist de Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Checklist de Intervenções</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Instalação de ovitrampas',
              'Aplicação de larvicida',
              'Remoção de criadouros',
              'Vistoria domiciliar',
              'Educação ambiental',
              'Nebulização',
            ].map((acao, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-sm text-gray-900">{acao}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nota de desenvolvimento */}
      <Card className="border-blue-300 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-blue-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Módulo em Desenvolvimento (Sprint 1 - Versão Básica)
              </p>
              <p className="text-sm text-blue-800">
                Esta é uma implementação básica do sistema de resposta operacional. 
                Funcionalidades completas incluirão: despacho automático de equipes, 
                geolocalização em tempo real, gestão de rotas otimizadas, análise de 
                efetividade das intervenções e integração com sistemas externos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
