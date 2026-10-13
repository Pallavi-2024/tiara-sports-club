import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { InquiryModal } from './components/InquiryModal.tsx';
import { LegalModal } from './components/LegalModal.tsx';

import { HomeView } from './views/HomeView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { SportsFacilitiesView } from './views/SportsFacilitiesView.tsx';
import { BlogView } from './views/BlogView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { AdminView } from './views/AdminView.tsx';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [lastNonAdminRoute, setLastNonAdminRoute] = useState<string>('/');
  const [shortcutToast, setShortcutToast] = useState<string | null>(null);

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryModalSport, setInquiryModalSport] = useState<string | undefined>(undefined);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'rules' | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global secret shortcut: Ctrl + Shift + B (or Cmd + Shift + B on macOS)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isKeyB = e.key === 'B' || e.key === 'b' || e.code === 'KeyB';

      if (isCtrlOrCmd && isShift && isKeyB) {
        e.preventDefault();
        setCurrentRoute((prev) => {
          if (prev === '/admin') {
            const target = lastNonAdminRoute === '/admin' ? '/' : lastNonAdminRoute;
            if (window.location.pathname !== target) {
              window.history.pushState({}, '', target);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShortcutToast('Admin Panel Hidden');
            setTimeout(() => setShortcutToast(null), 2500);
            return target;
          } else {
            setLastNonAdminRoute(prev);
            if (window.location.pathname !== '/admin') {
              window.history.pushState({}, '', '/admin');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShortcutToast('Admin Panel Activated');
            setTimeout(() => setShortcutToast(null), 2500);
            return '/admin';
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastNonAdminRoute]);

  const navigate = (route: string) => {
    if (route !== '/admin') {
      setLastNonAdminRoute(route);
    }
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openInquiryModal = (sportName?: string) => {
    setInquiryModalSport(sportName);
    setInquiryModalOpen(true);
  };

  // Determine active view
  const renderView = () => {
    if (currentRoute === '/about') {
      return <AboutView navigate={navigate} openInquiryModal={openInquiryModal} />;
    }
    if (currentRoute === '/sports-facilities' || currentRoute === '/facilities' || currentRoute === '/sports') {
      return <SportsFacilitiesView openInquiryModal={openInquiryModal} />;
    }
    if (currentRoute.startsWith('/blog')) {
      const slug = currentRoute.startsWith('/blog/') ? currentRoute.replace('/blog/', '') : undefined;
      return <BlogView initialSlug={slug} navigate={navigate} />;
    }
    if (currentRoute === '/contact') {
      return <ContactView />;
    }
    if (currentRoute === '/admin') {
      return <AdminView navigate={navigate} />;
    }
    // Default to Home
    return <HomeView navigate={navigate} openInquiryModal={openInquiryModal} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        openInquiryModal={openInquiryModal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Classic Master Footer */}
      <Footer
        navigate={navigate}
        openInquiryModal={openInquiryModal}
        openLegalModal={(type) => setLegalModalType(type)}
      />

      {/* Interactive Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        initialSport={inquiryModalSport}
      />

      {/* Legal & Policy Dialogs */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Secret Shortcut Status Toast */}
      {shortcutToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white border border-[#C5A059] px-4 py-2.5 rounded-sm shadow-xl flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
          <span>{shortcutToast}</span>
        </div>
      )}
    </div>
  );
}
