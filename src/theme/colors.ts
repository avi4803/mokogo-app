export const colors = {
  light: {
    background: '#FDFBF7',        // Warm Hearth Canvas
    cardBackground: '#FFFFFF',    // Card Base
    textPrimary: '#2C2523',       // Espresso
    textSecondary: '#6B625F',     // Muted Espresso/Gray
    brand: '#D46A43',             // Terracotta Accent
    brandLight: '#FDF0EC',        // Very soft brand tint
    accent: '#5F7367',            // Sage Green Accent
    accentLight: '#E2ECE9',       // Light Sage Mist
    border: '#E8E3DA',            // Warm Sand Border
    highlightBg: '#FFFBE6',       // Soft Yellow/Cream Highlight for price
    highlightText: '#8A6D00',     // Dark Golden/Yellow Text
    shadow: '#2C2523',            // Dark Espresso for shadows
    white: '#FFFFFF',             // Absolute White
    heartActive: '#E53935',       // Active Favorite Heart
    heartInactive: '#2C2523',     // Inactive Favorite Outline
    tagBg: '#FFFFFF',             // Overlay badge background
    outlinePillBorder: '#ECEAE4', // Outline border for details pills
    iconTint: '#6B625F',          // Muted icons color
  },
  dark: {
    background: '#1A1615',        // Dark Charcoal/Warm Dark
    cardBackground: '#26201E',    // Dark Card Base
    textPrimary: '#F5ECE9',       // Off-white/Cream Text
    textSecondary: '#A89E9A',     // Muted Gray-Cream
    brand: '#E5835C',             // Brighter Terracotta
    brandLight: '#3D251D',        // Dark Terracotta tint
    accent: '#83988C',            // Muted Sage Green
    accentLight: '#2C3A35',       // Dark Sage Mist
    border: '#3D3431',            // Dark Sand Border
    highlightBg: '#3D341F',       // Dark Yellow Highlight
    highlightText: '#FFD54F',     // Bright Golden Text
    shadow: '#000000',            // Black shadow
    white: '#FFFFFF',             // Absolute White
    heartActive: '#EF5350',       // Active Favorite Heart
    heartInactive: '#F5ECE9',     // Inactive Favorite Outline
    tagBg: '#3D3431',             // Overlay badge background
    outlinePillBorder: '#3D3431', // Outline border for details pills
    iconTint: '#A89E9A',          // Muted icons color
  }
};

export type ThemeColors = typeof colors.light;

// Active theme helper (defaults to light mode, extensible)
export const theme = colors.light;
