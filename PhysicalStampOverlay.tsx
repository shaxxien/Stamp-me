import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, ArrowRight, X } from 'lucide-react';
import { STAMP_DESIGNS, CATEGORIES } from '../types';

interface PhysicalStampOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  stampDesignId: string;
  category: string;
  senderAlias?: string;
  recipientName?: string;
}

export const PhysicalStampOverlay: React.FC<PhysicalStampOverlayProps> = ({
  isOpen,
  onClose,
  code,
  stampDesignId,
  category,
  senderAlias = 'Anonymous MedTech',
  recipientName = 'The Bridge Keeper',
}) => {
  // Animation phase states: 0: envelope in, 1: stamp hovering, 2: stamp slammed, 3: ink postmark cancelled, 4: ready
  const [phase, setPhase] = useState<number>(0);

  const stampInfo = STAMP_DESIGNS.find(s => s.id === stampDesignId) || STAMP_DESIGNS[0];
  const categoryInfo = CATEGORIES.find(c => c.id === category);

  useEffect(() => {
    if (!isOpen) {
      setPhase(0);
      return;
    }

    // Sequence timing
    const t1 = setTimeout(() => setPhase(1), 300);  // Stamp hovers in
    const t2 = setTimeout(() => setPhase(2), 950);  // Stamp slams down
    const t3 = setTimeout(() => setPhase(3), 1500); // Postmark stamp cancelled
    const t4 = setTimeout(() => setPhase(4), 2100); // Fully sealed & ready

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        
        {/* Darkened warm backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0E1610]/75 backdrop-blur-sm"
          onClick={phase >= 2 ? onClose : undefined}
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-xl w-full mx-auto my-auto py-6">
          
          {/* Skip / Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-2 right-0 sm:right-2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer z-30"
            title="Skip animation"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Postal Sealing Desk Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative bg-[#F4F7F4] rounded-3xl p-6 sm:p-10 border-4 border-white shadow-2xl overflow-hidden"
          >
            
            {/* Header Stage Status */}
            <div className="text-center space-y-1 mb-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#4A6945]">
                {phase < 2 ? 'Affixing Philatelic Stamp...' : phase < 3 ? 'Pressing Ingot Stamp...' : 'Transit Certified & Sealed'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1D2A20]">
                {phase < 3 ? 'Sealing Your Letter' : 'Stamped & Dispatched Across The Bridge'}
              </h3>
            </div>

            {/* THE ENVELOPE */}
            <div className="relative bg-[#FCFDFB] rounded-2xl border-2 border-[#CFDBCB] p-6 sm:p-8 shadow-md overflow-hidden min-h-[260px] flex flex-col justify-between">
              
              {/* Envelope flap aesthetic folds */}
              <div className="absolute top-0 left-0 right-0 h-10 border-b border-[#E6ECE5] bg-gradient-to-b from-[#F4F7F4] to-transparent pointer-events-none" />

              {/* Upper Section: Postal Details & THE PHYSICAL STAMP */}
              <div className="flex items-start justify-between relative z-10">
                
                {/* Airmail / Clinical Post Strip */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E6ECE5] text-[#2A3A29] text-[10px] font-mono uppercase tracking-wider border border-[#CFDBCB]">
                    <span>PAR AVION</span>
                    <span>·</span>
                    <span>MEDTECH RMT</span>
                  </div>

                  <div className="text-xs text-[#5F8359] font-serif space-y-0.5 pt-1">
                    <p className="text-[11px] font-mono text-[#81A27B] uppercase tracking-wider">Address:</p>
                    <p className="font-bold text-[#1D2A20] text-sm">{recipientName}</p>
                    <p className="italic">Clinical Specimen Desk & Intern Quarters</p>
                    {categoryInfo && (
                      <p className="text-[11px] text-[#4A6945] pt-1">
                        Category: <strong className="not-italic text-[#1D2A20]">{categoryInfo.label}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* THE PHYSICAL STAMP WITH SERRATED EDGES & IMPACT ANIMATION */}
                <div className="relative w-28 h-36 shrink-0 ml-4">
                  
                  {/* Stamp outline slot on envelope */}
                  <div className="absolute inset-0 rounded border-2 border-dashed border-[#CFDBCB] bg-[#F4F7F4]/60 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-[#AAC0A5] uppercase tracking-wider text-center px-1">
                      AFFIX STAMP HERE
                    </span>
                  </div>

                  {/* The Physical Stamp Object */}
                  <AnimatePresence>
                    {phase >= 1 && (
                      <motion.div
                        initial={{ scale: 2.2, y: -90, rotate: -14, opacity: 0 }}
                        animate={
                          phase >= 2
                            ? { scale: [1.1, 0.94, 1.0], y: 0, rotate: 2, opacity: 1 }
                            : { scale: 1.3, y: -20, rotate: -6, opacity: 0.9 }
                        }
                        transition={{
                          type: 'spring',
                          stiffness: phase >= 2 ? 450 : 200,
                          damping: phase >= 2 ? 18 : 22,
                        }}
                        className="absolute inset-0 rounded-sm bg-white p-1.5 shadow-xl cursor-default"
                        style={{
                          /* Perforated stamp teeth simulation */
                          boxShadow: '0 8px 24px -4px rgba(29, 42, 32, 0.25)',
                        }}
                      >
                        {/* Stamp inner philatelic frame */}
                        <div className={`w-full h-full rounded-xs bg-gradient-to-br ${stampInfo.color} p-2 text-white flex flex-col justify-between border-2 border-dashed border-white/60 relative overflow-hidden`}>
                          
                          {/* Top Stamp Text & Denomination */}
                          <div className="flex items-center justify-between text-[8px] font-mono tracking-widest uppercase">
                            <span className="opacity-90">POSTE</span>
                            <span className="font-bold bg-white/20 px-1 rounded text-[9px]">1.00</span>
                          </div>

                          {/* Center Motif & Symbol */}
                          <div className="text-center my-auto">
                            <span className="text-2xl filter drop-shadow-sm">{stampInfo.symbol}</span>
                            <div className="font-serif text-[10px] font-bold tracking-tight text-white/95 leading-tight mt-0.5">
                              {stampInfo.title}
                            </div>
                          </div>

                          {/* Bottom Stamp Badge */}
                          <div className="text-center border-t border-white/30 pt-0.5">
                            <span className="text-[7px] font-mono tracking-wider opacity-85">{stampInfo.badge}</span>
                          </div>
                        </div>

                        {/* Ink Cancellation Lines (Postmark Wavy Bars) */}
                        {phase >= 3 && (
                          <motion.div
                            initial={{ scale: 1.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.85 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="absolute -top-3 -right-6 w-36 h-20 pointer-events-none select-none"
                          >
                            <svg viewBox="0 0 160 80" className="w-full h-full text-[#1D2A20]">
                              {/* Circular postal seal */}
                              <circle cx="45" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2"/>
                              <circle cx="45" cy="40" r="26" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <text x="45" y="32" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fontWeight="bold" fill="currentColor">STAMP BRIDGE</text>
                              <text x="45" y="42" textAnchor="middle" fontSize="7" fontFamily="Georgia" fontWeight="bold" fill="currentColor">BRIDGED</text>
                              <text x="45" y="52" textAnchor="middle" fontSize="5.5" fontFamily="JetBrains Mono" fill="currentColor">{new Date().toLocaleDateString()}</text>

                              {/* Wavy cancellation bars across stamp */}
                              <path d="M 80 25 Q 100 20 120 25 T 160 25" fill="none" stroke="currentColor" strokeWidth="2"/>
                              <path d="M 80 35 Q 100 30 120 35 T 160 35" fill="none" stroke="currentColor" strokeWidth="2"/>
                              <path d="M 80 45 Q 100 40 120 45 T 160 45" fill="none" stroke="currentColor" strokeWidth="2"/>
                              <path d="M 80 55 Q 100 50 120 55 T 160 55" fill="none" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </motion.div>
                        )}

                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

              {/* Lower Section: Sender & Retrieval Code Stamp */}
              <div className="pt-6 border-t border-[#E6ECE5] flex items-end justify-between relative z-10">
                <div className="text-xs text-[#5F8359]">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#81A27B]">Dispatched By:</p>
                  <p className="font-serif italic font-medium text-[#1D2A20] text-sm">
                    {senderAlias}
                  </p>
                </div>

                {/* Secret Code Inked Badge */}
                {phase >= 3 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                    className="p-2.5 rounded-xl bg-[#F4F7F4] border border-[#AAC0A5] text-right"
                  >
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-[#5F8359]">
                      Assigned Retrieval Key
                    </span>
                    <span className="font-mono text-base font-bold text-[#1D2A20] tracking-widest">
                      {code}
                    </span>
                  </motion.div>
                )}
              </div>

            </div>

            {/* Action Bar when sealed */}
            <div className="mt-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#4A6945] flex items-center gap-1.5 text-center sm:text-left">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Physical stamp affixed & postmarked in MedTech registry.</span>
              </div>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#2A3A29] hover:bg-[#1D2A20] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View My Receipt & Code</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#AAC0A5]" />
              </button>
            </div>

          </motion.div>

        </div>

      </div>
    </AnimatePresence>
  );
};
