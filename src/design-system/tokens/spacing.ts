/**
 * Design System v3.0 - Spacing Tokens
 * Sistema baseado em 8pt grid para consistência
 */

export const spacing = {
  // Base: 4px (0.25rem)
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Spacing semântico (uso contextual)
export const semanticSpacing = {
  // Componentes internos
  componentPaddingXs: spacing[2],   // 8px
  componentPaddingSm: spacing[3],   // 12px
  componentPaddingMd: spacing[4],   // 16px
  componentPaddingLg: spacing[6],   // 24px
  componentPaddingXl: spacing[8],   // 32px

  // Gaps entre elementos
  gapXs: spacing[1],   // 4px
  gapSm: spacing[2],   // 8px
  gapMd: spacing[4],   // 16px
  gapLg: spacing[6],   // 24px
  gapXl: spacing[8],   // 32px

  // Layout sections
  sectionGapSm: spacing[8],   // 32px
  sectionGapMd: spacing[12],  // 48px
  sectionGapLg: spacing[16],  // 64px
  sectionGapXl: spacing[24],  // 96px

  // Container padding
  containerPaddingMobile: spacing[4],   // 16px
  containerPaddingTablet: spacing[6],   // 24px
  containerPaddingDesktop: spacing[8],  // 32px

  // Cards
  cardPaddingSm: spacing[4],  // 16px
  cardPaddingMd: spacing[6],  // 24px
  cardPaddingLg: spacing[8],  // 32px
} as const;

export type Spacing = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
