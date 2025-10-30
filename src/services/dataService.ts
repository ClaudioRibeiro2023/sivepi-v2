/**
 * Serviço de gerenciamento de dados do SIVEPI
 * Responsável por carregar, processar e fornecer dados do CSV
 */

import type { AedesRecord } from '@types/index';

/**
 * Carrega dados do arquivo CSV
 */
export const loadCSVData = async (): Promise<AedesRecord[]> => {
  try {
    // Verifica se estamos no ambiente do navegador
    if (typeof window === 'undefined') {
      throw new Error('Este serviço só pode ser usado no navegador');
    }

    // Tenta usar a API do sistema de arquivos se disponível
    if ('fs' in window && typeof (window as any).fs?.readFile === 'function') {
      const fileContent = await (window as any).fs.readFile(
        'banco_dados_aedes_montes_claros_normalizado.csv',
        { encoding: 'utf8' }
      );
      return parseCSV(fileContent);
    }

    // Fallback: tenta carregar via fetch do public
    const response = await fetch('/01-Dados/banco_dados_aedes_montes_claros_normalizado.csv');
    if (!response.ok) {
      throw new Error(`Erro ao carregar CSV: ${response.statusText}`);
    }
    
    const fileContent = await response.text();
    return parseCSV(fileContent);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    throw new Error(`Falha ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Faz o parsing do CSV
 */
const parseCSV = (content: string): AedesRecord[] => {
  const lines = content.trim().split('\n');
  if (lines.length === 0) {
    throw new Error('Arquivo CSV vazio');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: AedesRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    try {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const row: any = {};

      headers.forEach((header, index) => {
        let value = (values[index] || '').trim().replace(/^"|"$/g, '');

        if ([
          'id_registro',
          'id_ovitrampa',
          'quantidade_ovos',
          'ano',
          'mes_numero',
          'trimestre',
          'semana_epidemiologica',
          'codigo_ibge',
          'reincidencia',
          'linha_original'
        ].includes(header)) {
          row[header] = value === '' || value === 'null' ? 0 : parseInt(value) || 0;
        } else if ([
          'latitude',
          'longitude',
          'peso_ovitrampa',
          'percentual_diferenca'
        ].includes(header)) {
          row[header] = value === '' || value === 'null' ? 0 : parseFloat(value) || 0;
        } else {
          row[header] = value || '';
        }
      });

      if (row.id_registro && row.id_ovitrampa && row.ano > 0) {
        data.push(row as AedesRecord);
      }
    } catch (error) {
      console.warn(`Erro ao processar linha ${i}:`, error);
      continue;
    }
  }

  if (data.length === 0) {
    throw new Error('Nenhum registro válido encontrado no CSV');
  }

  console.log(`✓ Carregados ${data.length} registros do CSV`);
  return data;
};

/**
 * Filtra dados por período
 */
export const filterDataByPeriod = (
  data: AedesRecord[],
  year?: string,
  month?: string,
  week?: string
): AedesRecord[] => {
  let filtered = [...data];

  if (year && year !== 'all') {
    filtered = filtered.filter(r => r.ano.toString() === year);
  }

  if (month && month !== 'all' && month.includes('-')) {
    const [monthNum, yearNum] = month.split('-').map(Number);
    filtered = filtered.filter(r => r.mes_numero === monthNum && r.ano === yearNum);
  }

  if (week && week !== 'all' && week.includes('-')) {
    const [weekNum, yearNum] = week.split('-').map(Number);
    filtered = filtered.filter(r => r.semana_epidemiologica === weekNum && r.ano === yearNum);
  }

  return filtered;
};

/**
 * Obtém anos disponíveis nos dados
 */
export const getAvailableYears = (data: AedesRecord[]): string[] => {
  return [...new Set(data.map(r => r.ano).filter(ano => ano > 0))]
    .sort((a, b) => b - a)
    .map(String);
};

/**
 * Obtém meses disponíveis para um ano específico
 */
export const getAvailableMonths = (data: AedesRecord[], year?: string): string[] => {
  let filtered = data;
  if (year && year !== 'all') {
    filtered = data.filter(r => r.ano.toString() === year);
  }

  const months = filtered
    .filter(r => r.mes_numero > 0 && r.mes_numero <= 12)
    .map(r => ({ mes: r.mes_numero, ano: r.ano }))
    .filter((m, i, arr) => arr.findIndex(x => x.mes === m.mes && x.ano === m.ano) === i)
    .sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.mes - a.mes;
    })
    .map(m => `${String(m.mes).padStart(2, '0')}-${m.ano}`);

  return [...new Set(months)];
};

/**
 * Obtém semanas disponíveis para um mês específico
 */
export const getAvailableWeeks = (
  data: AedesRecord[],
  year?: string,
  month?: string
): string[] => {
  let filtered = data;

  if (year && year !== 'all') {
    filtered = filtered.filter(r => r.ano.toString() === year);
  }

  if (month && month !== 'all' && month.includes('-')) {
    const [monthNum, yearNum] = month.split('-').map(Number);
    filtered = filtered.filter(r => r.mes_numero === monthNum && r.ano === yearNum);
  }

  const weeks = filtered
    .filter(r => r.semana_epidemiologica >= 1 && r.semana_epidemiologica <= 53)
    .map(r => ({ semana: r.semana_epidemiologica, ano: r.ano }))
    .filter((w, i, arr) => arr.findIndex(x => x.semana === w.semana && x.ano === w.ano) === i)
    .sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.semana - a.semana;
    })
    .map(w => `${w.semana}-${w.ano}`);

  return [...new Set(weeks)];
};

/**
 * Calcula estatísticas gerais
 */
export const calculateGeneralStats = (data: AedesRecord[]) => {
  return {
    totalOvos: data.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0),
    totalRegistros: data.length,
    bairrosUnicos: new Set(data.map(r => r.bairro).filter(Boolean)).size,
    ovitrampasUnicas: new Set(data.map(r => r.id_ovitrampa).filter(Boolean)).size
  };
};
