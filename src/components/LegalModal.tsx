import React from 'react';
import { X, FileText } from 'lucide-react';
import { CLUB_INFO } from '../data/clubData.ts';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'rules' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: 'Tiara Sport Club — Privacy Policy',
      kicker: 'Updated for 2026 Season · Vadodara Campus',
      sections: [
        {
          heading: '1. Personal Information Collection',
          body: 'Tiara Sport Club collects member information including names, residential coordinates in Vadodara, telephone numbers, emergency medical contacts, and fitness biometric metrics solely for administrative enrollment, court bookings, and athletic tracking.'
        },
        {
          heading: '2. Email & Inquiry Processing',
          body: 'Inquiries submitted through this digital portal are handled with confidentiality via our secured administrative relay. Your contact information is never distributed to third parties.'
        },
        {
          heading: '3. Security Safeguards',
          body: 'We implement industry-standard physical and electronic security protocols across our campus facilities on Sama-Savli Road, Vadodara.'
        }
      ]
    },
    terms: {
      title: 'Tiara Sport Club — Terms of Service & Facility Use',
      kicker: 'Constitution & Club Code · Vadodara, Gujarat',
      sections: [
        {
          heading: '1. Facility Access & Registration',
          body: 'Access to Tiara Sport Club facilities is granted upon booking confirmation and registration with the sports management desk.'
        },
        {
          heading: '2. Court & Gym Reservations',
          body: 'Athletes and guests in active standing may reserve tennis courts, badminton courts, pickleball courts, and high-performance gym slots in accordance with the reservation matrix. 4-hour prior cancellation is required for unused slots.'
        },
        {
          heading: '3. Dues & Fee Schedules',
          body: 'All coaching tuition and facility reservation fees are payable according to the agreed schedule. Fees are subject to applicable GST in the State of Gujarat.'
        }
      ]
    },
    rules: {
      title: 'Tiara Sport Club — Clubhouse Bylaws',
      kicker: 'Standards of Sportsmanship & Decorum',
      sections: [
        {
          heading: '1. Court Attire & Footwear',
          body: 'Non-marking gum-rubber soles are strictly required on all wooden badminton courts and gym conditioning decks. Decoturf cushioned tennis and pickleball courts require regulation all-court shoes. Street footwear is strictly barred from all playing surfaces.'
        },
        {
          heading: '2. GYM Protocols',
          body: 'Athletes must re-rack Eleiko plates and dumbbells after each set. Athletic training footwear and gym towels are mandatory on the conditioning floor.'
        },
        {
          heading: '3. Respect & Fair Play',
          body: 'Tiara maintains an uncompromised standard of sportsmanship. Unsporting conduct toward coaches, umpires, or opponents results in immediate disciplinary review by the Governing Committee.'
        }
      ]
    }
  };

  const item = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-sm shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#0A192F]" />
            <div>
              <h3 className="text-[#0F172A] font-bold text-sm tracking-wide font-royal uppercase">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#C5A059] font-mono font-semibold">{item.kicker}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-xs leading-relaxed">
          {item.sections.map((s, idx) => (
            <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <h4 className="text-sm font-semibold text-[#0F172A] mb-1 font-sans">
                {s.heading}
              </h4>
              <p className="text-slate-600 leading-normal">{s.body}</p>
            </div>
          ))}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Tiara Sports Club · Sama-Savli Road, Vadodara</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0A192F] hover:bg-[#162B4D] text-white rounded-sm font-semibold transition-colors"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
