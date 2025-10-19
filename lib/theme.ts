/**
 * Theme utilities for handling brand colors and contrast
 */

/**
 * Calculate the relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Get the appropriate text color (black or white) for a given background color
 * Returns the color that provides the best contrast ratio (≥4.5:1)
 */
export function getContrastTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}

/**
 * Get CSS custom properties for a brand color theme
 */
export function getBrandColorTheme(brandColor: string) {
  const textColor = getContrastTextColor(brandColor);
  
  return {
    '--brand-color': brandColor,
    '--brand-text': textColor,
    '--brand-hover': adjustBrightness(brandColor, -10),
    '--brand-active': adjustBrightness(brandColor, -20),
  } as React.CSSProperties;
}

/**
 * Adjust brightness of a hex color
 */
function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const factor = percent / 100;
  
  const newR = Math.max(0, Math.min(255, r + (255 - r) * factor));
  const newG = Math.max(0, Math.min(255, g + (255 - g) * factor));
  const newB = Math.max(0, Math.min(255, b + (255 - b) * factor));
  
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

/**
 * Get focus ring color that works on both light and dark backgrounds
 */
export function getFocusRingColor(brandColor: string): string {
  const rgb = hexToRgb(brandColor);
  if (!rgb) return '#3b82f6'; // fallback to blue
  
  const { r, g, b } = rgb;
  const luminance = getLuminance(r, g, b);
  
  // If the brand color is dark, use a lighter version for focus ring
  // If it's light, use a darker version
  return luminance > 0.5 ? adjustBrightness(brandColor, -30) : adjustBrightness(brandColor, 30);
}
