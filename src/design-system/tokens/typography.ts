/**
 * Design System v3.0 - Typography Tokens
 * Sistema tipográfico moderno e escalável
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: [
      'Inter var',
      'SF Pro Display',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(', '),
    
    display: [
      'Manrope',
      'Inter var',
      'system-ui',
      'sans-serif',
    ].join(', '),
    
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'Consolas',
      'Monaco',
      'monospace',
    ].join(', '),
  },

  // Font Sizes (rem based, 16px = 1rem)
  fontSize: {
    // Display - Hero text
    'display-2xl': '4.5rem',    // 72px
    'display-xl': '3.75rem',    // 60px
    'display-lg': '3rem',       // 48px

    // Headings
    '5xl': '2.5rem',    // 40px - H1
    '4xl': '2rem',      // 32px - H2
    '3xl': '1.75rem',   // 28px - H3
    '2xl': '1.5rem',    // 24px - H4
    'xl': '1.25rem',    // 20px - H5
    'lg': '1.125rem',   // 18px - H6

    // Body
    'base': '1rem',       // 16px - Normal
    'sm': '0.875rem',     // 14px - Small
    'xs': '0.75rem',      // 12px - Extra small
    '2xs': '0.6875rem',   // 11px - Tiny
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Predefined text styles para componentes comuns
export const textStyles = {
  // Display
  displayLarge: {
    fontSize: typography.fontSize['display-lg'],
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tighter,
  },

  // Headings
  h1: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  
  h2: {
    fontSize: typography.fontSize['4xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  
  h3: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },
  
  h4: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },
  
  h5: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
  
  h6: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },

  // Body
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },

  // Special
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.wide,
  },
  
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  
  overline: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
  
  code: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
  },
} as const;

export type Typography = typeof typography;
export type TextStyles = typeof textStyles;
