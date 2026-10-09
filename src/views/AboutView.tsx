import React from 'react';
import { ArrowUpRight, CheckCircle2, Bookmark, ChevronRight } from 'lucide-react';

interface AboutViewProps {
  navigate: (route: string) => void;
  openInquiryModal: (sportName?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate, openInquiryModal }) => {
  const statsList = [
    {
      label: 'FOUNDED',
      value: '2014',
      detail: 'Vadodara, Gujarat'
    },
    {
      label: 'CAMPUS',
      value: '32 ACRES',
      detail: 'Sama-Savli Road'
    },
    {
      label: 'ACTIVE MEMBERS',
      value: '1,800+',
      detail: 'Athletes & Families'
    },
    {
      label: 'DISCIPLINES',
      value: '4 CORE',
      detail: 'Tennis, Badminton, Pickleball, GYM'
    },
    {
      label: 'CERTIFIED COACHES',
      value: '25+',
      detail: 'National & State Specialists'
    },
    {
      label: 'CAMPUS HOURS',
      value: '05:30 – 22:30',
      detail: 'Daily Floodlit Access'
    }
  ];

  const infrastructureSpecs = [
    {
      title: 'Lawn Tennis Arena',
      description: 'ITF Level 3 cushioned acrylic hard courts with high ball consistency, non-glare LED illumination, and dedicated junior coaching zones.'
    },
    {
      title: 'Badminton Teak Arena',
      description: 'BWF-specification sprung teak hardwood subfloors with tournament vinyl mats, 11m ceiling clearance, and zero-drift laminar airflow.'
    },
    {
      title: 'Pro Pickleball Complex',
      description: 'USAPA tournament regulation cushioned acrylic courts with heavy-duty permanent steel posts, textured non-skid surface, and floodlit evening mixers.'
    },
    {
      title: 'Strength & Conditioning GYM',
      description: '14,000 sq. ft. athletic performance facility equipped with Olympic lifting platforms, Keiser pneumatic machines, sprint turf track, and sports science guidance.'
    }
  ];

  const leadershipList = [
    {
      number: '01',
      name: 'NAVEEN KULKARNI',
      role: 'Director of Tennis & Head Coach',
      credentials: 'ITF Level-3 High Performance Coach · Former National Circuit Player',
      bio: 'Brings over 15 years of competitive tennis coaching expertise. Directs Tiara’s junior and pro tennis academy, modern biomechanics stroke training, and state-level tournament development on our ITF courts.'
    },
    {
      number: '02',
      name: 'DEVENDRA JOSHI',
      role: 'Director of Badminton & Technical Head',
      credentials: 'BWF Certified Coach · Former National Camp Senior Specialist',
      bio: 'Leads badminton operations and coaching syllabi across Tiara’s BWF-grade sprung teak arenas. Specializes in advanced footwork agility, deceptive tactical play, and grassroots junior talent identification.'
    },
    {
      number: '03',
      name: 'RAKESH SHARMA',
      role: 'Director of Pickleball & Racquet Sports Commissioner',
      credentials: 'PPR Certified Professional · State Pickleball Convener & Tournament Director',
      bio: 'Pioneered tournament and competitive pickleball in Vadodara. Manages Tiara’s USAPA-regulation courts, weekly evening rating leagues, corporate mixers, and open clinic programs for players of all ages.'
    },
    {
      number: '04',
      name: 'DR. SAMARJIT DESHMUKH',
      role: 'Director of High-Performance & GYM Conditioning',
      credentials: 'CSCS (Certified Strength & Conditioning Specialist) · Sports Science Consultant',
      bio: 'Directs the 14,000 sq. ft. conditioning arena. Specializes in periodized athletic strength cycles, velocity-based training, postural alignment, and sport-specific speed and injury-prevention protocols.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen py-10 lg:py-14 space-y-16">
      {/* SECTION 1: WHO WE ARE (ABOUT US) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0A192F] bg-white border border-slate-300 px-3 py-1 rounded-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span>About Us · Vadodara Campus Heritage</span>
            </div>

            <h1 className="font-royal text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#0F172A] leading-tight">
              WHO WE ARE
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed font-normal">
            Tiara Sports Club is Vadodara’s premier multi-sport athletic institution, situated on Sama-Savli Road (besides Red Coral greens, opposite Nayara petrol pump). Founded with a vision to make genuine international-grade sporting infrastructure accessible to Gujarat’s athletes and families, we combine tournament-certified courts with dedicated coaching faculties and a vibrant, health-focused community culture.
          </p>

          {/* Stats Bar */}
          <div className="border border-slate-200 bg-white rounded-sm p-5 sm:p-6 shadow-sm grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statsList.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                  {stat.label}
                </div>
                <div className="font-royal text-xl sm:text-2xl font-bold text-[#0A192F] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: THE INSTITUTION & PHILOSOPHY / WHAT IS TIARA SPORTS CLUB? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Narrative & Action */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0A192F] font-bold">
              <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>THE INSTITUTION & PHILOSOPHY</span>
            </div>

            <h2 className="font-royal text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-[#0F172A] tracking-tight">
              WHAT IS TIARA SPORTS CLUB?
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <p>
                Tiara Sports Club was conceived to bridge a critical gap in regional athletic development: the demand for certified, tournament-specification sports facilities where players of every skill level can practice, compete, and flourish under one roof.
              </p>
              <p>
                Located along the accessible Sama-Savli Road corridor, our campus integrates four championship disciplines: Lawn Tennis on ITF-certified cushioned hard courts, Badminton across climate-controlled BWF-standard sprung teakwood arenas, pro Pickleball on USAPA tournament courts, and a comprehensive 14,000 sq. ft. high-performance strength and conditioning GYM.
              </p>
              <p>
                From young cadets starting their sporting journey in structured academies to working professionals enjoying evening matches under stadium LED floodlights, Tiara offers an energetic, welcoming sanctuary where competitive excellence and active family wellness go hand in hand.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => navigate('/sports-facilities')}
                className="px-6 py-3 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs uppercase tracking-widest font-bold rounded-sm shadow-sm transition-all flex items-center gap-2"
              >
                <span>EXPLORE SPORTS ARENAS</span>
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <button
                onClick={() => openInquiryModal()}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#0A192F] border border-slate-300 text-xs uppercase tracking-widest font-bold rounded-sm shadow-sm transition-all flex items-center gap-2"
              >
                <span>INQUIRY</span>
                <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>

          {/* Right Column: Infrastructure Specifications Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-sm p-6 sm:p-7 space-y-5">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                FEDERATION-GRADE INFRASTRUCTURE
              </div>
              <h3 className="font-royal text-base sm:text-lg font-bold uppercase text-[#0F172A] tracking-wide">
                ENGINEERED SPECIFICATIONS
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              {infrastructureSpecs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0D382B] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                      {spec.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {spec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MANAGEMENT'S ADDRESS & LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Management Address Box */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                EXECUTIVE LEADERSHIP MESSAGE
              </span>
              <div className="flex items-center gap-2">
                <span className="font-royal text-2xl font-bold text-[#C5A059] leading-none">”</span>
                <h3 className="font-royal text-lg sm:text-xl font-bold uppercase text-[#0F172A] tracking-wide">
                  FROM THE DESK OF THE MANAGEMENT
                </h3>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest font-semibold">
              EST. 2014 · VADODARA
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 italic leading-relaxed max-w-4xl">
            <p>
              “Our founding philosophy at Tiara Sports Club is rooted in a fundamental conviction: no athlete from Vadodara should ever be constrained by subpar infrastructure. Every aspiring player deserves access to federation-grade courts, quality lighting, and dedicated coaching guidance right here in our city.”
            </p>
            <p>
              “Whether you are introducing your child to junior racquets, enjoying an evening game of pickleball or badminton under floodlights after work, or pushing physical boundaries in our conditioning gym, Tiara was engineered to be your athletic sanctuary. We measure our impact by the discipline cultivated, health enhanced, and sportsmanship fostered across all four sporting disciplines.”
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div>
              <div className="font-royal text-sm font-bold text-[#0A192F] uppercase tracking-wide">
                TIARA MANAGEMENT BOARD
              </div>
              <div className="text-xs text-slate-500">
                Governing Board & Sports Directors · Tiara Sports Club, Vadodara
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">
              <div className="font-medium text-slate-700">Vadodara Campus</div>
              <div>Sama-Savli Road, Vadodara, Gujarat</div>
            </div>
          </div>
        </div>

        {/* Leadership & Technical Directors */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
              LEADERSHIP & TECHNICAL DIRECTORS
            </span>
            <h2 className="font-royal text-2xl sm:text-3xl font-bold uppercase text-[#0F172A] tracking-tight">
              SPORTS DIRECTORS & HEAD COACHES
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Our discipline directors lead coaching operations across Tennis, Badminton, Pickleball, and GYM Conditioning with recognized credentials and decades of tournament experience.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {leadershipList.map((leader) => (
              <div
                key={leader.number}
                className="bg-white border border-slate-200 hover:border-slate-300 shadow-sm rounded-sm p-6 space-y-3 relative flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-royal text-base font-bold uppercase text-[#0F172A] tracking-wide">
                        {leader.name}
                      </h3>
                      <div className="text-xs font-semibold text-[#0A192F] mt-0.5">
                        {leader.role}
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-slate-400 group-hover:text-[#C5A059] transition-colors">
                      {leader.number}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    {leader.credentials}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed font-normal">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
