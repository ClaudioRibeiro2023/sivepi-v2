/**
 * Design System v3.0 - Shadow Tokens
 * Sombras modernas para criar profundidade e hierarquia
 */

export const shadows = {
  // Elevações padrão
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Sombras internas (para inputs)
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  innerMd: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.1)',

  // Sombras coloridas (para cards especiais)
  primary: '0 8px 16px -4px rgba(26, 191, 209, 0.2)',
  primaryLg: '0 20px 25px -5px rgba(26, 191, 209, 0.3)',
  
  success: '0 8px 16px -4px rgba(16, 185, 129, 0.2)',
  successLg: '0 20px 25px -5px rgba(16, 185, 129, 0.3)',
  
  warning: '0 8px 16px -4px rgba(245, 158, 11, 0.2)',
  warningLg: '0 20px 25px -5px rgba(245, 158, 11, 0.3)',
  
  error: '0 8px 16px -4px rgba(239, 68, 68, 0.2)',
  errorLg: '0 20px 25px -5px rgba(239, 68, 68, 0.3)',
  
  info: '0 8px 16px -4px rgba(59, 130, 246, 0.2)',
  infoLg: '0 20px 25px -5px rgba(59, 130, 246, 0.3)',

  // Glow effects
  glowPrimary: '0 0 20px rgba(26, 191, 209, 0.5)',
  glowSuccess: '0 0 20px rgba(16, 185, 129, 0.5)',
  glowWarning: '0 0 20px rgba(245, 158, 11, 0.5)',
  glowError: '0 0 20px rgba(239, 68, 68, 0.5)',
} as const;

// Box shadows semânticas
export const semanticShadows = {
  // Cards
  cardDefault: shadows.md,
  cardHover: shadows.lg,
  cardActive: shadows.xl,
  cardGlassmorphic: shadows['2xl'],

  // Buttons
  buttonDefault: shadows.sm,
  buttonHover: shadows.md,
  buttonActive: shadows.inner,

  // Modals
  modalBackdrop: 'none',
  modalContent: shadows['2xl'],

  // Dropdowns
  dropdown: shadows.lg,
  dropdownLarge: shadows.xl,

  // Tooltips
  tooltip: shadows.md,

  // Navigation
  navSidebar: shadows.lg,
  navDropdown: shadows.xl,
} as const;

export type Shadows = typeof shadows;
export type SemanticShadows = typeof semanticShadows;
