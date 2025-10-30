/**
 * Design System v3.0 - Border Radius Tokens
 * Arredondamentos modernos para componentes
 */

export const radius = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px - Base
  lg: '0.75rem',    // 12px - Cards
  xl: '1rem',       // 16px - Modais
  '2xl': '1.5rem',  // 24px - Hero cards
  '3xl': '2rem',    // 32px - Especiais
  full: '9999px',   // Círculos e pills
} as const;

// Radius semântico
export const semanticRadius = {
  // Componentes
  button: radius.lg,
  buttonSmall: radius.md,
  buttonLarge: radius.xl,
  
  card: radius.xl,
  cardSmall: radius.lg,
  cardLarge: radius['2xl'],
  
  input: radius.lg,
  inputSmall: radius.md,
  
  modal: radius['2xl'],
  dropdown: radius.xl,
  tooltip: radius.md,
  badge: radius.full,
  avatar: radius.full,
  
  // Containers
  container: radius.lg,
  section: radius['2xl'],
} as const;

export type Radius = typeof radius;
export type SemanticRadius = typeof semanticRadius;
