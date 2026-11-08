import React, { useState, useEffect } from 'react';
import { Search, KeyRound, Clock, CheckCircle2, MessageSquare, Send, AlertCircle, RefreshCw } from 'lucide-react';
import { StampMessage, STAMP_DESIGNS, CATEGORIES } from '../types';

interface CheckStampViewProps {
  initialCode?: string;
  onGoToWrite: () => void;
}

export const CheckStampView: React.FC<CheckStampViewProps> = ({
  initialCode = '',
  onGoToWrite,
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<StampMessage | null>(null);

  // Follow up reply state
  const [followUp, setFollowUp] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);
  const [replySuccess, setReplySuccess] = useState<boolean>(false);

  const fetchLetter = async (searchCode: string) => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/messages/track/${encodeURIComponent(searchCode.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No message found with this secret retrieval code.');
      }
      setMessage(data);
    } catch (err: any) {
      setMessage(null);
      setError(err.message || 'Could not locate letter.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      fetchLetter(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLetter(code);
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim() || !message) return;

    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/messages/track/${encodeURIComponent(message.accessCode)}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: followUp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send follow-up message');
      }
      
      // Update local message replies
      setMessage(prev => {
        if (!prev) return null;
        return {
          ...prev,
          replies: [...prev.replies, data.reply],
        };
      });
      setFollowUp('');
      setReplySuccess(true);
      setTimeout(() => setReplySuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit follow-up');
    } finally {
      setSubmittingReply(false);
    }
  };

  const stampInfo = message ? STAMP_DESIGNS.find(s => s.id === message.stampDesign) || STAMP_DESIGNS[0] : null;
  const categoryInfo = message ? CATEGORIES.find(c => c.id === message.category) : null;

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 sm:p-10 space-y-8">
      
      {/* Code Entry Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#CFDBCB] p-6 sm:p-8">
        <div className="space-y-1 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F4F7F4] text-[#3B5337] mb-2">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1D2A20]">
            Retrieve Your Letter & Private Reply
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6945] max-w-md mx-auto">
            Enter the unique Secret Retrieval Code provided when you dispatched your stamp letter.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. STAMP-MED1"
            className="flex-1 px-4 py-3 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-center sm:text-left font-mono font-medium tracking-wider text-[#1D2A20] uppercase placeholder-[#81A27B] focus:outline-none focus:border-[#3B5337] focus:ring-1 focus:ring-[#3B5337]"
            required
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="px-6 py-3 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] disabled:bg-[#CFDBCB] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#AAC0A5]" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Look Up Stamp</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-center gap-2 text-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick sample prompt for testing */}
        {!message && !loading && (
          <div className="mt-6 pt-4 border-t border-[#E6ECE5] text-center text-xs text-[#5F8359]">
            <span>Try previewing demo letters with code: </span>
            <button
              onClick={() => {
                setCode('STAMP-MED1');
                fetchLetter('STAMP-MED1');
              }}
              className="font-mono font-semibold text-[#1D2A20] underline hover:text-[#3B5337] cursor-pointer"
            >
              STAMP-MED1
            </button>
            <span className="mx-1.5">or</span>
            <button
              onClick={() => {
                setCode('STAMP-BIO2');
                fetchLetter('STAMP-BIO2');
              }}
              className="font-mono font-semibold text-[#1D2A20] underline hover:text-[#3B5337] cursor-pointer"
            >
              STAMP-BIO2
            </button>
          </div>
        )}
      </div>

      {/* RESULT VIEW: Stamped Letter & Private Replies */}
      {message && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Status Ribbon */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#F4F7F4] border border-[#CFDBCB] rounded-xl text-xs text-[#31432E]">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#1D2A20]">{message.accessCode}</span>
              <span aria-hidden="true" className="text-[#CFDBCB]">·</span>
              <span>{new Date(message.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              {message.status === 'replied' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800 font-semibold">Private Reply Waiting</span>
                </>
              ) : message.status === 'read' ? (
                <>
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800">Read by Recipient (Replying Soon)</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-[#5F8359]" />
                  <span>Delivered to Recipient's Desk</span>
                </>
              )}
            </div>
          </div>

          {/* Original Sender's Letter Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#CFDBCB] p-6 sm:p-8 space-y-4 relative overflow-hidden">
            
            {/* Top letter metadata */}
            <div className="flex items-start justify-between border-b border-[#E6ECE5] pb-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#5F8359]">
                  From: {message.senderAlias || 'Anonymous MedTech'}
                </div>
                <div className="font-serif text-lg text-[#1D2A20] mt-0.5">
                  To: {message.recipientName || 'The Bridge Keeper'}
                </div>
                {categoryInfo && (
                  <div className="text-xs text-[#4A6945] mt-1 flex items-center gap-1.5">
                    <span>{categoryInfo.icon}</span>
                    <span>{categoryInfo.label}</span>
                  </div>
                )}
              </div>

              {/* Stamp emblem */}
              {stampInfo && (
                <div className="flex flex-col items-center p-2 rounded-lg border border-[#CFDBCB] bg-[#F4F7F4] text-center w-20">
                  <span className="text-2xl">{stampInfo.symbol}</span>
                  <span className="text-[9px] font-mono text-[#3B5337] font-semibold mt-0.5">{stampInfo.badge}</span>
                </div>
              )}
            </div>

            {/* Letter Body */}
            <div className="text-sm sm:text-base text-[#1D2A20] leading-relaxed whitespace-pre-wrap font-serif py-2">
              {message.content}
            </div>

          </div>

          {/* Private Replies Section */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#1D2A20] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#3B5337]" />
              <span>Private Bridge Correspondence</span>
            </h3>

            {message.replies && message.replies.length > 0 ? (
              <div className="space-y-4">
                {message.replies.map((reply, idx) => {
                  const isOwner = reply.sender === 'owner';
                  return (
                    <div
                      key={reply.id || idx}
                      className={`p-6 rounded-2xl border transition-all ${
                        isOwner
                          ? 'bg-[#F4F7F4] border-[#AAC0A5] ml-0 sm:ml-6'
                          : 'bg-white border-[#CFDBCB] mr-0 sm:mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-[#5F8359] border-b border-[#CFDBCB]/60 pb-2 mb-3">
                        <span className="font-serif font-semibold text-[#1D2A20]">
                          {isOwner ? `Reply from ${message.recipientName || 'The Bridge Keeper'}` : 'Your Follow-up Note'}
                        </span>
                        <span className="font-mono text-[11px]">
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                          {new Date(reply.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-sm text-[#1D2A20] leading-relaxed whitespace-pre-wrap font-serif">
                        {reply.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-[#F8FAF7] border border-dashed border-[#CFDBCB] rounded-2xl text-center space-y-2">
                <Clock className="w-6 h-6 text-[#5F8359] mx-auto" />
                <p className="text-sm font-serif text-[#1D2A20]">
                  The bridge recipient hasn't penned a reply to this letter yet.
                </p>
                <p className="text-xs text-[#4A6945] max-w-sm mx-auto">
                  Every letter is read with personal care. Please keep your code <span className="font-mono font-bold text-[#1D2A20]">{message.accessCode}</span> handy and check back later.
                </p>
              </div>
            )}

            {/* Senders follow-up box */}
            <form onSubmit={handleSendFollowUp} className="bg-white rounded-2xl border border-[#CFDBCB] p-5 space-y-3">
              <label htmlFor="followUp" className="block text-xs font-medium uppercase tracking-wider text-[#4A6945]">
                Send an anonymous follow-up note in this thread
              </label>
              <textarea
                id="followUp"
                rows={3}
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                placeholder="Reply back anonymously if you want to say thank you or continue the thought..."
                className="w-full p-3 text-sm bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-[#1D2A20] placeholder-[#81A27B] focus:outline-none focus:border-[#3B5337]"
                required
              />
              <div className="flex items-center justify-between">
                {replySuccess ? (
                  <span className="text-xs text-emerald-700 font-medium">Follow-up sent successfully!</span>
                ) : (
                  <span className="text-[11px] text-[#5F8359]">Keeps you completely anonymous under code {message.accessCode}</span>
                )}
                <button
                  type="submit"
                  disabled={submittingReply || !followUp.trim()}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#3B5337] hover:bg-[#2A3A29] disabled:bg-[#CFDBCB] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {submittingReply ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Follow-up</span>
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};
