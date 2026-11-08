import React, { useState } from 'react';
import { Send, KeyRound, Sparkles, Filter, Heart, MessageCircle } from 'lucide-react';
import { StampMessage, STAMP_DESIGNS, CATEGORIES } from '../types';

interface JournalFeedProps {
  onWriteClick: () => void;
  onTrackClick: (code?: string) => void;
}

export const JournalFeed: React.FC<JournalFeedProps> = ({
  onWriteClick,
  onTrackClick,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Calming preview snippets representative of MedTech life
  const journalSnippets = [
    {
      id: 'j1',
      code: 'STAMP-MED1',
      alias: 'Third-Year Intern on Night Duty',
      category: 'duty_shift',
      stamp: 'hematology_slide',
      time: 'Yesterday at 3:30 AM',
      snippet: 'It was 3:30 AM in the ER lab and we had three code red traumas at once. My hands were shaking while doing the emergency crossmatching. Nobody noticed I almost cried behind the centrifuge. I just needed to tell someone who understands how heavy that glass tube feels.',
      hasReply: true,
    },
    {
      id: 'j2',
      code: 'STAMP-BIO2',
      alias: 'Graduating MedTech Senior',
      category: 'board_exam',
      stamp: 'gram_negative',
      time: '18 hours ago',
      snippet: 'Review season is suffocating. I keep mixing up biochemical reactions of Enterobacteriaceae (TSI, IMViC, urease). What if I let my parents down? Sending this out into the ether hoping for a little sign that things will be okay.',
      hasReply: true,
    },
    {
      id: 'j3',
      code: 'STAMP-PHL3',
      alias: 'Intern at Pediatric Ward',
      category: 'gratitude',
      stamp: 'eucalyptus_lab',
      time: '2 days ago',
      snippet: 'To the head medtech who gently stepped in when I missed the vein twice on a crying toddler today and told me, "You’re learning, don’t apologize for learning." You saved my sanity and dignity today.',
      hasReply: true,
    },
    {
      id: 'j4',
      code: 'STAMP-UR4',
      alias: 'Clinical Microscopy Bench',
      category: 'confession',
      stamp: 'histopathology',
      time: '3 days ago',
      snippet: 'I dropped an entire rack of urine sediment tubes during my first week of rotation. I wanted the floor to open up and swallow me whole. Three months later, I can read casts with my eyes closed. It really does get better.',
      hasReply: false,
    },
  ];

  const filtered = activeCategory === 'all'
    ? journalSnippets
    : journalSnippets.filter(j => j.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase font-mono tracking-wider text-[#5F8359]">
          The Echoes of the Specimen Bench
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1D2A20]">
          Letters Journal
        </h2>
        <p className="text-xs sm:text-sm text-[#4A6945] leading-relaxed">
          Glimpses from anonymous stamps crossing the bridge. You are never alone in what you feel behind the lab bench.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#3B5337] text-white shadow-xs'
              : 'bg-white text-[#4A6945] border border-[#CFDBCB] hover:bg-[#F4F7F4]'
          }`}
        >
          All Journal Letters
        </button>
        {CATEGORIES.slice(0, 5).map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeCategory === cat.id
                ? 'bg-[#3B5337] text-white shadow-xs'
                : 'bg-white text-[#4A6945] border border-[#CFDBCB] hover:bg-[#F4F7F4]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Stamp Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(card => {
          const stampObj = STAMP_DESIGNS.find(s => s.id === card.stamp) || STAMP_DESIGNS[0];
          const catObj = CATEGORIES.find(c => c.id === card.category);

          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#CFDBCB] p-6 shadow-xs hover:border-[#81A27B] transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between border-b border-[#E6ECE5] pb-3 mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#1D2A20]">
                      {card.code}
                    </span>
                    <div className="text-[11px] text-[#5F8359] mt-0.5">
                      {card.alias}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xl" title={stampObj.title}>
                      {stampObj.symbol}
                    </span>
                  </div>
                </div>

                {/* Body Quote */}
                <p className="text-sm font-serif text-[#2A3A29] leading-relaxed italic">
                  "{card.snippet}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E6ECE5] text-[11px] text-[#5F8359]">
                <span>{card.time}</span>
                {card.hasReply ? (
                  <button
                    onClick={() => onTrackClick(card.code)}
                    className="text-emerald-800 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Private Reply</span>
                    <MessageCircle className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="italic text-[#81A27B]">Awaiting reply</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="p-8 bg-[#F4F7F4] rounded-2xl border border-[#CFDBCB] text-center space-y-3">
        <h3 className="font-serif text-2xl text-[#1D2A20]">
          Do you have something to leave on the bridge?
        </h3>
        <p className="text-xs sm:text-sm text-[#4A6945] max-w-md mx-auto">
          Send your own anonymous stamp now. It only takes a moment, and you will receive a private code to check your personal reply.
        </p>
        <button
          onClick={onWriteClick}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Send className="w-3.5 h-3.5 text-[#AAC0A5]" />
          <span>Write an Anonymous Stamp</span>
        </button>
      </div>

    </div>
  );
};
