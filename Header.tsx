import React from 'react';
import { Lock, Unlock, Mail, Compass, Palette } from 'lucide-react';

interface HeaderProps {
  currentTab: 'write' | 'track' | 'about' | 'feed' | 'owner';
  onNavigate: (tab: 'write' | 'track' | 'about' | 'feed' | 'owner') => void;
  isOwnerAuthenticated: boolean;
  unrepliedCount?: number;
  onOpenShareModal: () => void;
  onOpenDesignModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  isOwnerAuthenticated,
  unrepliedCount = 0,
  onOpenShareModal,
  onOpenDesignModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F8FAF7]/90 backdrop-blur-md border-b border-[#E6ECE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('write')}
          className="text-left font-serif text-2xl font-bold tracking-tight text-[#1D2A20] hover:text-[#3B5337] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-md bg-[#3B5337] text-white flex items-center justify-center font-serif text-lg shadow-xs">
            §
          </span>
          <span>The stamp bridge</span>
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A6945]">
          <button
            onClick={() => onNavigate('write')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              currentTab === 'write'
                ? 'text-[#1D2A20] border-[#3B5337] font-semibold'
                : 'text-[#5F8359] border-transparent hover:text-[#1D2A20]'
            }`}
          >
            Send Stamp
          </button>

          <button
            onClick={() => onNavigate('track')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              currentTab === 'track'
                ? 'text-[#1D2A20] border-[#3B5337] font-semibold'
                : 'text-[#5F8359] border-transparent hover:text-[#1D2A20]'
            }`}
          >
            Check Reply
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              currentTab === 'about'
                ? 'text-[#1D2A20] border-[#3B5337] font-semibold'
                : 'text-[#5F8359] border-transparent hover:text-[#1D2A20]'
            }`}
          >
            Bridge Purpose
          </button>

          <button
            onClick={onOpenShareModal}
            className="whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 border-transparent text-[#3B5337] hover:text-[#1D2A20] font-medium"
          >
            Lifetime Link
          </button>

          <button
            onClick={() => onNavigate('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              currentTab === 'feed'
                ? 'text-[#1D2A20] border-[#3B5337] font-semibold'
                : 'text-[#5F8359] border-transparent hover:text-[#1D2A20]'
            }`}
          >
            Letters Journal
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenDesignModal}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#3B5337] hover:bg-[#E6ECE5] border border-transparent hover:border-[#CFDBCB] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Open Design Studio to customize green palettes, typography, and paper texture"
          >
            <Palette className="w-3.5 h-3.5 text-[#5F8359]" />
            <span className="hidden sm:inline">Design Studio</span>
          </button>

          {isOwnerAuthenticated ? (
            <button
              onClick={() => onNavigate('owner')}
              className="px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer bg-[#E6ECE5] text-[#2A3A29] border border-[#CFDBCB] hover:bg-[#CFDBCB] shadow-xs"
              title="Recipient Desk (Unlocked)"
            >
              <Unlock className="w-3.5 h-3.5 text-[#3B5337]" />
              <span>Recipient Desk</span>
              {unrepliedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#3B5337] text-white text-[10px] font-mono">
                  {unrepliedCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => onNavigate('owner')}
              className={`p-2 text-xs font-medium rounded-lg text-[#5F8359] hover:text-[#1D2A20] hover:bg-[#E6ECE5] transition-colors cursor-pointer border border-transparent hover:border-[#CFDBCB] ${
                currentTab === 'owner' ? 'bg-[#E6ECE5] text-[#1D2A20]' : ''
              }`}
              title="Private Recipient Desk"
              aria-label="Private Recipient Desk"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile subnav row */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E6ECE5] px-2 py-2 bg-[#F8FAF7] text-xs font-medium text-[#4A6945]">
        <button
          onClick={() => onNavigate('write')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'write' ? 'text-[#1D2A20] font-semibold bg-[#E6ECE5]' : ''}`}
        >
          Send
        </button>
        <button
          onClick={() => onNavigate('track')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'track' ? 'text-[#1D2A20] font-semibold bg-[#E6ECE5]' : ''}`}
        >
          Check
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'about' ? 'text-[#1D2A20] font-semibold bg-[#E6ECE5]' : ''}`}
        >
          Purpose
        </button>
        <button
          onClick={() => onNavigate('feed')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'feed' ? 'text-[#1D2A20] font-semibold bg-[#E6ECE5]' : ''}`}
        >
          Journal
        </button>
        <button
          onClick={onOpenDesignModal}
          className="px-2 py-1 rounded transition-colors text-[#3B5337] font-semibold flex items-center gap-1"
        >
          <Palette className="w-3 h-3" />
          <span>Design</span>
        </button>
        <button
          onClick={onOpenShareModal}
          className="px-2 py-1 rounded transition-colors text-[#3B5337] font-semibold"
        >
          Share
        </button>
      </div>
    </header>
  );
};
