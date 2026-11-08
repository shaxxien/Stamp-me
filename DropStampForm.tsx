import React, { useState } from 'react';
import { Send, Copy, Check, Sparkles, AlertCircle, ArrowRight, RefreshCw, Stamp } from 'lucide-react';
import { STAMP_DESIGNS, CATEGORIES, StampOption } from '../types';
import { PhysicalStampOverlay } from './PhysicalStampOverlay';

interface DropStampFormProps {
  onSuccess: (code: string) => void;
  onGoToTrack: (code: string) => void;
  recipientTitle?: string;
  paperTexture?: 'ruled' | 'blank';
}

export const DropStampForm: React.FC<DropStampFormProps> = ({
  onSuccess,
  onGoToTrack,
  recipientTitle = 'The Bridge Keeper',
  paperTexture = 'ruled',
}) => {
  const [selectedStamp, setSelectedStamp] = useState<string>('eucalyptus_lab');
  const [category, setCategory] = useState<string>('duty_shift');
  const [senderAlias, setSenderAlias] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Success view state
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showStampOverlay, setShowStampOverlay] = useState<boolean>(false);

  const activeStampObj = STAMP_DESIGNS.find(s => s.id === selectedStamp) || STAMP_DESIGNS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write a message before sending your stamp across the bridge.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          stampDesign: selectedStamp,
          senderAlias: senderAlias.trim() || 'Anonymous MedTech',
          recipientName: recipientTitle,
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch stamp');
      }

      setCreatedCode(data.accessCode);
      setShowStampOverlay(true);
      onSuccess(data.accessCode);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while sending your letter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetForm = () => {
    setCreatedCode(null);
    setContent('');
    setSenderAlias('');
    setError(null);
  };

  // SUCCESS DISPATCH VIEW
  if (createdCode) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-10 bg-white rounded-2xl shadow-sm border border-[#CFDBCB] text-center space-y-6">
        
        {/* Postmark stamp seal */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-[#4A6945] bg-[#F4F7F4] text-[#3B5337] mx-auto rotate-[-6deg]">
          <div className="text-center">
            <span className="block text-[10px] font-mono tracking-widest uppercase">POSTMARK</span>
            <span className="font-serif text-xs font-bold">BRIDGED</span>
            <span className="block text-[9px] font-mono">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-normal text-[#1D2A20]">
            Your Stamp Has Crossed The Bridge
          </h2>
          <p className="text-sm text-[#4A6945] max-w-md mx-auto leading-relaxed">
            Your letter has been securely sealed and placed onto the recipient’s private desk.
            Because you are completely anonymous, you need this unique code to retrieve your private reply.
          </p>
        </div>

        {/* Code Highlight Box */}
        <div className="p-6 bg-[#F4F7F4] rounded-xl border border-[#CFDBCB] max-w-md mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-wider text-[#5F8359]">
            Your Secret Stamp Retrieval Code
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-widest text-[#1D2A20] selection:bg-[#3B5337] selection:text-white">
            {createdCode}
          </div>
          <p className="text-[11px] text-[#4A6945]">
            Save or screenshot this code! You will use it on the "Check Reply" tab to read the personal response.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCopyCode}
              className="flex-1 py-2.5 px-4 text-xs font-medium text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#AAC0A5]" />
                  <span>Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code: {createdCode}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const directUrl = `${window.location.origin}?code=${createdCode}`;
                navigator.clipboard.writeText(directUrl);
                alert('Direct private link copied to clipboard! You can paste it into your bookmarks or notes.');
              }}
              className="py-2.5 px-3 text-xs font-medium text-[#2A3A29] bg-[#E6ECE5] hover:bg-[#CFDBCB] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Copy direct permanent tracking link"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Direct Link</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onGoToTrack(createdCode)}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-[#1D2A20] bg-[#E6ECE5] hover:bg-[#CFDBCB] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View My Stamp in Transit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowStampOverlay(true)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#3B5337] bg-[#F4F7F4] hover:bg-[#E6ECE5] border border-[#CFDBCB] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Watch the physical stamp affixing animation again"
          >
            <Stamp className="w-3.5 h-3.5 text-[#5F8359]" />
            <span>Replay Stamp Sealing</span>
          </button>

          <button
            onClick={handleResetForm}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-[#5F8359] hover:text-[#1D2A20] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Write Another Letter</span>
          </button>
        </div>

        {/* Physical Stamp Animation Overlay */}
        <PhysicalStampOverlay
          isOpen={showStampOverlay}
          onClose={() => setShowStampOverlay(false)}
          code={createdCode}
          stampDesignId={selectedStamp}
          category={category}
          senderAlias={senderAlias.trim() || 'Anonymous MedTech'}
          recipientName={recipientTitle}
        />

      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 sm:p-10 bg-white rounded-2xl shadow-sm border border-[#CFDBCB]">
      
      {/* Form Header */}
      <div className="border-b border-[#E6ECE5] pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1D2A20]">
              Dispatch an Anonymous Letter
            </h2>
            <p className="text-xs sm:text-sm text-[#4A6945]">
              No names required. Addressed to <span className="font-medium text-[#1D2A20]">{recipientTitle}</span>.
            </p>
          </div>

          {/* Active Stamp Preview Emblem */}
          <div className="hidden sm:flex flex-col items-center p-2 rounded-lg border border-[#CFDBCB] bg-[#F4F7F4] w-24 text-center">
            <span className="text-2xl">{activeStampObj.symbol}</span>
            <span className="text-[10px] font-mono text-[#3B5337] mt-1 font-semibold">{activeStampObj.badge}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Select Stamp Emblem */}
        <div className="space-y-2.5">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#4A6945]">
            1. Select Your MedTech Stamp
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {STAMP_DESIGNS.map(stamp => {
              const isSelected = selectedStamp === stamp.id;
              return (
                <button
                  type="button"
                  key={stamp.id}
                  onClick={() => setSelectedStamp(stamp.id)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#3B5337] bg-[#F4F7F4] shadow-xs'
                      : 'border-[#E6ECE5] hover:border-[#CFDBCB] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{stamp.symbol}</span>
                    <span className="text-[10px] font-mono text-[#5F8359]">{stamp.badge}</span>
                  </div>
                  <div className="text-xs font-medium text-[#1D2A20] leading-tight">
                    {stamp.title}
                  </div>
                  <div className="text-[11px] text-[#5F8359] mt-0.5 leading-tight">
                    {stamp.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Category of Message */}
        <div className="space-y-2.5">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#4A6945]">
            2. Letter Topic / Atmosphere
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => {
              const isActive = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#3B5337] text-white shadow-xs'
                      : 'bg-[#F4F7F4] text-[#4A6945] hover:bg-[#E6ECE5] hover:text-[#1D2A20]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Anonymous Pseudonym (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="senderAlias" className="block text-xs font-medium uppercase tracking-wider text-[#4A6945]">
              3. Pseudonym / Sign-off <span className="text-[#81A27B] font-normal">(Optional)</span>
            </label>
            <span className="text-[11px] text-[#5F8359]">Defaults to "Anonymous MedTech"</span>
          </div>
          <input
            id="senderAlias"
            type="text"
            value={senderAlias}
            onChange={e => setSenderAlias(e.target.value)}
            placeholder="e.g. Intern in Blood Bank, 3rd Year Crammer, Tired Phlebotomist..."
            maxLength={60}
            className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm text-[#1D2A20] placeholder-[#81A27B] focus:outline-none focus:border-[#3B5337] focus:ring-1 focus:ring-[#3B5337]"
          />
        </div>

        {/* Step 4: The Letter Body */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="content" className="block text-xs font-medium uppercase tracking-wider text-[#4A6945]">
              4. Your Letter Across The Bridge
            </label>
            <span className="text-[11px] font-mono text-[#81A27B]">
              {content.length} characters
            </span>
          </div>
          
          <div className="relative rounded-xl border border-[#CFDBCB] bg-[#FCFDFB] overflow-hidden focus-within:border-[#3B5337] focus-within:ring-1 focus-within:ring-[#3B5337]">
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your honest thoughts, duty shift vent, board exam fear, gratitude, or question here. Only the bridge recipient will access and read this. You will receive a private code to retrieve their reply..."
              className={`w-full p-4 sm:p-5 text-sm sm:text-base text-[#1D2A20] placeholder-[#81A27B]/80 bg-transparent resize-y focus:outline-none ${
                paperTexture === 'blank' ? '' : 'letter-ruled'
              }`}
              required
            />
          </div>
          <p className="text-[11px] text-[#5F8359] italic">
            * This letter is 100% anonymous. No IP, account, or personal telemetry is stored.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="w-full py-3.5 px-6 text-sm font-medium text-white bg-[#2A3A29] hover:bg-[#1D2A20] disabled:bg-[#CFDBCB] disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#AAC0A5]" />
                <span>Affixing Stamp & Bridging Letter...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#AAC0A5]" />
                <span>Seal & Send Across The Bridge</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
