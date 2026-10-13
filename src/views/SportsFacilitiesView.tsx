import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, Award, X, Info } from 'lucide-react';
import { SPORTS_DATA, SportItem } from '../data/clubData.ts';

interface SportsFacilitiesViewProps {
  openInquiryModal: (sportName?: string) => void;
}

export const SportsFacilitiesView: React.FC<SportsFacilitiesViewProps> = ({ openInquiryModal }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedSportModal, setSelectedSportModal] = useState<SportItem | null>(null);

  const filterOptions = [
    { id: 'all', label: 'All Sports' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'badminton', label: 'Badminton' },
    { id: 'pickleball', label: 'Pickleball' },
    { id: 'gym', label: 'GYM' }
  ];

  const filteredSports = activeFilter === 'all'
    ? SPORTS_DATA
    : SPORTS_DATA.filter((s) => s.id === activeFilter);

  return (
    <div className="space-y-12 py-8 bg-[#F8FAFC]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0A192F] font-semibold">
            Championship Standards · Sama-Savli Road, Vadodara
          </div>
          <h1 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            SPORTS FACILITIES & COURTS.
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            International federation tournament-grade arenas for Tennis, Badminton, Pickleball, and GYM with dedicated coaching programs and night floodlights.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {filterOptions.map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#0A192F] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-[#0A192F] hover:bg-slate-200/60'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-mono hidden md:block">
            {filteredSports.length} Sporting Disciplines
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      {filteredSports.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="border-l-2 border-[#0A192F] pl-4">
            <h2 className="font-royal text-2xl font-bold text-[#0F172A]">
              Championship Arenas & Courts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredSports.map((sport) => (
              <div
                key={sport.id}
                className="sports-module-card rounded-sm overflow-hidden flex flex-col justify-between bg-white"
              >
                {/* Photo & Badge */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A192F]/90 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-mono uppercase font-semibold rounded-sm">
                    {sport.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-slate-800 px-2.5 py-1 text-[11px] font-mono font-semibold rounded-sm border border-slate-200 shadow-sm">
                    {sport.specs.standards}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-royal text-xl font-bold text-[#0F172A]">
                      {sport.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {sport.tagline}
                    </p>
                  </div>

                  {/* Normal Facility Highlights */}
                  <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-sm text-xs space-y-1.5">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] font-mono block">
                      Facility Amenities
                    </span>
                    {sport.features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Schedule & Coaches */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0A192F]" />
                      <span>{sport.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="truncate">Coaching: {sport.coaches[0]}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedSportModal(sport)}
                      className="text-xs font-semibold text-[#0A192F] hover:text-[#162B4D] flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Facility Info</span>
                    </button>

                    <button
                      onClick={() => openInquiryModal(sport.name)}
                      className="px-4 py-2 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs font-bold rounded-sm transition-colors flex items-center gap-1.5"
                    >
                      <span>Inquiry</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal: Full Technical Specifications */}
      {selectedSportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-sm border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono uppercase text-[#0A192F] font-semibold">
                  {selectedSportModal.category} Arena
                </span>
                <h3 className="font-royal text-xl font-bold text-[#0F172A]">
                  {selectedSportModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSportModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedSportModal.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#0A192F] font-bold">
                Key Features
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {selectedSportModal.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0A192F] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-sm space-y-2 text-xs">
              <h4 className="font-mono uppercase tracking-widest text-[#0A192F] font-bold text-[11px]">
                Engineering & Certification
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Surface:</span>
                  <span className="font-semibold text-slate-800">{selectedSportModal.specs.surface}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Lighting:</span>
                  <span className="font-semibold text-slate-800">{selectedSportModal.specs.lighting}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Courts/Units:</span>
                  <span className="font-semibold text-slate-800">{selectedSportModal.specs.courtsOrUnits}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Accreditation:</span>
                  <span className="font-semibold text-slate-800">{selectedSportModal.specs.standards}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-mono">
                {selectedSportModal.schedule}
              </span>

              <button
                onClick={() => {
                  const sportName = selectedSportModal.name;
                  setSelectedSportModal(null);
                  openInquiryModal(sportName);
                }}
                className="px-5 py-2.5 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs font-bold uppercase tracking-wider rounded-sm"
              >
                Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
