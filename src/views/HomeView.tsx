import React, { useState } from 'react';
import { ArrowUpRight, Trophy, MapPin, Calendar, Clock, ChevronRight, Activity, Users, Shield, Award, Dumbbell, CheckCircle2 } from 'lucide-react';
import { CLUB_INFO, SPORTS_DATA } from '../data/clubData.ts';
import { ThreeSportsArena } from '../components/ThreeSportsArena.tsx';

interface HomeViewProps {
  navigate: (route: string) => void;
  openInquiryModal: (sportName?: string) => void;
}

const SPORT_FACILITY_DETAILS: Record<string, string[]> = {
  tennis: [
    '8 Championship Hard & Clay Courts',
    'Night LED Stadium Floodlights',
    'Certified Coaching & Junior Squads'
  ],
  badminton: [
    '8 Teak Sprung Wooden Courts',
    'Yonex Competition Mats & Drift-Free Airflow',
    'Locker Rooms & Shower Suites'
  ],
  pickleball: [
    '4 Dedicated Regulation Courts',
    'Cushioned Non-Skid Acrylic Surface',
    'Demo Paddles & Evening Social Mixers'
  ],
  gym: [
    '14,000 sq ft Conditioning Arena',
    'Olympic Lifting & Sprint Turf Track',
    'Sports Science & Personal Trainers'
  ]
};

export const HomeView: React.FC<HomeViewProps> = ({ navigate, openInquiryModal }) => {
  const [selectedSportId, setSelectedSportId] = useState<string>('tennis');
  const [show3DView, setShow3DView] = useState<boolean>(true);

  return (
    <div className="space-y-16 bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0A192F] bg-slate-100 border border-slate-300 px-3 py-1 rounded-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span>Vadodara · Gujarat · Est. 2014</span>
            </div>

            <h1 className="font-royal text-3xl sm:text-5xl xl:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.12]">
              THE APEX OF <br />
              <span className="text-[#0A192F]">ATHLETIC EXCELLENCE</span> <br />
              IN GUJARAT.
            </h1>

            <p className="text-base sm:lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              Located on Sama-Savli Road, Tiara Sports Club features international standard facilities for Tennis, Badminton, Pickleball, and GYM.
            </p>

            {/* Crisp 4-Stat Metric Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-200 bg-[#F8FAFC] px-4 rounded-sm">
              {CLUB_INFO.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-royal text-xl sm:text-2xl font-bold text-[#0A192F] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-600 font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openInquiryModal()}
                className="px-6 py-3 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs uppercase tracking-widest font-bold rounded-sm shadow-sm transition-all flex items-center gap-2"
              >
                <span>Inquiry</span>
                <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <button
                onClick={() => navigate('/sports-facilities')}
                className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center gap-2"
              >
                <span>Explore Sports</span>
                <ChevronRight className="w-4 h-4 text-[#0A192F]" />
              </button>

              <button
                onClick={() => setShow3DView(!show3DView)}
                className="text-xs text-slate-700 hover:text-[#0A192F] font-medium tracking-wide flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-sm bg-white"
              >
                <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{show3DView ? 'Show Photo View' : 'Show 3D Arena'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Visualizer or Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-sm border border-slate-200 bg-white shadow-md overflow-hidden aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5] max-h-[520px]">
              {show3DView ? (
                <ThreeSportsArena
                  activeSportId={selectedSportId}
                  onSelectSport={(id) => {
                    setSelectedSportId(id);
                    navigate('/sports-facilities');
                  }}
                />
              ) : (
                <div className="relative w-full h-full group">
                  <img
                    src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80"
                    alt="Center Court at Tiara Sport Club Vadodara"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest font-semibold">
                      Championship Court
                    </span>
                    <h3 className="text-white text-lg font-bold font-royal mt-0.5">
                      Tiara Center Court Under Floodlights
                    </h3>
                  </div>
                </div>
              )}

              {/* Status Indicator */}
              <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-sm border border-slate-200 text-xs text-slate-800 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#0D382B]" />
                <span className="font-medium">Active Grounds · Sama-Savli Road</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPORTS DISCIPLINES: 4 SPORTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="border-l-2 border-[#0A192F] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Athletic Academies
            </span>
            <h2 className="font-royal text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
              Championship Sports Disciplines
            </h2>
          </div>

          <button
            onClick={() => navigate('/sports-facilities')}
            className="text-xs uppercase tracking-widest font-bold text-[#0A192F] hover:text-[#162B4D] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Sports</span>
            <ChevronRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>

        {/* Modular Cards Grid: 4 Core Sports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPORTS_DATA.map((sport) => (
            <div
              key={sport.id}
              className="sports-module-card rounded-sm overflow-hidden flex flex-col group bg-white"
            >
              {/* Photo Box */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#0A192F]/90 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-mono uppercase font-semibold rounded-sm">
                  {sport.category}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-royal text-lg font-bold text-[#0F172A] group-hover:text-[#0A192F] transition-colors">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {sport.tagline}
                  </p>
                </div>

                {/* Normal Facility Details */}
                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Facility Highlights
                  </div>
                  {(SPORT_FACILITY_DETAILS[sport.id] || sport.features.slice(0, 3)).map((item, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                      <span className="text-slate-700 truncate">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Card Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedSportId(sport.id);
                      navigate('/sports-facilities');
                    }}
                    className="text-xs font-semibold text-[#0A192F] hover:text-[#162B4D] flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>

                  <button
                    onClick={() => openInquiryModal(sport.name)}
                    className="px-3.5 py-1.5 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs font-semibold rounded-sm transition-colors"
                  >
                    Inquiry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CLUB HIGHLIGHTS / WHY PLAY AT TIARA */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0A192F] font-semibold">
              The Tiara Experience
            </span>
            <h2 className="font-royal text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
              Built for Serious Sport & Athletic Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#F8FAFC] border border-slate-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-sm bg-[#0A192F] text-[#C5A059] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-royal text-base font-bold text-[#0F172A]">Championship Courts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                8 ITF tournament tennis courts, 8 BWF wooden badminton courts, and 4 dedicated USAPA pickleball courts.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] border border-slate-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-sm bg-[#0A192F] text-[#C5A059] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-royal text-base font-bold text-[#0F172A]">Certified Coaching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-time national academy coaches for junior development squads, cardio clinics, and elite athletes.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] border border-slate-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-sm bg-[#0A192F] text-[#C5A059] flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="font-royal text-base font-bold text-[#0F172A]">High-Performance GYM</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                14,000 sq ft strength and conditioning floor with Eleiko Olympic platforms, Keiser machines, and sprint turf.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] border border-slate-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-sm bg-[#0A192F] text-[#C5A059] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-royal text-base font-bold text-[#0F172A]">Night Floodlighting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Broadcast-standard non-glare LED illumination across all courts, operational daily from 05:30 AM to 10:30 PM.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
