/**
 * Design System v3.0 - Design Tokens
 * Exportação centralizada de todos os tokens de design
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animation';
export * from './radius';

// Re-exportação consolidada para uso fácil
import { colors, gradients, coloredShadows } from './colors';
import { typography, textStyles } from './typography';
import { spacing, semanticSpacing } from './spacing';
import { shadows, semanticShadows } from './shadows';
import { animation, keyframes } from './animation';
import { radius, semanticRadius } from './radius';

export const tokens = {
  colors,
  gradients,
  coloredShadows,
  typography,
  textStyles,
  spacing,
  semanticSpacing,
  shadows,
  semanticShadows,
  animation,
  keyframes,
  radius,
  semanticRadius,
} as const;

export type DesignTokens = typeof tokens;
