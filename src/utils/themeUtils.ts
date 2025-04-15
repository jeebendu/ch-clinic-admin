
/**
 * Theme utilities for the application
 */

export type ColorPalette = {
  primary: string;
  secondary: string;
  tertiary: string;
  light: string;
  dark: string;
};

// Generate a color palette based on a main color
export const generateColorPalette = (mainColor: string): ColorPalette => {
  // Convert hex to RGB
  const r = parseInt(mainColor.slice(1, 3), 16);
  const g = parseInt(mainColor.slice(3, 5), 16);
  const b = parseInt(mainColor.slice(5, 7), 16);
  
  // Generate secondary color (slightly darker)
  const darkenPercent = 0.15;
  const secondaryR = Math.max(0, Math.floor(r * (1 - darkenPercent)));
  const secondaryG = Math.max(0, Math.floor(g * (1 - darkenPercent)));
  const secondaryB = Math.max(0, Math.floor(b * (1 - darkenPercent)));
  
  // Generate tertiary color (even darker)
  const darkerPercent = 0.25;
  const tertiaryR = Math.max(0, Math.floor(r * (1 - darkerPercent)));
  const tertiaryG = Math.max(0, Math.floor(g * (1 - darkerPercent)));
  const tertiaryB = Math.max(0, Math.floor(b * (1 - darkerPercent)));
  
  // Generate light color (much lighter)
  const lightenPercent = 0.7;
  const lightR = Math.min(255, Math.floor(r + (255 - r) * lightenPercent));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * lightenPercent));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * lightenPercent));
  
  // Convert back to hex
  const secondaryColor = `#${secondaryR.toString(16).padStart(2, '0')}${secondaryG.toString(16).padStart(2, '0')}${secondaryB.toString(16).padStart(2, '0')}`;
  const tertiaryColor = `#${tertiaryR.toString(16).padStart(2, '0')}${tertiaryG.toString(16).padStart(2, '0')}${tertiaryB.toString(16).padStart(2, '0')}`;
  const lightColor = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  
  return {
    primary: mainColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    light: lightColor,
    dark: "#1A1F2C", // Keep dark color constant
  };
};

// Update CSS variables with new color values
export const updateCSSVariables = (colors: ColorPalette): void => {
  // Get the HSL values for the primary color
  const primaryRgb = hexToRgb(colors.primary);
  const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  
  // Update CSS variables for the theme
  const root = document.documentElement;
  root.style.setProperty('--primary', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  root.style.setProperty('--ring', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  root.style.setProperty('--sidebar-primary', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  root.style.setProperty('--sidebar-ring', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  
  // Update --brand-primary and related vars in :root
  root.style.setProperty('--brand-primary', colors.primary);
  root.style.setProperty('--brand-secondary', colors.secondary);
  root.style.setProperty('--brand-tertiary', colors.tertiary);
  root.style.setProperty('--brand-light', colors.light);
  
  // Also update clinic colors
  root.style.setProperty('--clinic-primary', colors.primary);
  root.style.setProperty('--clinic-secondary', colors.secondary);
  root.style.setProperty('--clinic-accent', colors.light);
  root.style.setProperty('--clinic-light', lightenColor(colors.light));
};

// Helper function to convert hex to RGB
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Helper function to convert RGB to HSL
export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { 
    h: h * 360, 
    s: s * 100, 
    l: l * 100 
  };
};

// Helper function to further lighten a color
export const lightenColor = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor);
  const lightenPercent = 0.5;
  const lightR = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * lightenPercent));
  const lightG = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * lightenPercent));
  const lightB = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * lightenPercent));
  
  return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
};

// Load and apply theme from localStorage
export const loadSavedTheme = (): void => {
  const savedTheme = localStorage.getItem('themeColor');
  if (savedTheme) {
    const colorPalette = generateColorPalette(savedTheme);
    updateCSSVariables(colorPalette);
  } else {
    // Apply default theme
    const defaultTheme = "#00b8ab";
    const colorPalette = generateColorPalette(defaultTheme);
    updateCSSVariables(colorPalette);
  }
};
