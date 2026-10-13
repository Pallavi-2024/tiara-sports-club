import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, MapPin } from 'lucide-react';
import { CLUB_INFO } from '../data/clubData.ts';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  openInquiryModal: (sportName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate, openInquiryModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    { label: 'Sports & Facilities', route: '/sports-facilities' },
    { label: 'Blog', route: '/blog' },
    { label: 'Contact', route: '/contact' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Heritage Notice Bar */}
      <div className="bg-[#071120] text-slate-300 text-xs border-b border-[#0A192F] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, Sama-Savli Road, Vadodara</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-normal">Club Hours: 05:30 AM – 10:30 PM (Daily)</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+912652984000" className="flex items-center gap-1.5 text-slate-200 hover:text-[#C5A059] transition-colors font-medium">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>+91 265 2984000</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo / Brand Crest */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A192F] rounded-sm"
          >
            <div className="relative w-11 h-11 rounded-sm bg-[#0A192F] border border-slate-700 flex items-center justify-center p-2 shadow-sm group-hover:bg-[#162B4D] transition-colors">
              <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                <path
                  d="M16 2L20 9L29 7L24 16L27 26L16 22L5 26L8 16L3 7L12 9L16 2Z"
                  stroke="#C5A059"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="14" r="3" fill="#FFFFFF" />
                <path d="M12 28H20" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-royal text-xl sm:text-2xl font-bold tracking-wider text-[#0F172A]">
                  TIARA
                </span>
                <span className="text-xs font-bold tracking-widest text-[#0A192F] uppercase font-sans">
                  SPORT CLUB
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase font-mono font-medium">
                Vadodara · Gujarat
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`px-3 py-2 text-sm font-medium transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A192F] rounded-sm ${
                    isActive
                      ? 'text-[#0A192F] font-bold'
                      : 'text-slate-600 hover:text-[#0A192F]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0A192F] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openInquiryModal()}
              className="px-5 py-2.5 rounded-sm bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs uppercase tracking-widest font-bold shadow-sm transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
            >
              <span>Inquiry</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-black border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 shadow-lg animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-1 mb-6">
              {navItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`text-left px-3 py-2.5 text-sm font-medium rounded-sm transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-[#0A192F] font-bold border-l-2 border-[#0A192F] pl-4'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A192F]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openInquiryModal();
                }}
                className="w-full py-3 rounded-sm bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>Inquiry</span>
                <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>Sama-Savli Road, Vadodara</span>
                <a href="tel:+912652984000" className="text-[#0A192F] font-semibold">
                  +91 265 2984000
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
