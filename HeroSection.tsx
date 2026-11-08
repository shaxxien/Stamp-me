import React from 'react';
import { Send, KeyRound, Sparkles, BookOpen, Share2 } from 'lucide-react';
import { PublicBridgeStats, ThemeSettings } from '../types';

interface HeroSectionProps {
  onStartWriting: () => void;
  onCheckStamp: () => void;
  onReadPurpose: () => void;
  onOpenShareModal: () => void;
  stats?: PublicBridgeStats | null;
  theme?: ThemeSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartWriting,
  onCheckStamp,
  onReadPurpose,
  onOpenShareModal,
  stats,
  theme,
}) => {
  const activeTheme = theme || stats?.theme;
  const layoutMode = activeTheme?.canvaLayoutMode || 'split';
  const heroImage =
    activeTheme?.customHeroImage ||
    '/src/assets/images/stamp_bridge_hero_1794060824028.jpg';
  const emblemImage =
    activeTheme?.customLogoImage ||
    '/src/assets/images/stamp_bridge_emblem_1794060823339.jpg';
  const imageFit = activeTheme?.heroImageFit || 'cover';
  const imageCaption =
    activeTheme?.heroImageCaption || 'Postmark: Specimen Desk & Intern Quarters';

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-18 border-b border-[#E6ECE5]">
      {/* Background gentle watermark glow in sage tones */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CFDBCB]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-[#E6ECE5]/60 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Optional custom Canva watermark / background */}
      {activeTheme?.customWatermarkImage && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none -z-10 bg-repeat bg-center"
          style={{ backgroundImage: `url(${activeTheme.customWatermarkImage})` }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= LAYOUT VARIANT 1: PANORAMIC BANNER ================= */}
        {layoutMode === 'banner' && (
          <div className="space-y-8">
            {/* Canva Grand Banner Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-md border-4 border-white bg-white group">
              <img
                src={heroImage}
                alt="Canva Banner Layout for The Stamp Bridge"
                className={`w-full h-56 sm:h-72 md:h-84 object-center transition-transform duration-500 group-hover:scale-[1.01] ${
                  imageFit === 'contain' ? 'object-contain bg-[#F8FAF7]' : 'object-cover'
                }`}
                referrerPolicy="no-referrer"
              />
              <div className="p-3 bg-white border-t border-[#E6ECE5] flex items-center justify-between text-xs text-[#31432E]">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic font-medium">Postmark:</span>
                  <span>{imageCaption}</span>
                </div>
                <span className="text-[11px] font-mono text-[#5F8359]">CANVA ARTWORK BANNER</span>
              </div>
            </div>

            {/* Narrative & Actions underneath banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#4A6945] tracking-wide">
                  <span>Medical Technology Postal Haven</span>
                  <span aria-hidden="true">·</span>
                  <span>100% Anonymous Letters</span>
                  <span aria-hidden="true">·</span>
                  <span>Private Replies</span>
                </div>

                <div className="space-y-2">
                  <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#1D2A20] leading-[1.1]">
                    {stats?.siteHeadline || 'The stamp bridge'}
                  </h1>
                  <p className="font-serif italic text-base sm:text-lg text-[#4A6945]">
                    {stats?.siteSubtitle || 'Where unspoken thoughts from the laboratory find quiet passage.'}
                  </p>
                </div>

                <div className="space-y-3 text-[#31432E] text-sm sm:text-base leading-relaxed font-light">
                  <p>
                    {stats?.heroIntro ||
                      'Behind every centrifuge spin, emergency blood crossmatch, and late-night slide differential, Medical Technology students shoulder an immense, invisible burden. From trembling hands during first phlebotomies to the quiet dread of board exam preparation, much of what you feel remains unspoken in the laboratory ward.'}
                  </p>
                  <p className="border-l-2 border-[#5F8359] pl-4 italic text-[#2A3A29] bg-[#F4F7F4]/80 py-2 rounded-r-md">
                    <strong className="font-serif not-italic font-semibold text-[#1D2A20]">The Purpose:</strong>{' '}
                    {stats?.purposeText ||
                      'The Stamp Bridge is an intimate, anonymous sanctuary built exclusively for MedTech students. Drop an anonymous stamp with your honest confessions, duty vents, or questions. You are issued a private Secret Retrieval Code so only you can return and read the personal reply waiting for you on the other side.'}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onStartWriting}
                    className="px-6 py-3 text-sm font-medium text-white bg-[#2A3A29] hover:bg-[#1D2A20] rounded-xl shadow-xs transition-all duration-200 flex items-center gap-2.5 cursor-pointer hover:translate-y-[-1px]"
                  >
                    <Send className="w-4 h-4 text-[#AAC0A5]" />
                    <span>Write an Anonymous Stamp</span>
                  </button>

                  <button
                    onClick={onCheckStamp}
                    className="px-5 py-3 text-sm font-medium text-[#2A3A29] bg-white hover:bg-[#F4F7F4] border border-[#CFDBCB] rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[#5F8359]" />
                    <span>Check My Stamp & Reply</span>
                  </button>

                  <button
                    onClick={onOpenShareModal}
                    className="px-4 py-3 text-sm font-medium text-[#3B5337] bg-[#F4F7F4] hover:bg-[#E6ECE5] border border-[#CFDBCB] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#5F8359]" />
                    <span>Lifetime Link</span>
                  </button>

                  <button
                    onClick={onReadPurpose}
                    className="px-4 py-3 text-sm font-medium text-[#4A6945] hover:text-[#1D2A20] transition-colors flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>The Story</span>
                  </button>
                </div>
              </div>

              {/* Counters side column */}
              <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-[#CFDBCB] space-y-4">
                <div className="flex items-center gap-3">
                  <img src={emblemImage} alt="Emblem" className="w-12 h-12 rounded-lg object-cover border border-[#CFDBCB]" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#1D2A20]">The Stamp Bridge</h4>
                    <p className="text-[11px] text-[#5F8359]">MedTech Postal Registry</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-[#E6ECE5] text-xs text-[#4A6945]">
                  <div className="flex justify-between">
                    <span>Delivered Letters:</span>
                    <strong className="font-mono text-[#1D2A20]">{stats ? stats.totalReceived : '12+'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Private Replies Penned:</span>
                    <strong className="font-mono text-[#1D2A20]">{stats ? stats.totalReplied : '10+'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Requirement:</span>
                    <strong className="font-mono text-[#3B5337]">0% / None</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LAYOUT VARIANT 2: CENTERED SHOWCASE POSTER ================= */}
        {layoutMode === 'poster' && (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#4A6945] tracking-wide">
                <span>Medical Technology Postal Haven</span>
                <span aria-hidden="true">·</span>
                <span>100% Anonymous Letters</span>
                <span aria-hidden="true">·</span>
                <span>Private Replies</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1D2A20]">
                {stats?.siteHeadline || 'The stamp bridge'}
              </h1>
              <p className="font-serif italic text-lg text-[#4A6945] max-w-xl mx-auto">
                {stats?.siteSubtitle || 'Where unspoken thoughts from the laboratory find quiet passage.'}
              </p>
            </div>

            {/* Centered Poster Card */}
            <div className="relative mx-auto max-w-lg rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white group">
              <img
                src={heroImage}
                alt="Canva Poster"
                className={`w-full max-h-96 object-center transition-transform duration-500 group-hover:scale-[1.01] ${
                  imageFit === 'contain' ? 'object-contain bg-[#F8FAF7]' : 'object-cover'
                }`}
                referrerPolicy="no-referrer"
              />
              <div className="p-3.5 bg-white border-t border-[#E6ECE5] flex items-center justify-between text-xs text-[#31432E]">
                <div className="flex items-center gap-2 text-left">
                  <span className="font-serif italic font-medium">Postmark:</span>
                  <span>{imageCaption}</span>
                </div>
                <span className="text-[11px] font-mono text-[#5F8359]">CANVA POSTER</span>
              </div>
            </div>

            {/* Intro text */}
            <div className="max-w-2xl mx-auto space-y-3 text-[#31432E] text-sm sm:text-base leading-relaxed font-light">
              <p>
                {stats?.heroIntro ||
                  'Behind every centrifuge spin, emergency blood crossmatch, and late-night slide differential, Medical Technology students shoulder an immense, invisible burden. From trembling hands during first phlebotomies to the quiet dread of board exam preparation, much of what you feel remains unspoken in the laboratory ward.'}
              </p>
              <p className="italic text-[#2A3A29] bg-[#F4F7F4]/80 py-2.5 px-4 rounded-xl border border-[#CFDBCB]">
                <strong className="font-serif not-italic font-semibold text-[#1D2A20]">The Purpose:</strong>{' '}
                {stats?.purposeText ||
                  'The Stamp Bridge is an intimate, anonymous sanctuary built exclusively for MedTech students. Drop an anonymous stamp with your honest confessions, duty vents, or questions. You are issued a private Secret Retrieval Code so only you can return and read the personal reply waiting for you on the other side.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onStartWriting}
                className="px-6 py-3 text-sm font-medium text-white bg-[#2A3A29] hover:bg-[#1D2A20] rounded-xl shadow-xs transition-all duration-200 flex items-center gap-2.5 cursor-pointer hover:translate-y-[-1px]"
              >
                <Send className="w-4 h-4 text-[#AAC0A5]" />
                <span>Write an Anonymous Stamp</span>
              </button>

              <button
                onClick={onCheckStamp}
                className="px-5 py-3 text-sm font-medium text-[#2A3A29] bg-white hover:bg-[#F4F7F4] border border-[#CFDBCB] rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#5F8359]" />
                <span>Check My Stamp & Reply</span>
              </button>

              <button
                onClick={onOpenShareModal}
                className="px-4 py-3 text-sm font-medium text-[#3B5337] bg-[#F4F7F4] hover:bg-[#E6ECE5] border border-[#CFDBCB] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#5F8359]" />
                <span>Lifetime Link</span>
              </button>
            </div>

            {/* Counters */}
            <div className="pt-2 flex items-center justify-center gap-6 text-xs text-[#5F8359]">
              <div>
                <span className="font-mono font-semibold text-sm text-[#1D2A20]">
                  {stats ? stats.totalReceived : '12+'}
                </span>
                <span className="ml-1.5">Letters Delivered</span>
              </div>
              <span aria-hidden="true" className="text-[#CFDBCB]">/</span>
              <div>
                <span className="font-mono font-semibold text-sm text-[#1D2A20]">
                  {stats ? stats.totalReplied : '10+'}
                </span>
                <span className="ml-1.5">Private Replies Penned</span>
              </div>
              <span aria-hidden="true" className="text-[#CFDBCB]">/</span>
              <div>
                <span className="font-mono font-semibold text-sm text-[#3B5337]">100%</span>
                <span className="ml-1.5">Zero Sign-Up Required</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= LAYOUT VARIANT 3: MINIMALIST LAB ================= */}
        {layoutMode === 'minimal' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <img src={emblemImage} alt="Emblem" className="w-12 h-12 rounded-xl object-cover border border-[#CFDBCB] shadow-xs" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#4A6945]">Medical Technology Postal Sanctuary</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D2A20]">
                  {stats?.siteHeadline || 'The stamp bridge'}
                </h1>
              </div>
            </div>

            <p className="font-serif italic text-base sm:text-lg text-[#4A6945]">
              {stats?.siteSubtitle || 'Where unspoken thoughts from the laboratory find quiet passage.'}
            </p>

            <p className="text-sm text-[#31432E] leading-relaxed">
              {stats?.purposeText ||
                'The Stamp Bridge is an intimate, anonymous sanctuary built exclusively for MedTech students. Drop an anonymous stamp with your honest confessions, duty vents, or questions. You are issued a private Secret Retrieval Code so only you can return and read the personal reply waiting for you on the other side.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartWriting}
                className="px-6 py-3 text-sm font-medium text-white bg-[#2A3A29] hover:bg-[#1D2A20] rounded-xl shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#AAC0A5]" />
                <span>Write an Anonymous Stamp</span>
              </button>

              <button
                onClick={onCheckStamp}
                className="px-5 py-3 text-sm font-medium text-[#2A3A29] bg-white hover:bg-[#F4F7F4] border border-[#CFDBCB] rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#5F8359]" />
                <span>Check My Stamp & Reply</span>
              </button>

              <button
                onClick={onOpenShareModal}
                className="px-4 py-3 text-sm font-medium text-[#3B5337] bg-[#F4F7F4] hover:bg-[#E6ECE5] border border-[#CFDBCB] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#5F8359]" />
                <span>Lifetime Link</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= LAYOUT VARIANT 4: DEFAULT SPLIT ================= */}
        {layoutMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Creative Narrative & Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Unboxed natural kicker */}
              <div className="flex items-center gap-2 text-xs font-medium text-[#4A6945] tracking-wide">
                <span>Medical Technology Postal Haven</span>
                <span aria-hidden="true">·</span>
                <span>100% Anonymous Letters</span>
                <span aria-hidden="true">·</span>
                <span>Private Replies</span>
              </div>

              {/* Main Header Display */}
              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1D2A20] leading-[1.08] text-balance">
                  {stats?.siteHeadline || 'The stamp bridge'}
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-[#4A6945]">
                  {stats?.siteSubtitle || 'Where unspoken thoughts from the laboratory find quiet passage.'}
                </p>
              </div>

              {/* Creative MedTech Introduction & Purpose Description */}
              <div className="space-y-3.5 text-[#31432E] text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                <p>
                  {stats?.heroIntro ||
                    'Behind every centrifuge spin, emergency blood crossmatch, and late-night slide differential, Medical Technology students shoulder an immense, invisible burden. From trembling hands during first phlebotomies to the quiet dread of board exam preparation, much of what you feel remains unspoken in the laboratory ward.'}
                </p>
                <p className="border-l-2 border-[#5F8359] pl-4 italic text-[#2A3A29] bg-[#F4F7F4]/80 py-2 rounded-r-md">
                  <strong className="font-serif not-italic font-semibold text-[#1D2A20]">The Purpose:</strong>{' '}
                  {stats?.purposeText ||
                    'The Stamp Bridge is an intimate, anonymous sanctuary built exclusively for MedTech students. Drop an anonymous stamp with your honest confessions, duty vents, or questions. You are issued a private Secret Retrieval Code so only you can return and read the personal reply waiting for you on the other side.'}
                </p>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onStartWriting}
                  className="px-6 py-3 text-sm font-medium text-white bg-[#2A3A29] hover:bg-[#1D2A20] rounded-xl shadow-xs transition-all duration-200 flex items-center gap-2.5 cursor-pointer hover:translate-y-[-1px]"
                >
                  <Send className="w-4 h-4 text-[#AAC0A5]" />
                  <span>Write an Anonymous Stamp</span>
                </button>

                <button
                  onClick={onCheckStamp}
                  className="px-5 py-3 text-sm font-medium text-[#2A3A29] bg-white hover:bg-[#F4F7F4] border border-[#CFDBCB] rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#5F8359]" />
                  <span>Check My Stamp & Reply</span>
                </button>

                <button
                  onClick={onOpenShareModal}
                  className="px-4 py-3 text-sm font-medium text-[#3B5337] bg-[#F4F7F4] hover:bg-[#E6ECE5] border border-[#CFDBCB] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy or share the permanent lifetime link for The Stamp Bridge"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5F8359]" />
                  <span>Lifetime Link</span>
                </button>

                <button
                  onClick={onReadPurpose}
                  className="px-4 py-3 text-sm font-medium text-[#4A6945] hover:text-[#1D2A20] transition-colors flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>The Story</span>
                </button>
              </div>

              {/* Unboxed live bridge counters */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#5F8359] border-t border-[#E6ECE5]">
                <div>
                  <span className="font-mono font-semibold text-sm text-[#1D2A20] tabular-nums">
                    {stats ? stats.totalReceived : '12+'}
                  </span>
                  <span className="ml-1.5">Letters Delivered</span>
                </div>
                <span aria-hidden="true" className="text-[#CFDBCB]">/</span>
                <div>
                  <span className="font-mono font-semibold text-sm text-[#1D2A20] tabular-nums">
                    {stats ? stats.totalReplied : '10+'}
                  </span>
                  <span className="ml-1.5">Private Replies Penned</span>
                </div>
                <span aria-hidden="true" className="text-[#CFDBCB]">/</span>
                <div>
                  <span className="font-mono font-semibold text-sm text-[#3B5337]">100%</span>
                  <span className="ml-1.5">Zero Sign-Up Required</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Postal Desk & Stamp Artifact */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Stationery Desk Photograph or Canva Graphic */}
                <div className="relative rounded-2xl overflow-hidden shadow-md border-4 border-white bg-white group">
                  <img
                    src={heroImage}
                    alt="Canva design or medical laboratory postal letter"
                    className={`w-full h-72 sm:h-80 object-center group-hover:scale-[1.01] transition-transform duration-500 ${
                      imageFit === 'contain' ? 'object-contain bg-[#F8FAF7]' : 'object-cover'
                    }`}
                    referrerPolicy="no-referrer"
                  />

                  {/* Subtle caption banner */}
                  <div className="p-3.5 bg-white border-t border-[#E6ECE5] flex items-center justify-between">
                    <div className="text-xs text-[#31432E]">
                      <span className="font-serif italic font-medium">Postmark:</span> {imageCaption}
                    </div>
                    <span className="text-[11px] font-mono text-[#5F8359]">CLS / RMT ARCHIVE</span>
                  </div>
                </div>

                {/* Floating Aesthetic Stamp Emblem Badge */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 w-28 h-28 sm:w-32 sm:h-32 bg-white p-1 rounded-xl shadow-lg border border-[#CFDBCB] rotate-[-4deg] hover:rotate-0 transition-transform">
                  <img
                    src={emblemImage}
                    alt="The stamp bridge emblem"
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
