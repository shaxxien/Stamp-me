import React, { useState } from 'react';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Type,
  FileText,
  X,
  Sliders,
  Eye,
  Save,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Layout,
  Trash2
} from 'lucide-react';
import { ThemeSettings, THEME_PRESETS } from '../types';
import { CANVA_FONT_PRESETS, applyCanvaFonts } from '../utils/canvaFontLoader';

interface DesignEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeSettings;
  onApplyTheme: (theme: ThemeSettings, saveToServer?: boolean, pin?: string) => Promise<void>;
  isOwnerAuthenticated: boolean;
}

export const DesignEditorModal: React.FC<DesignEditorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onApplyTheme,
  isOwnerAuthenticated,
}) => {
  const [theme, setTheme] = useState<ThemeSettings>(currentTheme);
  const [activeTab, setActiveTab] = useState<'canva_layout' | 'typography' | 'palettes' | 'textures' | 'custom'>('canva_layout');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [ownerPinInput, setOwnerPinInput] = useState<string>('');

  // Canva image input states
  const [heroUrlInput, setHeroUrlInput] = useState<string>(theme.customHeroImage || '');
  const [logoUrlInput, setLogoUrlInput] = useState<string>(theme.customLogoImage || '');
  const [watermarkUrlInput, setWatermarkUrlInput] = useState<string>(theme.customWatermarkImage || '');

  // Custom font input states
  const [customHeadingFont, setCustomHeadingFont] = useState<string>(theme.customFontHeading || '');
  const [customBodyFont, setCustomBodyFont] = useState<string>(theme.customFontBody || '');
  const [customFontUrlInput, setCustomFontUrlInput] = useState<string>(theme.customFontUrl || '');

  if (!isOpen) return null;

  const updateAndApply = (updated: ThemeSettings) => {
    setTheme(updated);
    onApplyTheme(updated, false); // Live preview immediately!
    applyCanvaFonts(updated);
  };

  const handleSelectPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      const updated: ThemeSettings = {
        ...preset,
        fontStyle: theme.fontStyle,
        paperTexture: theme.paperTexture,
        stampBorder: theme.stampBorder,
        canvaLayoutMode: theme.canvaLayoutMode,
        customHeroImage: theme.customHeroImage,
        customLogoImage: theme.customLogoImage,
        customWatermarkImage: theme.customWatermarkImage,
        heroImageFit: theme.heroImageFit,
        customFontHeading: theme.customFontHeading,
        customFontBody: theme.customFontBody,
        customFontUrl: theme.customFontUrl,
      };
      updateAndApply(updated);
    }
  };

  const handleLayoutModeChange = (canvaLayoutMode: ThemeSettings['canvaLayoutMode']) => {
    updateAndApply({ ...theme, canvaLayoutMode });
  };

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setHeroUrlInput('');
      updateAndApply({ ...theme, customHeroImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogoUrlInput('');
      updateAndApply({ ...theme, customLogoImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleWatermarkFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setWatermarkUrlInput('');
      updateAndApply({ ...theme, customWatermarkImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSetHeroUrl = (url: string) => {
    setHeroUrlInput(url);
    updateAndApply({ ...theme, customHeroImage: url.trim() || undefined });
  };

  const handleSetLogoUrl = (url: string) => {
    setLogoUrlInput(url);
    updateAndApply({ ...theme, customLogoImage: url.trim() || undefined });
  };

  const handleSetWatermarkUrl = (url: string) => {
    setWatermarkUrlInput(url);
    updateAndApply({ ...theme, customWatermarkImage: url.trim() || undefined });
  };

  const handleClearHeroImage = () => {
    setHeroUrlInput('');
    updateAndApply({ ...theme, customHeroImage: undefined });
  };

  const handleClearLogoImage = () => {
    setLogoUrlInput('');
    updateAndApply({ ...theme, customLogoImage: undefined });
  };

  const handleClearWatermarkImage = () => {
    setWatermarkUrlInput('');
    updateAndApply({ ...theme, customWatermarkImage: undefined });
  };

  const handleFontPresetChange = (fontStyle: ThemeSettings['fontStyle']) => {
    updateAndApply({ ...theme, fontStyle });
  };

  const handleCustomFontApply = () => {
    updateAndApply({
      ...theme,
      fontStyle: 'custom',
      customFontHeading: customHeadingFont.trim() || undefined,
      customFontBody: customBodyFont.trim() || undefined,
      customFontUrl: customFontUrlInput.trim() || undefined,
    });
  };

  const handleTextureChange = (paperTexture: ThemeSettings['paperTexture']) => {
    updateAndApply({ ...theme, paperTexture });
  };

  const handleStampBorderChange = (stampBorder: ThemeSettings['stampBorder']) => {
    updateAndApply({ ...theme, stampBorder });
  };

  const handleCustomColorChange = (key: keyof ThemeSettings, val: string) => {
    updateAndApply({
      ...theme,
      palette: 'custom',
      [key]: val,
    });
  };

  const handleSaveDefault = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const pinToUse = ownerPinInput.trim() || undefined;
      await onApplyTheme(theme, true, pinToUse);
      setSaveMessage('Your Canva layout, fonts & design are saved permanently for all visitors!');
      setTimeout(() => {
        setSaveMessage(null);
        onClose();
      }, 1600);
    } catch (err: any) {
      alert(err.message || 'Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    const defaultTheme = THEME_PRESETS.sage;
    setTheme(defaultTheme);
    setHeroUrlInput('');
    setLogoUrlInput('');
    setWatermarkUrlInput('');
    setCustomHeadingFont('');
    setCustomBodyFont('');
    setCustomFontUrlInput('');
    updateAndApply(defaultTheme);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 space-y-5 border border-[#CFDBCB] shadow-2xl animate-fadeIn my-4 max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E6ECE5] pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3B5337] text-white flex items-center justify-center shadow-xs">
              <Layout className="w-4 h-4 text-[#AAC0A5]" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1D2A20]">
                Canva Layout & Design Studio
              </h3>
              <p className="text-xs text-[#5F8359]">
                Include your custom Canva layout, exported images, posters, and custom typography
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F8359] hover:bg-[#E6ECE5] hover:text-[#1D2A20] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs Bar */}
        <div className="flex flex-wrap border-b border-[#E6ECE5] bg-[#F8FAF7] rounded-xl p-1 text-xs font-medium text-[#4A6945] shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('canva_layout')}
            className={`flex-1 min-w-[120px] py-2 rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'canva_layout'
                ? 'bg-white text-[#1D2A20] font-semibold shadow-xs'
                : 'hover:text-[#1D2A20]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Canva Images & Layout</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('typography')}
            className={`flex-1 min-w-[110px] py-2 rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'typography'
                ? 'bg-white text-[#1D2A20] font-semibold shadow-xs'
                : 'hover:text-[#1D2A20]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Canva & Custom Fonts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('palettes')}
            className={`flex-1 min-w-[100px] py-2 rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'palettes'
                ? 'bg-white text-[#1D2A20] font-semibold shadow-xs'
                : 'hover:text-[#1D2A20]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Green Shades</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('textures')}
            className={`flex-1 min-w-[90px] py-2 rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'textures'
                ? 'bg-white text-[#1D2A20] font-semibold shadow-xs'
                : 'hover:text-[#1D2A20]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paper & Stamps</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 min-w-[90px] py-2 rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-white text-[#1D2A20] font-semibold shadow-xs'
                : 'hover:text-[#1D2A20]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Colors</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-5">
          
          {/* ================= TAB 1: CANVA IMAGES & LAYOUT MODES ================= */}
          {activeTab === 'canva_layout' && (
            <div className="space-y-6 text-xs">
              
              {/* Layout Mode Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="uppercase font-mono tracking-wider text-[#4A6945] font-semibold">
                    1. Choose Website Layout Mode
                  </span>
                  <span className="text-[11px] text-[#5F8359]">How your Canva artwork is showcased</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'split',
                      title: 'Canva Postal Card (Split)',
                      desc: 'Creative narrative on the left, your Canva poster card with floating postal emblem on the right.',
                      badge: 'Recommended',
                    },
                    {
                      id: 'banner',
                      title: 'Canva Panoramic Header Banner',
                      desc: 'Your Canva design spans the full width across the top as a grand widescreen letterhead banner.',
                      badge: 'Widescreen',
                    },
                    {
                      id: 'poster',
                      title: 'Canva Centered Showcase Poster',
                      desc: 'Centered editorial layout showcasing your Canva artwork as the grand centerpiece card.',
                      badge: 'Poster Art',
                    },
                    {
                      id: 'minimal',
                      title: 'Canva Minimalist Letterhead',
                      desc: 'Streamlined compact letterhead emphasizing the letter composer and stamp emblem.',
                      badge: 'Compact',
                    },
                  ].map(lm => {
                    const isSelected = (theme.canvaLayoutMode || 'split') === lm.id;
                    return (
                      <button
                        type="button"
                        key={lm.id}
                        onClick={() => handleLayoutModeChange(lm.id as any)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#3B5337] bg-[#F4F7F4] ring-2 ring-[#3B5337]/20 shadow-xs'
                            : 'border-[#CFDBCB] hover:border-[#81A27B] bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-[#1D2A20]">{lm.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E6ECE5] text-[#3B5337]">
                            {lm.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5F8359] leading-relaxed">
                          {lm.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Canva Hero Graphic Upload / URL */}
              <div className="p-4 rounded-2xl border border-[#CFDBCB] bg-[#F8FAF7] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#3B5337]" />
                    <span className="font-semibold text-sm text-[#1D2A20]">
                      2. Canva Hero Poster / Banner Graphic
                    </span>
                  </div>
                  {theme.customHeroImage && (
                    <button
                      type="button"
                      onClick={handleClearHeroImage}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset to Default</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-[#5F8359] leading-relaxed">
                  Export your Canva design as a PNG or JPG, then upload it directly or paste an image link. It will instantly replace the default laboratory hero image!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Option */}
                  <div className="p-3 bg-white rounded-xl border border-dashed border-[#81A27B] text-center space-y-2">
                    <Upload className="w-5 h-5 mx-auto text-[#4A6945]" />
                    <div>
                      <label
                        htmlFor="canva-hero-upload"
                        className="px-3 py-1.5 bg-[#3B5337] text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-[#2A3A29] inline-block shadow-xs"
                      >
                        Upload Canva File (.png, .jpg)
                      </label>
                      <input
                        id="canva-hero-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleHeroFileUpload}
                        className="hidden"
                      />
                    </div>
                    <span className="text-[10px] text-[#81A27B] block">From your phone or computer</span>
                  </div>

                  {/* Web URL / Canva Link Option */}
                  <div className="p-3 bg-white rounded-xl border border-[#CFDBCB] space-y-1.5 flex flex-col justify-center">
                    <label className="text-[11px] font-medium text-[#4A6945] flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      <span>Or Paste Image URL</span>
                    </label>
                    <input
                      type="url"
                      value={heroUrlInput}
                      onChange={e => handleSetHeroUrl(e.target.value)}
                      placeholder="https://... (e.g. Canva share, Imgur, Postimages)"
                      className="w-full px-2.5 py-1.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-lg text-xs font-mono text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>
                </div>

                {/* Fit and caption controls */}
                <div className="pt-2 border-t border-[#E6ECE5] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#4A6945] font-medium">Image Fit:</span>
                    <button
                      type="button"
                      onClick={() => updateAndApply({ ...theme, heroImageFit: 'cover' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                        (theme.heroImageFit || 'cover') === 'cover'
                          ? 'bg-[#3B5337] text-white'
                          : 'bg-white border border-[#CFDBCB] text-[#1D2A20]'
                      }`}
                    >
                      Fill / Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAndApply({ ...theme, heroImageFit: 'contain' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                        theme.heroImageFit === 'contain'
                          ? 'bg-[#3B5337] text-white'
                          : 'bg-white border border-[#CFDBCB] text-[#1D2A20]'
                      }`}
                    >
                      Show Full (Contain)
                    </button>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      value={theme.heroImageCaption || ''}
                      onChange={e => updateAndApply({ ...theme, heroImageCaption: e.target.value })}
                      placeholder="Optional caption / postmark note..."
                      className="w-full px-2.5 py-1 bg-white border border-[#CFDBCB] rounded text-[11px] text-[#1D2A20]"
                    />
                  </div>
                </div>

                {/* Hero Preview Thumbnail */}
                {theme.customHeroImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg border overflow-hidden bg-white shrink-0">
                      <img src={theme.customHeroImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Custom Canva graphic active and applied on screen</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Custom Canva Stamp Emblem / Logo */}
              <div className="p-4 rounded-2xl border border-[#CFDBCB] bg-[#F8FAF7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#3B5337]" />
                    <span className="font-semibold text-sm text-[#1D2A20]">
                      3. Canva Stamp Emblem / Class Logo
                    </span>
                  </div>
                  {theme.customLogoImage && (
                    <button
                      type="button"
                      onClick={handleClearLogoImage}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-dashed border-[#81A27B] text-center space-y-2">
                    <label
                      htmlFor="canva-logo-upload"
                      className="px-3 py-1.5 bg-[#4A6945] text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-[#2A3A29] inline-block shadow-xs"
                    >
                      Upload Emblem / Seal Logo
                    </label>
                    <input
                      id="canva-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#CFDBCB] space-y-1.5 flex flex-col justify-center">
                    <input
                      type="url"
                      value={logoUrlInput}
                      onChange={e => handleSetLogoUrl(e.target.value)}
                      placeholder="Paste Logo URL..."
                      className="w-full px-2.5 py-1.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-lg text-xs font-mono text-[#1D2A20] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Background Watermark */}
              <div className="p-4 rounded-2xl border border-[#CFDBCB] bg-[#F8FAF7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-[#3B5337]" />
                    <span className="font-semibold text-sm text-[#1D2A20]">
                      4. Canva Subtle Background Pattern / Watermark
                    </span>
                  </div>
                  {theme.customWatermarkImage && (
                    <button
                      type="button"
                      onClick={handleClearWatermarkImage}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-dashed border-[#81A27B] text-center space-y-2">
                    <label
                      htmlFor="canva-watermark-upload"
                      className="px-3 py-1.5 bg-[#5F8359] text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-[#2A3A29] inline-block shadow-xs"
                    >
                      Upload Background Pattern
                    </label>
                    <input
                      id="canva-watermark-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleWatermarkFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#CFDBCB] space-y-1.5 flex flex-col justify-center">
                    <input
                      type="url"
                      value={watermarkUrlInput}
                      onChange={e => handleSetWatermarkUrl(e.target.value)}
                      placeholder="Paste Watermark URL..."
                      className="w-full px-2.5 py-1.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-lg text-xs font-mono text-[#1D2A20] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: CANVA & CUSTOM FONTS ================= */}
          {activeTab === 'typography' && (
            <div className="space-y-5 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="uppercase font-mono tracking-wider text-[#4A6945] font-semibold">
                  Curated Canva Typography Pairings
                </span>
                <span className="text-[11px] text-[#5F8359]">Changes apply instantly</span>
              </div>

              {/* Predefined Canva font options */}
              <div className="space-y-2.5">
                {CANVA_FONT_PRESETS.map(preset => {
                  const isSelected = theme.fontStyle === preset.id;
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => handleFontPresetChange(preset.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#3B5337] bg-[#F4F7F4] ring-2 ring-[#3B5337]/20 shadow-xs'
                          : 'border-[#CFDBCB] hover:border-[#81A27B] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-[#1D2A20]">{preset.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6ECE5] text-[#3B5337]">
                            {preset.designerTag}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#3B5337]" />}
                        </div>
                      </div>
                      <p
                        className="text-sm text-[#2A3A29] italic mt-1"
                        style={{ fontFamily: preset.headingFont }}
                      >
                        "{preset.previewSample}"
                      </p>
                      <span className="text-[10px] text-[#5F8359] block mt-1 font-mono">
                        Headings: {preset.headingFont.replace(/"/g, '')} · Body: {preset.bodyFont.replace(/"/g, '')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* CUSTOM CANVA FONT INPUT */}
              <div className="p-4 rounded-2xl border border-[#CFDBCB] bg-[#F8FAF7] space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#3B5337]" />
                  <span className="font-semibold text-sm text-[#1D2A20]">
                    Include Any Custom Font From Canva or Google Fonts
                  </span>
                </div>

                <p className="text-[11px] text-[#5F8359] leading-relaxed">
                  Type the exact font name you used in Canva (e.g. <strong className="text-[#1D2A20]">League Spartan</strong>, <strong className="text-[#1D2A20]">Montserrat</strong>, <strong className="text-[#1D2A20]">Cinzel</strong>, <strong className="text-[#1D2A20]">Alex Brush</strong>, <strong className="text-[#1D2A20]">Lora</strong>, <strong className="text-[#1D2A20]">Baskerville</strong>, <strong className="text-[#1D2A20]">Caveat</strong>). Google Fonts will load it automatically into the website!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#4A6945]">
                      Heading Font Name (from Canva)
                    </label>
                    <input
                      type="text"
                      value={customHeadingFont}
                      onChange={e => setCustomHeadingFont(e.target.value)}
                      placeholder="e.g. League Spartan, Montserrat, Tan Pearl"
                      className="w-full px-3 py-2 bg-white border border-[#CFDBCB] rounded-xl text-xs text-[#1D2A20] font-medium focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#4A6945]">
                      Body Font Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customBodyFont}
                      onChange={e => setCustomBodyFont(e.target.value)}
                      placeholder="e.g. Glacial Indifference, Inter, Lato"
                      className="w-full px-3 py-2 bg-white border border-[#CFDBCB] rounded-xl text-xs text-[#1D2A20] font-medium focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#4A6945]">
                    Font URL / Google Fonts link (Optional)
                  </label>
                  <input
                    type="url"
                    value={customFontUrlInput}
                    onChange={e => setCustomFontUrlInput(e.target.value)}
                    placeholder="https://fonts.googleapis.com/css2?family=... (Optional if font name is on Google Fonts)"
                    className="w-full px-3 py-2 bg-white border border-[#CFDBCB] rounded-xl text-xs font-mono text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCustomFontApply}
                  className="px-4 py-2 bg-[#3B5337] hover:bg-[#2A3A29] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#AAC0A5]" />
                  <span>Apply Custom Font</span>
                </button>
              </div>

            </div>
          )}

          {/* ================= TAB 3: GREEN PALETTES ================= */}
          {activeTab === 'palettes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-[#4A6945]">
                  Select A Curated MedTech Green Shade
                </span>
                <span className="text-[11px] text-[#5F8359]">Changes apply instantly on screen</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'sage',
                    title: 'Botanical Lab Sage (Original)',
                    desc: 'Calm eucalyptus sage green with crisp white letter parchment.',
                    primary: '#3B5337',
                    dark: '#2A3A29',
                    bg: '#F8FAF7',
                  },
                  {
                    key: 'emerald',
                    title: 'Clinical Emerald',
                    desc: 'Vibrant clinical hospital green with clean sterile laboratory tones.',
                    primary: '#235338',
                    dark: '#183B28',
                    bg: '#F4F9F5',
                  },
                  {
                    key: 'mint',
                    title: 'Eucalyptus Mint',
                    desc: 'Refreshing cool mint and teal tones for a modern scientific feel.',
                    primary: '#2D6A56',
                    dark: '#1E473A',
                    bg: '#F2FAF7',
                  },
                  {
                    key: 'olive',
                    title: 'Olive Herbarium',
                    desc: 'Warm earthy olive green with vintage botanical academy paper.',
                    primary: '#4A5328',
                    dark: '#353C1C',
                    bg: '#FAF9F4',
                  },
                  {
                    key: 'nightshift',
                    title: 'Nightshift Graveyard (Dark Green)',
                    desc: 'Deep obsidian and phosphor green for late night hospital shifts.',
                    primary: '#529E72',
                    dark: '#183624',
                    bg: '#111A14',
                  },
                ].map(preset => {
                  const isSelected = theme.palette === preset.key;
                  return (
                    <button
                      type="button"
                      key={preset.key}
                      onClick={() => handleSelectPreset(preset.key)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#3B5337] ring-2 ring-[#3B5337]/20 bg-[#F4F7F4] shadow-sm'
                          : 'border-[#CFDBCB] hover:border-[#81A27B] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-xs -ml-2"
                            style={{ backgroundColor: preset.dark }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-xs -ml-2"
                            style={{ backgroundColor: preset.bg }}
                          />
                        </div>
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-[#3B5337] text-white">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-[#1D2A20]">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-[#5F8359] mt-0.5 leading-relaxed">
                        {preset.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 4: PAPER & STAMPS ================= */}
          {activeTab === 'textures' && (
            <div className="space-y-5 text-xs">
              <div className="space-y-2">
                <span className="block uppercase font-mono tracking-wider text-[#4A6945]">
                  Letter Paper Writing Surface
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTextureChange('ruled')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme.paperTexture === 'ruled'
                        ? 'border-[#3B5337] bg-[#F4F7F4] ring-1 ring-[#3B5337]'
                        : 'border-[#CFDBCB] hover:border-[#81A27B] bg-white'
                    }`}
                  >
                    <span className="font-serif font-bold text-sm text-[#1D2A20] block">
                      Ruled Notebook Paper
                    </span>
                    <span className="text-[11px] text-[#5F8359] mt-1 block">
                      Subtle horizontal notebook lines simulating laboratory bench logbooks.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTextureChange('blank')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme.paperTexture === 'blank'
                        ? 'border-[#3B5337] bg-[#F4F7F4] ring-1 ring-[#3B5337]'
                        : 'border-[#CFDBCB] hover:border-[#81A27B] bg-white'
                    }`}
                  >
                    <span className="font-serif font-bold text-sm text-[#1D2A20] block">
                      Pristine Blank Linen
                    </span>
                    <span className="text-[11px] text-[#5F8359] mt-1 block">
                      Smooth minimalist stationery without ruled line markings.
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E6ECE5]">
                <span className="block uppercase font-mono tracking-wider text-[#4A6945]">
                  Physical Stamp Serration Style
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'perforated', name: 'Perforated Teeth', desc: 'Classic scalloped stamp teeth' },
                    { id: 'minimal', name: 'Minimalist Clean', desc: 'Sleek modern hairline border' },
                    { id: 'vintage', name: 'Vintage Postal Seal', desc: 'Dashed postal cancellation' },
                  ].map(sb => {
                    const isSelected = theme.stampBorder === sb.id;
                    return (
                      <button
                        type="button"
                        key={sb.id}
                        onClick={() => handleStampBorderChange(sb.id as any)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#3B5337] bg-[#F4F7F4] ring-1 ring-[#3B5337]'
                            : 'border-[#CFDBCB] hover:border-[#81A27B] bg-white'
                        }`}
                      >
                        <span className="font-semibold text-xs text-[#1D2A20] block">
                          {sb.name}
                        </span>
                        <span className="text-[10px] text-[#5F8359] mt-0.5 block">
                          {sb.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: CUSTOM COLORS ================= */}
          {activeTab === 'custom' && (
            <div className="space-y-4 text-xs">
              <span className="block uppercase font-mono tracking-wider text-[#4A6945]">
                Custom Hex Color Pickers
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1.5">
                  <label className="block font-medium text-[#1D2A20]">Primary Brand Green</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={e => handleCustomColorChange('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-[#CFDBCB]"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={e => handleCustomColorChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#CFDBCB] rounded-lg font-mono text-xs text-[#1D2A20]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1.5">
                  <label className="block font-medium text-[#1D2A20]">Dark Accent / Header</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.primaryDark}
                      onChange={e => handleCustomColorChange('primaryDark', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-[#CFDBCB]"
                    />
                    <input
                      type="text"
                      value={theme.primaryDark}
                      onChange={e => handleCustomColorChange('primaryDark', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#CFDBCB] rounded-lg font-mono text-xs text-[#1D2A20]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1.5">
                  <label className="block font-medium text-[#1D2A20]">Page Background Canvas</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.bgColor}
                      onChange={e => handleCustomColorChange('bgColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-[#CFDBCB]"
                    />
                    <input
                      type="text"
                      value={theme.bgColor}
                      onChange={e => handleCustomColorChange('bgColor', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#CFDBCB] rounded-lg font-mono text-xs text-[#1D2A20]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1.5">
                  <label className="block font-medium text-[#1D2A20]">Card & Desk Surface</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.cardColor}
                      onChange={e => handleCustomColorChange('cardColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-[#CFDBCB]"
                    />
                    <input
                      type="text"
                      value={theme.cardColor}
                      onChange={e => handleCustomColorChange('cardColor', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#CFDBCB] rounded-lg font-mono text-xs text-[#1D2A20]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Live Preview Bar */}
        <div className="p-3 rounded-2xl border border-[#CFDBCB] bg-[#F8FAF7] flex flex-wrap items-center justify-between text-xs text-[#5F8359] gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#3B5337]" />
            <span>
              Layout: <strong className="text-[#1D2A20] uppercase font-mono">{theme.canvaLayoutMode || 'split'}</strong> · Font:{' '}
              <strong className="text-[#1D2A20]">{theme.customFontHeading || theme.fontStyle}</strong> · Palette:{' '}
              <strong className="text-[#1D2A20] uppercase font-mono">{theme.palette}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[#4A6945] hover:text-[#1D2A20] underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All to Default</span>
          </button>
        </div>

        {saveMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-medium border border-emerald-200">
            {saveMessage}
          </div>
        )}

        {/* Modal Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E6ECE5] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#4A6945] hover:text-[#1D2A20] cursor-pointer text-center"
          >
            Close & Keep Live Look
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {!isOwnerAuthenticated && (
              <input
                type="password"
                value={ownerPinInput}
                onChange={e => setOwnerPinInput(e.target.value)}
                placeholder="Desk PIN (e.g. medtech123)"
                className="px-3 py-2 text-xs bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl font-mono text-center text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                title="Enter recipient desk PIN to save this theme permanently for all future visitors"
              />
            )}

            <button
              type="button"
              onClick={handleSaveDefault}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5 text-[#AAC0A5]" />
              <span>{isSaving ? 'Saving Layout & Theme...' : 'Save Design for All Visitors'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
