import React from 'react';
import { Send, KeyRound, Shield, Heart, Sparkles, BookOpen, Clock } from 'lucide-react';

interface AboutBridgeViewProps {
  onWriteClick: () => void;
  onTrackClick: () => void;
}

export const AboutBridgeView: React.FC<AboutBridgeViewProps> = ({
  onWriteClick,
  onTrackClick,
}) => {
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 sm:px-6 space-y-12">
      
      {/* Editorial Title Block */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-mono tracking-widest text-[#5F8359]">
          The Philately of the Clinical Laboratory
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#1D2A20] font-normal leading-tight">
          The Story & Purpose of The Stamp Bridge
        </h2>
        <p className="font-serif italic text-lg sm:text-xl text-[#4A6945]">
          An epistolary sanctuary built for Medical Technology students.
        </p>
      </div>

      {/* Main Philosophy Section */}
      <div className="bg-white rounded-2xl border border-[#CFDBCB] p-6 sm:p-10 space-y-6 text-[#2A3A29] leading-relaxed font-light text-sm sm:text-base">
        
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#1D2A20] font-medium">
            01. The Unseen Ward
          </h3>
          <p>
            In healthcare, they say doctors cure, nurses care, but <strong>Medical Technologists diagnose</strong>.
            Over 70% of all clinical medical decisions rely directly on the results generated behind the closed doors
            of hospital clinical laboratories.
          </p>
          <p>
            Yet for Medical Technology (MedTech / Clinical Laboratory Science) students, this journey is paved with quiet exhaustion.
            It begins in the lecture hall, memorizing hundreds of parasite ova, bacterial biochemical profiles, and enzymatic cascades.
            It deepens during hospital internships: 16-hour graveyard shifts in blood banks, shaking hands holding vacuum tubes during pediatric phlebotomy,
            the cold fear of misidentifying a malignant blast cell, and the looming mountain of licensure board examinations (MTLE / ASCPi).
          </p>
        </div>

        <div className="border-t border-[#E6ECE5] pt-6 space-y-4">
          <h3 className="font-serif text-2xl text-[#1D2A20] font-medium">
            02. Why "The Stamp Bridge"?
          </h3>
          <p>
            Every day in the lab, hundreds of specimen tubes pass across your counter — each tagged with a barcode requisition.
            You process them with scientific precision, but there has never been a requisition form for your own heart, fatigue, or silent triumphs.
          </p>
          <p>
            <strong>The Stamp Bridge</strong> is designed as a postal bridge across that divide. A vintage philatelic metaphor where you
            affix a symbolic laboratory stamp (Hematology, Microbiology, Blood Bank, Clinical Chem) to a letter that asks for no real name, no login,
            and no pretense.
          </p>
        </div>

        <div className="border-t border-[#E6ECE5] pt-6 space-y-4">
          <h3 className="font-serif text-2xl text-[#1D2A20] font-medium">
            03. The Architecture of Trust & Private Replies
          </h3>
          <p>
            Most anonymous platforms turn into chaotic shoutboxes. <em>The Stamp Bridge</em> is deliberately slow, intimate, and private:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B5337] text-white flex items-center justify-center text-xs font-mono font-bold">
                1
              </div>
              <h4 className="font-serif font-semibold text-[#1D2A20]">Total Anonymity</h4>
              <p className="text-xs text-[#4A6945] leading-relaxed">
                No email or password needed. You choose a pseudonym or remain purely anonymous.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B5337] text-white flex items-center justify-center text-xs font-mono font-bold">
                2
              </div>
              <h4 className="font-serif font-semibold text-[#1D2A20]">Private Retrieval Key</h4>
              <p className="text-xs text-[#4A6945] leading-relaxed">
                When you dispatch your letter, you receive a unique Secret Code (e.g. STAMP-9214).
              </p>
            </div>

            <div className="p-4 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B5337] text-white flex items-center justify-center text-xs font-mono font-bold">
                3
              </div>
              <h4 className="font-serif font-semibold text-[#1D2A20]">Dedicated Private Reply</h4>
              <p className="text-xs text-[#4A6945] leading-relaxed">
                The bridge recipient reads your letter on their private desk and writes a personal reply only you can see.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E6ECE5] pt-6 space-y-4">
          <h3 className="font-serif text-2xl text-[#1D2A20] font-medium">
            04. Why Green and White?
          </h3>
          <p>
            Green is the color of renewal and botanical healing — inspired by the calming shade of fresh eucalyptus,
            clean scrub attire, clinical microscopy coverslip tints, and safety green blood bank coolers.
            Paired with crisp white parchment, it creates a visual sanctuary that rests eyes exhausted by hours under fluorescence and optical microscopes.
          </p>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onWriteClick}
          className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4 text-[#AAC0A5]" />
          <span>Write an Anonymous Stamp</span>
        </button>

        <button
          onClick={onTrackClick}
          className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-[#2A3A29] bg-white hover:bg-[#F4F7F4] border border-[#CFDBCB] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <KeyRound className="w-4 h-4 text-[#5F8359]" />
          <span>Check My Letter & Reply</span>
        </button>
      </div>

    </div>
  );
};
