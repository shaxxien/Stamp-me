import React from 'react';
import { Lock, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'write' | 'track' | 'about' | 'feed' | 'owner') => void;
  isOwnerAuthenticated: boolean;
  onOpenShareModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, isOwnerAuthenticated, onOpenShareModal }) => {
  return (
    <footer className="border-t border-[#E6ECE5] bg-white py-10 mt-16 text-xs text-[#5F8359]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="font-serif text-lg font-semibold text-[#1D2A20] flex items-center justify-center md:justify-start gap-2">
              <span className="w-5 h-5 rounded bg-[#3B5337] text-white flex items-center justify-center text-xs font-serif">
                §
              </span>
              <span>The stamp bridge</span>
            </div>
            <p className="text-[#4A6945] max-w-sm">
              An anonymous epistolary haven for Medical Technology & Clinical Laboratory Science students.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-[#3B5337]">
            <button
              onClick={() => onNavigate('write')}
              className="hover:text-[#1D2A20] transition-colors cursor-pointer"
            >
              Send Stamp
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="hover:text-[#1D2A20] transition-colors cursor-pointer"
            >
              Check Reply
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#1D2A20] transition-colors cursor-pointer"
            >
              Bridge Purpose
            </button>
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="hover:text-[#1D2A20] transition-colors cursor-pointer text-[#1D2A20] font-semibold"
              >
                Lifetime Link
              </button>
            )}
            <button
              onClick={() => onNavigate('feed')}
              className="hover:text-[#1D2A20] transition-colors cursor-pointer"
            >
              Letters Journal
            </button>
            <button
              onClick={() => onNavigate('owner')}
              className="hover:text-[#1D2A20] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Recipient Desk</span>
            </button>
          </div>

        </div>

        <div className="border-t border-[#E6ECE5] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#81A27B]">
          <div className="flex items-center gap-2">
            <span>Crafted for Medical Technologists</span>
            <span aria-hidden="true">·</span>
            <span>Hematology · Microbiology · Clinical Chem · Blood Bank</span>
          </div>

          <div>
            <span>100% Anonymous · No Tracking · Private Reply Bridge</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
