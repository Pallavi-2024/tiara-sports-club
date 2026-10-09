import React, { useState } from 'react';
import { ArrowUpRight, Mail, Phone, MapPin, CheckCircle, ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { CLUB_INFO } from '../data/clubData.ts';
import { subscribeNewsletter } from '../lib/api.ts';

interface FooterProps {
  navigate: (route: string) => void;
  openInquiryModal: (sport?: string) => void;
  openLegalModal: (type: 'privacy' | 'terms' | 'rules') => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, openInquiryModal, openLegalModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setNewsletterError('');
    try {
      await subscribeNewsletter(newsletterEmail);
      setSubscribed(true);
      setNewsletterEmail('');
    } catch {
      setNewsletterError('Could not connect. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNav = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071120] text-slate-300 border-t border-[#0A192F] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Feature Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-14 border-b border-[#162B4D]">
          <div className="flex items-start gap-4 p-5 rounded-sm bg-[#0A192F] border border-[#162B4D]">
            <div className="p-3 bg-[#11233F] border border-[#1E3A66] text-[#C5A059] rounded-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide">ITF & BWF Standards</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                8 ITF tournament tennis courts & 8 BWF-approved badminton courts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-sm bg-[#0A192F] border border-[#162B4D]">
            <div className="p-3 bg-[#11233F] border border-[#1E3A66] text-[#C5A059] rounded-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide">Pickleball & Elite GYM</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                4 USAPA cushioned courts & 14,000 sq ft Olympic conditioning gym in Vadodara.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-sm bg-[#0A192F] border border-[#162B4D]">
            <div className="p-3 bg-[#11233F] border border-[#1E3A66] text-[#C5A059] rounded-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide">Royal Vadodara Heritage</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                32-acre private athletic estate on Sama-Savli Road, Vadodara, Gujarat.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Direct Google Map Link Section */}
        <div className="py-8 border-b border-[#162B4D]">
          <div className="bg-[#0A192F] border border-[#162B4D] hover:border-[#C5A059]/40 rounded-sm p-5 sm:p-6 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-[#11233F] border border-[#1E3A66] text-[#C5A059] rounded-sm shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold text-base font-royal">
                      Tiara Sports Club on Google Maps
                    </h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#162B4D] text-[#C5A059] font-medium border border-[#1E3A66]">
                      Direct Navigation
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, Sama-Savli Road, Vadodara
                  </p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Tiara+Sports+Club+Besides+Red+Coral+greens+opposite+Nayara+petrol+pump+sama-savli+road+Vadodara"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#071120] text-xs font-bold rounded-sm transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm group"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-[#162B4D]">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-sm bg-[#0A192F] border border-[#162B4D] flex items-center justify-center p-1.5 shadow-sm">
                <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                  <path
                    d="M16 2L20 9L29 7L24 16L27 26L16 22L5 26L8 16L3 7L12 9L16 2Z"
                    stroke="#C5A059"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="14" r="3" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="font-royal text-xl font-bold tracking-wider text-white">
                TIARA <span className="text-[#C5A059] text-xs font-sans font-bold uppercase tracking-widest">SPORT CLUB</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Established in Vadodara to cultivate athletic mastery, sportsmanship, and holistic physical performance. Home to champions and patrons across Gujarat.
            </p>
          </div>

          {/* Directory Column 1: Navigation */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-bold mb-4 font-mono">
              Club Directory
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/sports-facilities')} className="hover:text-white transition-colors">
                  Sports & Facilities Hub
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/blog')} className="hover:text-white transition-colors">
                  Sports Science Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-white transition-colors">
                  Location & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Directory Column 2: Sporting Disciplines */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-bold mb-4 font-mono">
              Key Disciplines
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('/sports-facilities')} className="hover:text-white transition-colors">
                  Tennis
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/sports-facilities')} className="hover:text-white transition-colors">
                  Badminton
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/sports-facilities')} className="hover:text-white transition-colors">
                  Pickleball
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/sports-facilities')} className="hover:text-white transition-colors">
                  GYM
                </button>
              </li>
            </ul>
          </div>

          {/* Directory Column 3: Vadodara Contact */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-bold mb-4 font-mono">
              Campus & Desk
            </h5>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <address className="not-italic leading-relaxed text-slate-200">
                    Tiara Sports Club,<br />
                    Besides Red Coral greens, opposite Nayara petrol pump,<br />
                    Sama-Savli Road, Vadodara
                  </address>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Tiara+Sports+Club+Besides+Red+Coral+greens+opposite+Nayara+petrol+pump+sama-savli+road+Vadodara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#C5A059] hover:text-[#e4be72] hover:underline mt-1 font-medium group"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <div>
                  <a href="tel:+912652984000" className="text-white hover:underline font-medium block">
                    +91 265 2984000
                  </a>
                  <a href="tel:+919825014820" className="text-slate-400 hover:text-white block text-[11px]">
                    +91 98250 14820 (Mobile)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:contact@tiarasportclub.com" className="hover:underline text-slate-200">
                  contact@tiarasportclub.com
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openInquiryModal()}
                  className="w-full py-2.5 px-3 text-center rounded-sm bg-[#0A192F] hover:bg-[#162B4D] border border-[#162B4D] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>© {new Date().getFullYear()} Tiara Sport Club, Vadodara. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => openLegalModal('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => openLegalModal('terms')}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <button
              onClick={() => openLegalModal('rules')}
              className="hover:text-white transition-colors"
            >
              Clubhouse Bylaws
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
