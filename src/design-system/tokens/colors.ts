/**
 * Design System v3.0 - Color Tokens
 * Paleta moderna com gradientes e variações suaves
 */

export const colors = {
  // Primary - Teal Moderno (mais saturado e vibrante)
  primary: {
    50: '#E6F7F9',
    100: '#B3E9EF',
    200: '#80DBE5',
    300: '#4DCDDB',
    400: '#1ABFD1', // Base (antes era #0087A8)
    500: '#00A3BD',
    600: '#008DA3',
    700: '#007789',
    800: '#00616F',
    900: '#004B55',
  },

  // Secondary - Purple Tecnológico
  secondary: {
    400: '#8B5CF6',
    500: '#7C3AED',
    600: '#6D28D9',
  },

  // Accent - Amber para destaques
  accent: {
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },

  // Semantic Colors - Status (gradação suave)
  success: {
    light: '#D1FAE5',
    DEFAULT: '#10B981',
    dark: '#047857',
  },

  warning: {
    light: '#FEF3C7',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
  },

  error: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
  },

  info: {
    light: '#DBEAFE',
    DEFAULT: '#3B82F6',
    dark: '#1D4ED8',
  },

  // Neutros (maior contraste para legibilidade)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Cores especiais
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
} as const;

// Gradientes modernos
export const gradients = {
  primary: 'linear-gradient(135deg, #1ABFD1 0%, #00A3BD 100%)',
  primaryHover: 'linear-gradient(135deg, #4DCDDB 0%, #1ABFD1 100%)',
  secondary: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  sunset: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  ocean: 'linear-gradient(135deg, #3B82F6 0%, #1ABFD1 100%)',
  forest: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
  
  // Gradientes de fundo sutis
  bgLight: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
  bgDark: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
} as const;

// Sombras coloridas para cards especiais
export const coloredShadows = {
  primary: '0 8px 16px -4px rgba(26, 191, 209, 0.2)',
  success: '0 8px 16px -4px rgba(16, 185, 129, 0.2)',
  warning: '0 8px 16px -4px rgba(245, 158, 11, 0.2)',
  error: '0 8px 16px -4px rgba(239, 68, 68, 0.2)',
  info: '0 8px 16px -4px rgba(59, 130, 246, 0.2)',
} as const;

export type ColorPalette = typeof colors;
export type GradientPalette = typeof gradients;
