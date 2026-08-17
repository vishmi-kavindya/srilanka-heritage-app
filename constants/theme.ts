// ═══════════════════════════════════════════════════════════
//  Pearl Explorer Web — Brand Color Palette System
// ═══════════════════════════════════════════════════════════

export const Colors = {
  // Core Brand Tokens (Matching Official Pearl Explorer Logo)
  primary: '#008C95',       // Deep Teal (Main Brand Color)
  primaryHover: '#006F76',  // Hover Deep Teal
  secondary: '#19A974',     // Tropical Green (Nature/Category Tags)
  accent: '#F58220',        // Sunset Orange (CTA & Important Actions)
  highlight: '#6956D8',     // Purple (Special Highlights & AI Features)
  textDark: '#3B2F2F',      // Deep Brown (Primary Text & Headings)
  bgWarm: '#FFFDF7',        // Warm Cream (Main Web Page Background)
  cardBg: '#FFFFFF',        // White Cards & Containers
  softTeal: '#E8F7F5',      // Soft Teal Section Background
  footerBg: '#3B2F2F',      // Deep Brown Footer Background

  // Direct Name Aliases
  teal: '#008C95',
  tealSoft: '#E8F7F5',
  orange: '#F58220',
  green: '#19A974',
  purple: '#6956D8',
  brown: '#3B2F2F',
  cream: '#FFFDF7',

  // Legacy Theme Aliases (Mapped to New Pearl Explorer Brand Colors)
  saffron: '#F58220',
  coral: '#F58220',
  emerald: '#19A974',
  emeraldLight: '#19A974',
  sapphire: '#008C95',
  amethyst: '#6956D8',
  royal: '#008C95',
  bgDark: '#3B2F2F',
  bgCard: '#FFFFFF',
  bgCardLight: '#E8F7F5',
  surface: '#FFFFFF',
  temple: '#B85D19',

  // Text Tokens
  textPrimary: '#3B2F2F',
  textSecondary: '#625858',
  textMuted: '#8C8282',
  textLight: '#FFFFFF',

  // Status Colors
  success: '#19A974',
  warning: '#F58220',
  error: '#E53E3E',
  info: '#008C95',

  // Borders & Dividers
  border: '#E2E8F0',
  borderTeal: 'rgba(0, 140, 149, 0.25)',
  borderOrange: 'rgba(245, 130, 32, 0.3)',
  overlay: 'rgba(59, 47, 47, 0.65)',

  // Brand Gradients
  gradGuide: ['#008C95', '#006F76'],
  gradMap: ['#19A974', '#128258'],
  gradAI: ['#6956D8', '#4E3DB5'],
  gradTransport: ['#F58220', '#D96E14'],
  gradUtils: ['#008C95', '#19A974'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 100,
};

export const Shadow = {
  card: {
    shadowColor: '#3B2F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  }),
};
