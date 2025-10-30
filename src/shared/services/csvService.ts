/**
 * CSV Service
 * Conforme ROADMAP.md - FASE 3.1
 */

import Papa from 'papaparse';
import type { OvitrapData } from '../types';

export async function loadCSVData(): Promise<OvitrapData[]> {
  try {
    const response = await fetch('/data/banco_dados_aedes.csv');
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar CSV: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse<OvitrapData>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Validar dados
          const validData = results.data.filter(
            (item) => item && item.latitude && item.longitude && item.quantidade_ovos >= 0
          );
          
          console.log(`✅ CSV carregado: ${validData.length} registros válidos`);
          resolve(validData);
        },
        error: (error: Error) => {
          console.error('❌ Erro ao parsear CSV:', error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('❌ Erro ao carregar CSV:', error);
    throw error;
  }
}
