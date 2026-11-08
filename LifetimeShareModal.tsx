import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  QrCode,
  Download,
  Smartphone,
  ExternalLink,
  X,
  MessageCircle,
  Mail,
  Send
} from 'lucide-react';

interface LifetimeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  permanentUrl?: string;
}

export const LifetimeShareModal: React.FC<LifetimeShareModalProps> = ({
  isOpen,
  onClose,
  permanentUrl = 'https://ais-dev-djbhvkkziipz6p5ysnqosx-962669478644.asia-east1.run.app',
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'install'>('link');

  if (!isOpen) return null;

  // Use current live origin if available
  const shareUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : permanentUrl;

  const shareText = `Send an anonymous letter or hospital duty vent across The Stamp Bridge — for MedTech students. Private replies guaranteed: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The stamp bridge',
          text: 'An anonymous postal sanctuary & private replies for Medical Technology students.',
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  // Generate an SVG QR code visual for the URL
  // Uses a clean aesthetic SVG representation with standard QR anchor markers
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=2A3A29&bgcolor=FCFDFB&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#CFDBCB] shadow-xl overflow-hidden animate-fadeIn">
        
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-[#E6ECE5] flex items-center justify-between bg-[#F8FAF7]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#3B5337] text-white flex items-center justify-center text-xs font-serif">
              §
            </span>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1D2A20]">
                The Stamp Bridge — Lifetime Link
              </h3>
              <p className="text-[11px] text-[#5F8359]">
                Permanent shareable address for your fellow MedTech students
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F8359] hover:bg-[#E6ECE5] hover:text-[#1D2A20] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="flex border-b border-[#E6ECE5] bg-[#FCFDFB] text-xs font-medium text-[#4A6945]">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-[#3B5337] text-[#1D2A20] font-semibold bg-white'
                : 'border-transparent hover:text-[#1D2A20]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Permanent Link</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-[#3B5337] text-[#1D2A20] font-semibold bg-white'
                : 'border-transparent hover:text-[#1D2A20]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-[#3B5337] text-[#1D2A20] font-semibold bg-white'
                : 'border-transparent hover:text-[#1D2A20]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Keep for Lifetime</span>
          </button>
        </div>

        {/* Tab 1: Share Permanent Link */}
        {activeTab === 'link' && (
          <div className="p-6 space-y-5">
            {/* 1. Public Shared URL */}
            <div className="space-y-1.5 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Public Shared Link (For All Students & Visitors)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  Public
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value="https://ais-pre-djbhvkkziipz6p5ysnqosx-962669478644.asia-east1.run.app"
                  className="flex-1 px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-mono text-[#1D2A20] select-all focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://ais-pre-djbhvkkziipz6p5ysnqosx-962669478644.asia-east1.run.app');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Public Link</span>
                </button>
              </div>
              <div className="text-[11px] text-emerald-800/90 pt-1 leading-relaxed">
                👉 <strong>How to publish:</strong> Click the <strong>"Share"</strong> button in the top-right toolbar and set it to <strong>"Public / Anyone with the link"</strong> to make this URL live for anyone in the world.
              </div>
            </div>

            {/* 2. Development Direct URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#4A6945]">
                Direct Development URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-xs font-mono text-[#1D2A20] select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#AAC0A5]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#5F8359]">
                Share in your MedTech batch chats, Instagram bio, or duty shift group.
              </p>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#E6ECE5]">
              <span className="block text-xs font-medium text-[#1D2A20]">
                Quick Share to Batchmates:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={handleNativeShare}
                  className="p-2.5 rounded-xl border border-[#CFDBCB] bg-[#F4F7F4] hover:bg-[#E6ECE5] text-xs font-medium text-[#1D2A20] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#3B5337]" />
                  <span>Share Menu</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#CFDBCB] bg-[#F4F7F4] hover:bg-[#E6ECE5] text-xs font-medium text-[#1D2A20] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Send an anonymous letter across The Stamp Bridge for MedTech students:')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#CFDBCB] bg-[#F4F7F4] hover:bg-[#E6ECE5] text-xs font-medium text-[#1D2A20] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>Telegram</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent('The Stamp Bridge — Anonymous Letters for MedTechs')}&body=${encodeURIComponent(shareText)}`}
                  className="p-2.5 rounded-xl border border-[#CFDBCB] bg-[#F4F7F4] hover:bg-[#E6ECE5] text-xs font-medium text-[#1D2A20] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Printable / Scannable QR Code */}
        {activeTab === 'qr' && (
          <div className="p-6 text-center space-y-4">
            <div className="p-4 bg-[#FCFDFB] border border-[#CFDBCB] rounded-2xl inline-block shadow-xs">
              <img
                src={qrSvgUrl}
                alt="QR Code for The Stamp Bridge"
                className="w-52 h-52 mx-auto rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-lg text-[#1D2A20]">
                Scan to Open "The Stamp Bridge"
              </h4>
              <p className="text-xs text-[#4A6945] max-w-sm mx-auto leading-relaxed">
                Scan with any smartphone camera to open the bridge immediately.
                Perfect for printing and placing near hospital lockers, bulletin boards, or study tables.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={qrSvgUrl}
                download="the_stamp_bridge_qr.png"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-medium text-[#2A3A29] bg-[#E6ECE5] hover:bg-[#CFDBCB] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Keep for Lifetime (Install as App / Bookmark) */}
        {activeTab === 'install' && (
          <div className="p-6 space-y-5 text-xs text-[#31432E] leading-relaxed">
            <div className="space-y-1">
              <h4 className="font-serif text-lg text-[#1D2A20]">
                Save "The Stamp Bridge" to Your Home Screen
              </h4>
              <p className="text-[#4A6945]">
                Keep the bridge easily accessible forever without losing your link or needing to retype it:
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* iPhone / Safari */}
              <div className="p-3.5 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1">
                <span className="font-semibold text-[#1D2A20] block">
                  📱 On iPhone / iPad (Safari):
                </span>
                <p>
                  1. Open this link in Safari.<br />
                  2. Tap the <strong>Share button</strong> (square with arrow pointing up at the bottom).<br />
                  3. Scroll down and tap <strong>"Add to Home Screen"</strong>.<br />
                  4. The Stamp Bridge icon will appear like a native app on your phone!
                </p>
              </div>

              {/* Android / Chrome */}
              <div className="p-3.5 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1">
                <span className="font-semibold text-[#1D2A20] block">
                  🤖 On Android (Chrome / Brave):
                </span>
                <p>
                  1. Tap the <strong>three dots (⋮)</strong> in the top right.<br />
                  2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.<br />
                  3. Confirm to install.
                </p>
              </div>

              {/* Desktop Bookmark */}
              <div className="p-3.5 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1">
                <span className="font-semibold text-[#1D2A20] block">
                  💻 On Computer (Mac / Windows):
                </span>
                <p>
                  Press <kbd className="px-1.5 py-0.5 bg-white border border-[#CFDBCB] rounded text-[10px] font-mono">Ctrl+D</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-[#CFDBCB] rounded text-[10px] font-mono">Cmd+D</kbd> to bookmark The Stamp Bridge in your browser bar.
                </p>
              </div>

              {/* Download Code Base */}
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Download Full Source Code (.ZIP)</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Ready to Upload
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Download the entire project containing all components, images, backend, and config files in a clean .zip package ready to upload to GitHub or Replit.
                </p>
                <div className="pt-1">
                  <a
                    href="/the_stamp_bridge.zip"
                    download="the_stamp_bridge.zip"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download the_stamp_bridge.zip (1.5 MB)</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-[#AAC0A5]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Lifetime Link Copied!' : 'Copy Lifetime Link Now'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
