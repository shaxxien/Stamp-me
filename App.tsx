/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DropStampForm } from './components/DropStampForm';
import { CheckStampView } from './components/CheckStampView';
import { AboutBridgeView } from './components/AboutBridgeView';
import { JournalFeed } from './components/JournalFeed';
import { OwnerDeskView } from './components/OwnerDeskView';
import { Footer } from './components/Footer';
import { LifetimeShareModal } from './components/LifetimeShareModal';
import { DesignEditorModal } from './components/DesignEditorModal';
import { PublicBridgeStats, ThemeSettings, THEME_PRESETS } from './types';
import { applyCanvaFonts } from './utils/canvaFontLoader';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'write' | 'track' | 'about' | 'feed' | 'owner'>('write');
  const [trackCode, setTrackCode] = useState<string>('');
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [stats, setStats] = useState<PublicBridgeStats | null>(null);
  const [unrepliedCount, setUnrepliedCount] = useState<number>(0);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showDesignModal, setShowDesignModal] = useState<boolean>(false);

  const [currentTheme, setCurrentTheme] = useState<ThemeSettings>(() => {
    const cached = localStorage.getItem('bridge_theme');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return THEME_PRESETS.sage;
  });

  const applyThemeToDom = (t: ThemeSettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', t.primaryColor);
    root.style.setProperty('--theme-primary-dark', t.primaryDark);
    root.style.setProperty('--theme-bg', t.bgColor);
    root.style.setProperty('--theme-card', t.cardColor);
    root.style.setProperty('--theme-border', t.borderColor);
    document.body.style.backgroundColor = t.bgColor;
    applyCanvaFonts(t);
  };

  // Fetch public stats on mount
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/public-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (data.theme) {
          const cached = localStorage.getItem('bridge_theme');
          if (!cached) {
            setCurrentTheme(data.theme);
            applyThemeToDom(data.theme);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching bridge stats:', e);
    }
  };

  useEffect(() => {
    applyThemeToDom(currentTheme);
  }, [currentTheme]);

  // Check saved owner auth
  useEffect(() => {
    fetchStats();
    const savedPin = localStorage.getItem('owner_pin');
    if (savedPin) {
      fetch('/api/owner/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: savedPin }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsOwnerAuthenticated(true);
            // Fetch messages count
            fetch('/api/owner/messages', {
              headers: { 'x-owner-pin': savedPin },
            })
              .then(mRes => mRes.json())
              .then(mData => {
                if (mData.messages) {
                  const unreplied = mData.messages.filter((m: any) => !m.archived && m.status !== 'replied').length;
                  setUnrepliedCount(unreplied);
                }
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }

    // Check if URL has ?code=... or ?desk=1
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    const deskParam = urlParams.get('desk') || urlParams.get('recipient') || urlParams.get('keeper');
    if (codeParam) {
      setTrackCode(codeParam.toUpperCase());
      setCurrentTab('track');
    } else if (deskParam) {
      setCurrentTab('owner');
    }
  }, []);

  const handleNavigate = (tab: 'write' | 'track' | 'about' | 'feed' | 'owner') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStampSuccess = (code: string) => {
    setTrackCode(code);
    fetchStats();
  };

  const handleGoToTrack = (code: string) => {
    setTrackCode(code);
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyTheme = async (newTheme: ThemeSettings, saveToServer: boolean = false, optionalPin?: string) => {
    setCurrentTheme(newTheme);
    applyThemeToDom(newTheme);
    localStorage.setItem('bridge_theme', JSON.stringify(newTheme));

    if (saveToServer) {
      const activePin = optionalPin || localStorage.getItem('owner_pin');
      if (!activePin) {
        throw new Error('Please enter the Recipient Desk PIN to save this design for all visitors.');
      }
      const res = await fetch('/api/owner/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-pin': activePin,
        },
        body: JSON.stringify({ theme: newTheme }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save theme to server');
      }
      if (optionalPin && !localStorage.getItem('owner_pin')) {
        localStorage.setItem('owner_pin', optionalPin.trim());
        setIsOwnerAuthenticated(true);
      }
      fetchStats();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-[#3B5337] selection:text-white font-sans transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.bgColor,
        color: currentTheme.palette === 'nightshift' ? '#E6ECE5' : '#1D2A20',
      }}
    >
      
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        isOwnerAuthenticated={isOwnerAuthenticated}
        unrepliedCount={unrepliedCount}
        onOpenShareModal={() => setShowShareModal(true)}
        onOpenDesignModal={() => setShowDesignModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* On Write & Feed view, show the aesthetic Hero banner */}
        {currentTab === 'write' && (
          <>
            <HeroSection
              onStartWriting={() => {
                const el = document.getElementById('drop-stamp-form-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onCheckStamp={() => handleNavigate('track')}
              onReadPurpose={() => handleNavigate('about')}
              onOpenShareModal={() => setShowShareModal(true)}
              stats={stats}
              theme={currentTheme}
            />

            <div id="drop-stamp-form-section" className="scroll-mt-20">
              <DropStampForm
                onSuccess={handleStampSuccess}
                onGoToTrack={handleGoToTrack}
                recipientTitle={stats?.recipientTitle}
                paperTexture={currentTheme.paperTexture}
              />
            </div>
          </>
        )}

        {/* Check Stamp / Reply tab */}
        {currentTab === 'track' && (
          <CheckStampView
            initialCode={trackCode}
            onGoToWrite={() => handleNavigate('write')}
          />
        )}

        {/* Story & Purpose view */}
        {currentTab === 'about' && (
          <AboutBridgeView
            onWriteClick={() => handleNavigate('write')}
            onTrackClick={() => handleNavigate('track')}
          />
        )}

        {/* Community Letters Journal */}
        {currentTab === 'feed' && (
          <JournalFeed
            onWriteClick={() => handleNavigate('write')}
            onTrackClick={(code) => {
              if (code) setTrackCode(code);
              handleNavigate('track');
            }}
          />
        )}

        {/* Recipient Desk (Owner view) */}
        {currentTab === 'owner' && (
          <OwnerDeskView
            isInitiallyAuth={isOwnerAuthenticated}
            onOpenDesignModal={() => setShowDesignModal(true)}
            onLockStateChange={(isAuth) => {
              setIsOwnerAuthenticated(isAuth);
              if (!isAuth) setUnrepliedCount(0);
            }}
            onRefreshCount={() => {
              fetchStats();
              const pin = localStorage.getItem('owner_pin');
              if (pin) {
                fetch('/api/owner/messages', { headers: { 'x-owner-pin': pin } })
                  .then(r => r.json())
                  .then(d => {
                    if (d.messages) {
                      setUnrepliedCount(d.messages.filter((m: any) => !m.archived && m.status !== 'replied').length);
                    }
                  })
                  .catch(() => {});
              }
            }}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenShareModal={() => setShowShareModal(true)}
      />

      {/* Lifetime Link & QR Share Modal */}
      <LifetimeShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Live Visual Design Studio & Palette Customizer Modal */}
      <DesignEditorModal
        isOpen={showDesignModal}
        onClose={() => setShowDesignModal(false)}
        currentTheme={currentTheme}
        onApplyTheme={handleApplyTheme}
        isOwnerAuthenticated={isOwnerAuthenticated}
      />

    </div>
  );
}
