import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Send,
  Search,
  Star,
  Archive,
  Trash2,
  CheckCircle,
  Clock,
  Settings as SettingsIcon,
  Filter,
  Check,
  AlertCircle,
  RefreshCw,
  X,
  MessageSquare,
  Edit3,
  Palette
} from 'lucide-react';
import { StampMessage, STAMP_DESIGNS, CATEGORIES } from '../types';

interface OwnerDeskViewProps {
  onLockStateChange: (isAuth: boolean) => void;
  isInitiallyAuth: boolean;
  onRefreshCount: () => void;
  onOpenDesignModal?: () => void;
}

export const OwnerDeskView: React.FC<OwnerDeskViewProps> = ({
  onLockStateChange,
  isInitiallyAuth,
  onRefreshCount,
  onOpenDesignModal,
}) => {
  const [pin, setPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isInitiallyAuth);
  const [authError, setAuthError] = useState<string | null>(null);
  const [savedPin, setSavedPin] = useState<string>(() => localStorage.getItem('owner_pin') || '');

  // Messages and state
  const [messages, setMessages] = useState<StampMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [sendingReply, setSendingReply] = useState<boolean>(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'unreplied' | 'replied' | 'pinned' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Settings & Live Website Editor
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<'content' | 'security'>('content');
  const [newPin, setNewPin] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newWelcome, setNewWelcome] = useState<string>('');
  const [siteHeadline, setSiteHeadline] = useState<string>('The stamp bridge');
  const [siteSubtitle, setSiteSubtitle] = useState<string>('Where unspoken thoughts from the laboratory find quiet passage.');
  const [heroIntro, setHeroIntro] = useState<string>('');
  const [purposeText, setPurposeText] = useState<string>('');
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Load messages from backend with saved pin
  const fetchOwnerMessages = async (activePin: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/messages', {
        headers: {
          'x-owner-pin': activePin,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication required');
      }
      setMessages(data.messages || []);
      if (data.messages && data.messages.length > 0 && !selectedMessageId) {
        setSelectedMessageId(data.messages[0].id);
      }
    } catch (err: any) {
      setIsAuthenticated(false);
      localStorage.removeItem('owner_pin');
      setAuthError(err.message || 'Session expired or invalid PIN.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (savedPin) {
      handleAuthWithPin(savedPin, false);
    }
  }, []);

  const handleAuthWithPin = async (pinToTry: string, showError: boolean = true) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/owner/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToTry.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Incorrect PIN');
      }

      setIsAuthenticated(true);
      setSavedPin(pinToTry.trim());
      localStorage.setItem('owner_pin', pinToTry.trim());
      onLockStateChange(true);
      setNewTitle(data.recipientTitle || '');
      setNewWelcome(data.welcomeNote || '');
      fetch('/api/public-stats')
        .then(r => r.json())
        .then(stats => {
          if (stats.siteHeadline) setSiteHeadline(stats.siteHeadline);
          if (stats.siteSubtitle) setSiteSubtitle(stats.siteSubtitle);
          if (stats.heroIntro) setHeroIntro(stats.heroIntro);
          if (stats.purposeText) setPurposeText(stats.purposeText);
        })
        .catch(() => {});
      fetchOwnerMessages(pinToTry.trim());
    } catch (err: any) {
      if (showError) {
        setAuthError(err.message || 'Invalid passcode');
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthWithPin(pin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('owner_pin');
    setSavedPin('');
    setPin('');
    onLockStateChange(false);
  };

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;

  // Send private reply from owner
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/owner/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-pin': savedPin,
        },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch reply');
      }

      // Update message in state
      setMessages(prev =>
        prev.map(m => (m.id === selectedMessage.id ? data.message : m))
      );
      setReplyText('');
      onRefreshCount();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const togglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/owner/messages/${id}/pin`, {
        method: 'PATCH',
        headers: { 'x-owner-pin': savedPin },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev =>
          prev.map(m => (m.id === id ? { ...m, pinned: data.pinned } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/owner/messages/${id}/archive`, {
        method: 'PATCH',
        headers: { 'x-owner-pin': savedPin },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev =>
          prev.map(m => (m.id === id ? { ...m, archived: data.archived } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this letter?')) return;
    try {
      const res = await fetch(`/api/owner/messages/${id}`, {
        method: 'DELETE',
        headers: { 'x-owner-pin': savedPin },
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessageId === id) {
          setSelectedMessageId(null);
        }
        onRefreshCount();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/owner/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-pin': savedPin,
        },
        body: JSON.stringify({
          newPin: newPin.trim() || undefined,
          recipientTitle: newTitle.trim() || undefined,
          welcomeNote: newWelcome.trim() || undefined,
          siteHeadline: siteHeadline.trim() || undefined,
          siteSubtitle: siteSubtitle.trim() || undefined,
          heroIntro: heroIntro.trim() || undefined,
          purposeText: purposeText.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (newPin.trim()) {
        setSavedPin(newPin.trim());
        localStorage.setItem('owner_pin', newPin.trim());
      }
      setSettingsMessage('Website content & settings updated live!');
      onRefreshCount();
      setTimeout(() => {
        setSettingsMessage(null);
        setShowSettings(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(m => {
    if (statusFilter === 'unreplied' && m.status === 'replied') return false;
    if (statusFilter === 'replied' && m.status !== 'replied') return false;
    if (statusFilter === 'pinned' && !m.pinned) return false;
    if (statusFilter === 'archived' && !m.archived) return false;
    if (statusFilter !== 'archived' && m.archived) return false;

    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchContent = m.content.toLowerCase().includes(query);
      const matchAlias = (m.senderAlias || '').toLowerCase().includes(query);
      const matchCode = m.accessCode.toLowerCase().includes(query);
      return matchContent || matchAlias || matchCode;
    }
    return true;
  });

  const unrepliedCount = messages.filter(m => !m.archived && m.status !== 'replied').length;

  // ================= LOCKED PIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-sm border border-[#CFDBCB] text-center space-y-6">
        
        <div className="w-14 h-14 rounded-full bg-[#F4F7F4] text-[#3B5337] flex items-center justify-center mx-auto border border-[#CFDBCB]">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1D2A20]">
            The Recipient's Desk
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6945] leading-relaxed">
            This private area is exclusively for the bridge recipient to unlock and read all incoming anonymous stamps and write individual replies.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label htmlFor="ownerPinInput" className="block text-xs font-medium uppercase tracking-wider text-[#4A6945]">
              Enter Secret Desk PIN
            </label>
            <input
              id="ownerPinInput"
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="Enter your private passcode"
              className="w-full px-4 py-3 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-center font-mono text-base tracking-widest text-[#1D2A20] focus:outline-none focus:border-[#3B5337] focus:ring-1 focus:ring-[#3B5337]"
              autoFocus
              required
            />
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Letters & Reply Desk</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#E6ECE5] text-[11px] text-[#5F8359] leading-relaxed text-center">
          <p className="flex items-center justify-center gap-1.5 text-[#4A6945]">
            <Lock className="w-3.5 h-3.5 text-[#3B5337]" />
            <span>Authorized recipient access only. All letters & private replies are strictly protected.</span>
          </p>
        </div>

      </div>
    );
  }

  // ================= AUTHENTICATED OWNER DESK =================
  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Desk Top Navigation Bar */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#CFDBCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#1D2A20] font-semibold">
              Recipient Reading Desk
            </h2>
          </div>
          <p className="text-xs text-[#5F8359] mt-0.5">
            Total Stamps: <strong className="text-[#1D2A20] font-mono">{messages.length}</strong> ·{' '}
            Unreplied: <strong className="text-emerald-700 font-mono">{unrepliedCount}</strong> ·{' '}
            Replied: <strong className="text-[#1D2A20] font-mono">{messages.filter(m => m.status === 'replied').length}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setSettingsTab('content');
              setShowSettings(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#AAC0A5]" />
            <span>Edit Website Content</span>
          </button>

          {onOpenDesignModal && (
            <button
              onClick={onOpenDesignModal}
              className="px-3.5 py-2 text-xs font-semibold text-[#2A3A29] bg-[#E6ECE5] hover:bg-[#CFDBCB] border border-[#CFDBCB] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Open Design Studio to edit colors, typography, and paper texture"
            >
              <Palette className="w-3.5 h-3.5 text-[#3B5337]" />
              <span>Theme & Colors</span>
            </button>
          )}

          <button
            onClick={() => {
              setSettingsTab('security');
              setShowSettings(true);
            }}
            className="px-3.5 py-2 text-xs font-medium text-[#2A3A29] bg-[#F4F7F4] hover:bg-[#E6ECE5] border border-[#CFDBCB] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-[#5F8359]" />
            <span>Security & PIN</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Desk</span>
          </button>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#CFDBCB] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F4F7F4] p-1 rounded-xl">
          {(
            [
              { id: 'all', label: 'All Letters' },
              { id: 'unreplied', label: `Needs Reply (${unrepliedCount})` },
              { id: 'replied', label: 'Replied' },
              { id: 'pinned', label: 'Pinned' },
              { id: 'archived', label: 'Archived' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-white text-[#1D2A20] shadow-xs'
                  : 'text-[#4A6945] hover:text-[#1D2A20]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category filter & Search input */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F8FAF7] border border-[#CFDBCB] rounded-lg text-[#1D2A20] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#5F8359] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search letters..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAF7] border border-[#CFDBCB] rounded-lg text-[#1D2A20] placeholder-[#81A27B] focus:outline-none focus:border-[#3B5337]"
            />
          </div>
        </div>

      </div>

      {/* Main Two-Column Reading Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Messages List (4 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CFDBCB] overflow-hidden divide-y divide-[#E6ECE5] max-h-[720px] flex flex-col">
          
          <div className="p-3.5 bg-[#F8FAF7] border-b border-[#E6ECE5] flex items-center justify-between text-xs text-[#5F8359]">
            <span>Showing {filteredMessages.length} letters</span>
            <button
              onClick={() => fetchOwnerMessages(savedPin)}
              className="text-[#3B5337] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-[#E6ECE5]">
            {filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#5F8359] space-y-1">
                <p className="font-serif text-sm text-[#1D2A20]">No letters match this filter.</p>
                <p>When students send anonymous stamps, they will appear right here.</p>
              </div>
            ) : (
              filteredMessages.map(msg => {
                const isSelected = selectedMessageId === msg.id;
                const stampInfo = STAMP_DESIGNS.find(s => s.id === msg.stampDesign) || STAMP_DESIGNS[0];
                const catInfo = CATEGORIES.find(c => c.id === msg.category);
                const hasReplied = msg.status === 'replied';

                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={`p-4 transition-colors cursor-pointer text-left relative ${
                      isSelected
                        ? 'bg-[#F4F7F4] border-l-4 border-l-[#3B5337]'
                        : 'hover:bg-[#FAFBF9]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{stampInfo.symbol}</span>
                        <span className="font-mono text-xs font-semibold text-[#1D2A20]">
                          {msg.accessCode}
                        </span>
                        {msg.pinned && (
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline" />
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {hasReplied ? (
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-medium">
                            Replied
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm font-medium">
                            Needs Reply
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-[#4A6945] mb-1 flex items-center gap-1.5">
                      <span>{msg.senderAlias || 'Anonymous MedTech'}</span>
                      {catInfo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{catInfo.label}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-[#1D2A20] line-clamp-2 leading-relaxed">
                      {msg.content}
                    </p>

                    <div className="text-[10px] font-mono text-[#81A27B] mt-2">
                      {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Detailed Reader & Private Reply Composer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#CFDBCB] p-6 sm:p-8 space-y-6">
          {selectedMessage ? (
            <div className="space-y-6">
              
              {/* Message Header & Action Toolbar */}
              <div className="flex items-start justify-between border-b border-[#E6ECE5] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#1D2A20]">
                      {selectedMessage.accessCode}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#F4F7F4] text-[#4A6945] border border-[#CFDBCB]">
                      {CATEGORIES.find(c => c.id === selectedMessage.category)?.label || 'General'}
                    </span>
                  </div>
                  <div className="text-xs text-[#5F8359]">
                    From: <strong className="text-[#1D2A20]">{selectedMessage.senderAlias || 'Anonymous MedTech'}</strong>{' '}
                    · {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => togglePin(selectedMessage.id, e)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      selectedMessage.pinned
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'border-[#CFDBCB] text-[#5F8359] hover:bg-[#F4F7F4]'
                    }`}
                    title="Pin letter"
                  >
                    <Star className={`w-4 h-4 ${selectedMessage.pinned ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={e => toggleArchive(selectedMessage.id, e)}
                    className="p-2 rounded-lg border border-[#CFDBCB] text-[#5F8359] hover:bg-[#F4F7F4] transition-colors cursor-pointer"
                    title={selectedMessage.archived ? 'Unarchive' : 'Archive letter'}
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={e => deleteMessage(selectedMessage.id, e)}
                    className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Letter Content in ruled paper style */}
              <div className="p-5 bg-[#FCFDFB] rounded-xl border border-[#CFDBCB] letter-ruled text-sm sm:text-base text-[#1D2A20] font-serif leading-relaxed whitespace-pre-wrap">
                {selectedMessage.content}
              </div>

              {/* Existing Correspondence Replies */}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#5F8359] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Private Thread Correspondence</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedMessage.replies.map((reply, index) => {
                      const isOwner = reply.sender === 'owner';
                      return (
                        <div
                          key={reply.id || index}
                          className={`p-4 rounded-xl border text-xs sm:text-sm ${
                            isOwner
                              ? 'bg-[#F4F7F4] border-[#AAC0A5] ml-4'
                              : 'bg-white border-[#CFDBCB] mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-[#5F8359] mb-1">
                            <span className="font-semibold text-[#1D2A20]">
                              {isOwner ? 'Your Private Reply' : `${selectedMessage.senderAlias || 'Sender'} Follow-up`}
                            </span>
                            <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[#1D2A20] font-serif leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Private Reply Composer */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-[#E6ECE5]">
                <div className="flex items-center justify-between">
                  <label htmlFor="replyTextarea" className="block text-xs font-semibold uppercase tracking-wider text-[#1D2A20]">
                    Compose Private Reply to this Sender
                  </label>
                  <span className="text-[11px] text-[#5F8359]">
                    Only viewable by code: <strong className="font-mono text-[#1D2A20]">{selectedMessage.accessCode}</strong>
                  </span>
                </div>

                {/* Quick MedTech Empathy Suggestions */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="text-[#5F8359] py-0.5">Quick prompts:</span>
                  {[
                    'You did great tonight, get some rest.',
                    'The board exam is tough, but you are tougher.',
                    'Never doubt your worth over one bad slide.',
                    'Thank you for carrying this so gracefully.',
                  ].map((prompt, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setReplyText(prev => (prev ? `${prev} ${prompt}` : prompt))}
                      className="px-2 py-0.5 bg-[#F4F7F4] hover:bg-[#E6ECE5] border border-[#CFDBCB] rounded text-[#31432E] transition-colors cursor-pointer"
                    >
                      + "{prompt}"
                    </button>
                  ))}
                </div>

                <textarea
                  id="replyTextarea"
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a kind, personal reply. The sender will see this when they check their Secret Retrieval Code..."
                  className="w-full p-4 text-sm bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-[#1D2A20] placeholder-[#81A27B] focus:outline-none focus:border-[#3B5337] focus:ring-1 focus:ring-[#3B5337]"
                  required
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#5F8359]">
                    Confidential & sent directly to the sender's private retrieval ticket.
                  </span>
                  <button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] disabled:bg-[#CFDBCB] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {sendingReply ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-[#AAC0A5]" />
                    )}
                    <span>Send Private Reply</span>
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="py-20 text-center space-y-2 text-[#5F8359]">
              <MessageSquare className="w-8 h-8 mx-auto text-[#AAC0A5]" />
              <p className="font-serif text-lg text-[#1D2A20]">Select a letter from the left column to read.</p>
              <p className="text-xs">You can read every message and write your private reply back to each student.</p>
            </div>
          )}
        </div>

      </div>

      {/* Live Website Editor & Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-[#CFDBCB] shadow-2xl animate-fadeIn my-8 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-[#E6ECE5] pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3B5337] text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1D2A20]">
                    Live Website Editor & Desk Settings
                  </h3>
                  <p className="text-xs text-[#5F8359]">
                    Edit website titles, laboratory narrative, purpose text, and security
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-lg text-[#5F8359] hover:bg-[#E6ECE5] hover:text-[#1D2A20] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subtabs */}
            <div className="flex border-b border-[#E6ECE5] bg-[#F8FAF7] rounded-xl p-1 text-xs font-medium text-[#4A6945] shrink-0">
              <button
                type="button"
                onClick={() => setSettingsTab('content')}
                className={`flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  settingsTab === 'content'
                    ? 'bg-white text-[#1D2A20] font-semibold shadow-xs'
                    : 'hover:text-[#1D2A20]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Website Content</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsTab('security')}
                className={`flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  settingsTab === 'security'
                    ? 'bg-white text-[#1D2A20] font-semibold shadow-xs'
                    : 'hover:text-[#1D2A20]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Passcode & Security</span>
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 overflow-y-auto pr-1 flex-1">
              
              {settingsTab === 'content' && (
                <div className="space-y-4 text-xs">
                  
                  {/* Site Headline */}
                  <div className="space-y-1">
                    <label className="block uppercase font-medium tracking-wider text-[#4A6945]">
                      Website Title / Header
                    </label>
                    <input
                      type="text"
                      value={siteHeadline}
                      onChange={e => setSiteHeadline(e.target.value)}
                      placeholder="e.g. The stamp bridge"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm font-serif font-bold text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1">
                    <label className="block uppercase font-medium tracking-wider text-[#4A6945]">
                      Website Subtitle
                    </label>
                    <input
                      type="text"
                      value={siteSubtitle}
                      onChange={e => setSiteSubtitle(e.target.value)}
                      placeholder="e.g. Where unspoken thoughts from the laboratory find quiet passage."
                      className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>

                  {/* Recipient Title */}
                  <div className="space-y-1">
                    <label className="block uppercase font-medium tracking-wider text-[#4A6945]">
                      Recipient Identity / Desk Name
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Shane / Chief MedTech Intern"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>

                  {/* Laboratory Narrative (Introduction) */}
                  <div className="space-y-1">
                    <label className="block uppercase font-medium tracking-wider text-[#4A6945]">
                      MedTech Introduction Narrative (Homepage)
                    </label>
                    <textarea
                      rows={3}
                      value={heroIntro}
                      onChange={e => setHeroIntro(e.target.value)}
                      placeholder="Explain what MedTech students experience..."
                      className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>

                  {/* The Purpose */}
                  <div className="space-y-1">
                    <label className="block uppercase font-medium tracking-wider text-[#4A6945]">
                      "The Purpose" Callout Description
                    </label>
                    <textarea
                      rows={3}
                      value={purposeText}
                      onChange={e => setPurposeText(e.target.value)}
                      placeholder="Explain the purpose of the bridge and anonymous letters..."
                      className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>

                  {/* Welcome Note */}
                  <div className="space-y-1">
                    <label className="block uppercase font-medium tracking-wider text-[#4A6945]">
                      Personal Welcome Note to Senders
                    </label>
                    <textarea
                      rows={2}
                      value={newWelcome}
                      onChange={e => setNewWelcome(e.target.value)}
                      placeholder="Personal message from you to students who visit..."
                      className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                  </div>

                </div>
              )}

              {settingsTab === 'security' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#F8FAF7] rounded-xl border border-[#CFDBCB] space-y-1">
                    <span className="font-semibold text-[#1D2A20] block">
                      Desk Security Passcode
                    </span>
                    <p className="text-[#5F8359]">
                      This PIN secures your Recipient Desk so only you can read all incoming letters and write private replies.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block uppercase font-medium tracking-wider text-[#4A6945]">
                      Set New 4+ Character PIN
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={e => setNewPin(e.target.value)}
                      placeholder="Enter new secret PIN (leave blank to keep current)"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAF7] border border-[#CFDBCB] rounded-xl text-sm font-mono tracking-widest text-[#1D2A20] focus:outline-none focus:border-[#3B5337]"
                    />
                    <p className="text-[11px] text-[#5F8359]">
                      Current saved PIN is active. Enter a new PIN only if you wish to change it.
                    </p>
                  </div>
                </div>
              )}

              {settingsMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-medium border border-emerald-200">
                  {settingsMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E6ECE5]">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2.5 text-xs font-medium text-[#4A6945] hover:text-[#1D2A20] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#3B5337] hover:bg-[#2A3A29] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Save & Apply Live to Website
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
