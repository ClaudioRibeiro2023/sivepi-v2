/**
 * Gerador de Relatórios - Sprint 2
 * Exportação de dados e geração de relatórios
 */

import type { OvitrapData } from '../types';

export interface ReportConfig {
  title: string;
  subtitle?: string;
  data: any[];
  sections?: ReportSection[];
  includeCharts?: boolean;
  includeStatistics?: boolean;
}

export interface ReportSection {
  title: string;
  content: string | string[];
  data?: any[];
}

/**
 * Exporta dados para CSV
 */
export function exportToCSV(data: OvitrapData[], filename: string = 'relatorio.csv'): void {
  if (!data || data.length === 0) {
    console.error('Nenhum dado para exportar');
    return;
  }

  // Cabeçalhos
  const headers = Object.keys(data[0]).join(',');
  
  // Linhas
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => {
        // Escapar valores que contêm vírgula ou aspas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',')
  );

  // Combinar
  const csv = [headers, ...rows].join('\n');

  // Download
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Exporta dados para JSON
 */
export function exportToJSON(data: any, filename: string = 'relatorio.json'): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

/**
 * Gera relatório HTML
 */
export function generateHTMLReport(config: ReportConfig): string {
  const { title, subtitle, sections = [], data } = config;

  let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #0087A8 0%, #005f73 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 2.5em;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1em;
    }
    .section {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .section h2 {
      color: #0087A8;
      border-bottom: 2px solid #0087A8;
      padding-bottom: 10px;
      margin-top: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #0087A8;
      color: white;
      font-weight: 600;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 0.9em;
    }
    @media print {
      body {
        background: white;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    ${subtitle ? `<p>${subtitle}</p>` : ''}
    <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
  </div>
`;

  // Adicionar seções
  sections.forEach((section) => {
    html += `
  <div class="section">
    <h2>${section.title}</h2>
`;
    
    if (Array.isArray(section.content)) {
      section.content.forEach((paragraph) => {
        html += `    <p>${paragraph}</p>\n`;
      });
    } else {
      html += `    <p>${section.content}</p>\n`;
    }

    if (section.data && section.data.length > 0) {
      html += `    <table>\n`;
      html += `      <thead><tr>`;
      
      // Cabeçalhos
      Object.keys(section.data[0]).forEach((key) => {
        html += `<th>${key}</th>`;
      });
      html += `</tr></thead>\n`;
      
      // Dados
      html += `      <tbody>\n`;
      section.data.forEach((row) => {
        html += `        <tr>`;
        Object.values(row).forEach((value) => {
          html += `<td>${value}</td>`;
        });
        html += `</tr>\n`;
      });
      html += `      </tbody>\n    </table>\n`;
    }

    html += `  </div>\n`;
  });

  html += `
  <div class="footer">
    <p>SIVEPI - Sistema Integrado de Vigilância Epidemiológica</p>
    <p>© ${new Date().getFullYear()} - Montes Claros/MG</p>
  </div>
</body>
</html>
`;

  return html;
}

/**
 * Exporta relatório HTML
 */
export function exportHTMLReport(config: ReportConfig, filename: string = 'relatorio.html'): void {
  const html = generateHTMLReport(config);
  downloadFile(html, filename, 'text/html');
}

/**
 * Função auxiliar para download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gera relatório boletim epidemiológico
 */
export function generateEpidemiologicalBulletin(
  data: OvitrapData[],
  period: string
): ReportConfig {
  const positivas = data.filter((r) => r.quantidade_ovos > 0).length;
  const ipo = (positivas / data.length) * 100;
  const totalOvos = data.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
  const mediaOvos = totalOvos / data.length;

  return {
    title: 'Boletim Epidemiológico',
    subtitle: `Período: ${period}`,
    data: [],
    sections: [
      {
        title: 'Resumo Executivo',
        content: [
          `Durante o período analisado, foram registradas ${data.length.toLocaleString()} coletas em ovitrampas.`,
          `O Índice de Positividade de Ovitrampas (IPO) foi de ${ipo.toFixed(2)}%, com ${positivas} armadilhas positivas.`,
          `Foram contabilizados ${totalOvos.toLocaleString()} ovos, com média de ${mediaOvos.toFixed(1)} ovos por armadilha.`,
        ],
      },
      {
        title: 'Classificação de Risco',
        content:
          ipo < 1
            ? 'Situação satisfatória - Manter vigilância de rotina.'
            : ipo < 5
            ? 'Alerta - Intensificar ações de controle vetorial.'
            : ipo < 10
            ? 'Alto risco - Ações imediatas necessárias.'
            : 'Situação crítica - Mobilização urgente de equipes.',
      },
      {
        title: 'Recomendações',
        content: [
          'Manter monitoramento contínuo das ovitrampas',
          'Realizar vistoria em imóveis das áreas críticas',
          'Intensificar ações de educação ambiental',
          'Eliminar criadouros potenciais',
        ],
      },
    ],
  };
}
