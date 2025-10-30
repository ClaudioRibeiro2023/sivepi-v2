/**
 * Validadores de Dados
 * Validação runtime sem dependências externas
 * Sprint 4 - Testes & Validação
 */

import type { OvitrapData } from '../types';

/**
 * Resultado de validação
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Resultado de validação de array
 */
export interface ArrayValidationResult {
  valid: boolean;
  errors: Array<{ index: number; errors: string[] }>;
  validCount: number;
  invalidCount: number;
  validRecords: OvitrapData[];
  invalidRecords: Array<{ index: number; record: unknown }>;
}

/**
 * Valida coordenadas geográficas
 */
export function validateCoordinates(lat: number, lng: number): ValidationResult {
  const errors: string[] = [];

  if (typeof lat !== 'number' || isNaN(lat)) {
    errors.push('Latitude deve ser um número válido');
  } else if (lat < -90 || lat > 90) {
    errors.push('Latitude deve estar entre -90 e 90');
  }

  if (typeof lng !== 'number' || isNaN(lng)) {
    errors.push('Longitude deve ser um número válido');
  } else if (lng < -180 || lng > 180) {
    errors.push('Longitude deve estar entre -180 e 180');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida semana epidemiológica
 */
export function validateEpiWeek(week: number): ValidationResult {
  const errors: string[] = [];

  if (typeof week !== 'number' || isNaN(week)) {
    errors.push('Semana epidemiológica deve ser um número');
  } else if (!Number.isInteger(week)) {
    errors.push('Semana epidemiológica deve ser um inteiro');
  } else if (week < 1 || week > 53) {
    errors.push('Semana epidemiológica deve estar entre 1 e 53');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida mês
 */
export function validateMonth(month: number): ValidationResult {
  const errors: string[] = [];

  if (typeof month !== 'number' || isNaN(month)) {
    errors.push('Mês deve ser um número');
  } else if (!Number.isInteger(month)) {
    errors.push('Mês deve ser um inteiro');
  } else if (month < 1 || month > 12) {
    errors.push('Mês deve estar entre 1 e 12');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida ano
 */
export function validateYear(year: number): ValidationResult {
  const errors: string[] = [];
  const currentYear = new Date().getFullYear();

  if (typeof year !== 'number' || isNaN(year)) {
    errors.push('Ano deve ser um número');
  } else if (!Number.isInteger(year)) {
    errors.push('Ano deve ser um inteiro');
  } else if (year < 2000 || year > currentYear + 1) {
    errors.push(`Ano deve estar entre 2000 e ${currentYear + 1}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida quantidade de ovos
 */
export function validateOvosCount(count: number): ValidationResult {
  const errors: string[] = [];

  if (typeof count !== 'number' || isNaN(count)) {
    errors.push('Quantidade de ovos deve ser um número');
  } else if (!Number.isInteger(count)) {
    errors.push('Quantidade de ovos deve ser um inteiro');
  } else if (count < 0) {
    errors.push('Quantidade de ovos não pode ser negativa');
  } else if (count > 10000) {
    errors.push('Quantidade de ovos parece anormalmente alta (>10000)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida registro completo de ovitrampa
 */
export function validateOvitrapRecord(record: unknown): ValidationResult {
  const errors: string[] = [];

  // Verificar se é um objeto
  if (typeof record !== 'object' || record === null) {
    errors.push('Registro deve ser um objeto');
    return { valid: false, errors };
  }

  const data = record as Partial<OvitrapData>;

  // Campos obrigatórios
  if (!data.id_registro) {
    errors.push('id_registro é obrigatório');
  }

  if (!data.id_ovitrampa) {
    errors.push('id_ovitrampa é obrigatório');
  }

  if (typeof data.quantidade_ovos !== 'number') {
    errors.push('quantidade_ovos é obrigatório e deve ser número');
  } else {
    const ovosValidation = validateOvosCount(data.quantidade_ovos);
    errors.push(...ovosValidation.errors);
  }

  // Validar coordenadas
  if (data.latitude !== undefined && data.longitude !== undefined) {
    const coordsValidation = validateCoordinates(data.latitude, data.longitude);
    errors.push(...coordsValidation.errors);
  } else {
    errors.push('Coordenadas (latitude/longitude) são obrigatórias');
  }

  // Validar ano
  if (data.ano !== undefined) {
    const yearValidation = validateYear(data.ano);
    errors.push(...yearValidation.errors);
  }

  // Validar mês
  if (data.mes_numero !== undefined) {
    const monthValidation = validateMonth(data.mes_numero);
    errors.push(...monthValidation.errors);
  }

  // Validar semana epidemiológica
  if (data.semana_epidemiologica !== undefined) {
    const weekValidation = validateEpiWeek(data.semana_epidemiologica);
    errors.push(...weekValidation.errors);
  }

  // Validar bairro
  if (!data.bairro || typeof data.bairro !== 'string' || data.bairro.trim() === '') {
    errors.push('Bairro é obrigatório e deve ser uma string não vazia');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida array de registros
 */
export function validateOvitrapDataArray(data: unknown[]): ArrayValidationResult {
  const errors: Array<{ index: number; errors: string[] }> = [];
  const validRecords: OvitrapData[] = [];
  const invalidRecords: Array<{ index: number; record: unknown }> = [];
  let validCount = 0;
  let invalidCount = 0;

  data.forEach((record, index) => {
    const validation = validateOvitrapRecord(record);

    if (validation.valid) {
      validCount++;
      validRecords.push(record as OvitrapData);
    } else {
      invalidCount++;
      errors.push({ index, errors: validation.errors });
      invalidRecords.push({ index, record });
    }
  });

  return {
    valid: invalidCount === 0,
    errors,
    validCount,
    invalidCount,
    validRecords,
    invalidRecords,
  };
}

/**
 * Sanitiza dados removendo inválidos
 */
export function sanitizeOvitrapData(data: unknown[]): OvitrapData[] {
  const result = validateOvitrapDataArray(data);

  if (result.invalidCount > 0) {
    console.warn(`⚠️ ${result.invalidCount} registros inválidos foram removidos`);
    console.warn('Primeiros erros:', result.errors.slice(0, 5));
  }

  return result.validRecords;
}

/**
 * Valida intervalo de datas
 */
export function validateDateRange(startDate: string, endDate: string): ValidationResult {
  const errors: string[] = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    errors.push('Data inicial inválida');
  }

  if (isNaN(end.getTime())) {
    errors.push('Data final inválida');
  }

  if (errors.length === 0 && start > end) {
    errors.push('Data inicial deve ser anterior à data final');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida qualidade dos dados (resumo geral)
 */
export function validateDataQuality(data: unknown[]): {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  qualityPercentage: number;
  issues: {
    missingCoordinates: number;
    invalidDates: number;
    negativeValues: number;
    missingBairro: number;
  };
} {
  const validation = validateOvitrapDataArray(data);

  // Contar tipos específicos de problemas
  const issues = {
    missingCoordinates: 0,
    invalidDates: 0,
    negativeValues: 0,
    missingBairro: 0,
  };

  validation.errors.forEach(({ errors }) => {
    errors.forEach(error => {
      if (error.includes('Coordenadas')) issues.missingCoordinates++;
      if (error.includes('ano') || error.includes('mês')) issues.invalidDates++;
      if (error.includes('negativa')) issues.negativeValues++;
      if (error.includes('Bairro')) issues.missingBairro++;
    });
  });

  return {
    totalRecords: data.length,
    validRecords: validation.validCount,
    invalidRecords: validation.invalidCount,
    qualityPercentage: data.length > 0 
      ? (validation.validCount / data.length) * 100 
      : 0,
    issues,
  };
}
