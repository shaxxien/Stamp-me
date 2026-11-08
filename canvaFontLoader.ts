/**
 * Utility to dynamically inject and apply Canva fonts & custom typography
 */

import { ThemeSettings } from '../types';

export interface CanvaFontPreset {
  id: ThemeSettings['fontStyle'];
  name: string;
  designerTag: string;
  headingFont: string;
  bodyFont: string;
  googleFontUrl?: string;
  previewSample: string;
}

export const CANVA_FONT_PRESETS: CanvaFontPreset[] = [
  {
    id: 'editorial',
    name: 'Editorial Philatelic (Default)',
    designerTag: 'Canva Literary Archive',
    headingFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    previewSample: 'Where unspoken thoughts find quiet passage.',
  },
  {
    id: 'canva_spartan',
    name: 'League Spartan · Modern Canva Aesthetic',
    designerTag: 'Canva Modern Bold',
    headingFont: '"League Spartan", sans-serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=League+Spartan:wght@500;700;800;900&display=swap',
    previewSample: 'Bold architectural laboratory clarity & poise.',
  },
  {
    id: 'canva_cinzel',
    name: 'Cinzel · Roman Royal Philatelic',
    designerTag: 'Canva Luxury & Diploma',
    headingFont: '"Cinzel", serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&display=swap',
    previewSample: 'The Sacred Oath of the Clinical Laboratory.',
  },
  {
    id: 'canva_script',
    name: 'Caveat · Canva Handwritten Journal',
    designerTag: 'Canva Personal Letter',
    headingFont: '"Caveat", cursive',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap',
    previewSample: 'A handwritten confession folded inside a scrub pocket.',
  },
  {
    id: 'modern',
    name: 'Clean Clinical Sans',
    designerTag: 'Canva Minimalist Tech',
    headingFont: '"Plus Jakarta Sans", sans-serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    previewSample: 'Sterile laboratory diagnostics & specimen records.',
  },
  {
    id: 'vintage',
    name: 'Botanical Herbarium Italic',
    designerTag: 'Canva Vintage Academy',
    headingFont: '"Cormorant Garamond", serif',
    bodyFont: 'Georgia, serif',
    previewSample: 'Archival notes pressed between microscopic slides.',
  },
  {
    id: 'classic',
    name: 'Playfair Display · Formal Academic',
    designerTag: 'Canva Academic Editorial',
    headingFont: '"Playfair Display", serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap',
    previewSample: 'Dispatches from the specimen counter.',
  },
];

/**
 * Injects or updates dynamic Google font / web font links into document.head
 */
export function applyCanvaFonts(theme: ThemeSettings) {
  if (typeof document === 'undefined') return;

  const fontStyle = theme.fontStyle;
  const linkId = 'bridge-canva-font-link';
  const styleId = 'bridge-canva-font-style';

  let fontUrlToLoad: string | null = null;
  let headingFamily = '"Cormorant Garamond", Georgia, serif';
  let bodyFamily = '"Plus Jakarta Sans", system-ui, sans-serif';

  // Check preset
  const preset = CANVA_FONT_PRESETS.find(p => p.id === fontStyle);
  if (preset) {
    headingFamily = preset.headingFont;
    bodyFamily = preset.bodyFont;
    if (preset.googleFontUrl) {
      fontUrlToLoad = preset.googleFontUrl;
    }
  }

  // Check custom user font
  if (fontStyle === 'custom' || theme.customFontHeading) {
    if (theme.customFontHeading) {
      headingFamily = `"${theme.customFontHeading.trim()}", serif, sans-serif`;
    }
    if (theme.customFontBody) {
      bodyFamily = `"${theme.customFontBody.trim()}", sans-serif`;
    }

    if (theme.customFontUrl && theme.customFontUrl.trim().startsWith('http')) {
      fontUrlToLoad = theme.customFontUrl.trim();
    } else if (theme.customFontHeading) {
      // Auto-generate Google Font URL for the font name
      const cleanFontName = theme.customFontHeading.trim().replace(/['"]/g, '');
      const encoded = encodeURIComponent(cleanFontName).replace(/%20/g, '+');
      fontUrlToLoad = `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
    }
  }

  // Load font link if needed
  let existingLink = document.getElementById(linkId) as HTMLLinkElement | null;
  if (fontUrlToLoad) {
    if (!existingLink) {
      existingLink = document.createElement('link');
      existingLink.id = linkId;
      existingLink.rel = 'stylesheet';
      document.head.appendChild(existingLink);
    }
    if (existingLink.href !== fontUrlToLoad) {
      existingLink.href = fontUrlToLoad;
    }
  } else if (existingLink) {
    existingLink.remove();
  }

  // Inject CSS overrides
  let existingStyle = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!existingStyle) {
    existingStyle = document.createElement('style');
    existingStyle.id = styleId;
    document.head.appendChild(existingStyle);
  }

  existingStyle.textContent = `
    :root {
      --font-serif: ${headingFamily} !important;
      --font-sans: ${bodyFamily} !important;
    }
    .font-serif, h1, h2, h3, .canva-heading {
      font-family: ${headingFamily} !important;
    }
    body, .font-sans {
      font-family: ${bodyFamily} !important;
    }
  `;
}
