export interface SportItem {
  id: string;
  name: string;
  category: 'Racquet' | 'Fitness';
  tagline: string;
  description: string;
  features: string[];
  specs: {
    surface: string;
    lighting: string;
    capacity: string;
    courtsOrUnits: string;
    standards: string;
  };
  schedule: string;
  coaches: string[];
  image: string;
  accentColor: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Tournament' | 'Championship' | 'Academy Trial' | 'Community' | 'Masterclass';
  date: string;
  time: string;
  venue: string;
  registrationDeadline: string;
  entryFee: string;
  status: 'Open' | 'Filling Fast' | 'Closed';
  description: string;
  prizePool?: string;
  image: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: 'Athletic Science' | 'Academy News' | 'Tournament Insights' | 'Nutrition & Wellness';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  image: string;
  keyTakeaways: string[];
}

export const CLUB_INFO = {
  name: 'Tiara Sports Club',
  tagline: 'Premier Athletic Club & Academies in Vadodara',
  city: 'Vadodara',
  state: 'Gujarat',
  country: 'India',
  address: 'Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara',
  phone: '+91 265 2984000',
  mobile: '+91 98250 14820',
  email: 'contact@tiarasportclub.com',
  inquiryEmail: 'inquiry@tiarasportclub.com',
  timings: '05:30 AM – 10:30 PM (Daily)',
  coordinates: '22.3482° N, 73.1970° E',
  foundedYear: '2014',
  stats: [
    { value: '4', label: 'Sports Disciplines' },
    { value: '25+', label: 'Certified Coaches' },
    { value: '32 Acres', label: 'Sports Campus' },
    { value: '1,800+', label: 'Active Members' }
  ]
};

export const SPORTS_DATA: SportItem[] = [
  {
    id: 'tennis',
    name: 'Tennis',
    category: 'Racquet',
    tagline: '8 ITF-Certified Courts: 6 Decoturf Cushioned Hard & 2 European Red Clay',
    description: 'Engineered for tournament competitors and club members, with tournament chair umpire stands, PlaySight smart tracking, and precision stringing facilities.',
    features: [
      '6 ITF-approved 9-layer cushioned acrylic hard courts',
      '2 authentic crushed-brick European red clay courts',
      'PlaySight smart court tracking for stroke velocity and ball depth',
      'Junior development squads and adult cardio sessions',
      'Electronic Babolat racket stringing workshop'
    ],
    specs: {
      surface: 'Decoturf 9-Layer Acrylic & Traditional Red Clay',
      lighting: 'ITF Level 1 LED Non-Glare Stadium Lights (750 Lux)',
      capacity: '800 Covered Seats at Center Court',
      courtsOrUnits: '8 Championship Courts (6 Hard + 2 Clay)',
      standards: 'ITF Grade 2 Tournament Accredited'
    },
    schedule: '05:30 AM – 11:00 AM & 03:30 PM – 10:30 PM',
    coaches: ['Naveen Kulkarni (ITF Level 3 High Performance Coach)', 'Elena Rostova (Former WTA Ranked Specialist)'],
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0A192F'
  },
  {
    id: 'badminton',
    name: 'Badminton',
    category: 'Racquet',
    tagline: '8 BWF-Approved Teak Sprung Courts with Yonex Mats & Anti-Drift Airflow',
    description: 'Climate-controlled arena engineered specifically for badminton rallies. Dual-sprung Canadian maple wood with competition Yonex mats prevents knee impact.',
    features: [
      '8 independent tournament badminton courts with 11m ceiling clearance',
      'Sprung hardwood subfloor with certified Yonex non-slip mats',
      'Precision laminar airflow HVAC preventing shuttlecock drift',
      'Shadowless vertical LED array designed to avoid player glare',
      'Locker suites with sauna and sports therapy rooms'
    ],
    specs: {
      surface: 'BWF Grade 1 Yonex Mats over Canadian Maple Sprung Wood',
      lighting: '1,000 Lux Indirect Non-Glare BWF Broadcast Lighting',
      capacity: '500 Spectators',
      courtsOrUnits: '8 Championship Courts',
      standards: 'BWF Tier 2 Specification'
    },
    schedule: '06:00 AM – 10:30 PM (Continuous)',
    coaches: ['Devendra Joshi (Former Thomas Cup Camp Coach)', 'Mona Trivedi (All-India Universities Champion)'],
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0A192F'
  },
  {
    id: 'pickleball',
    name: 'Pickleball',
    category: 'Racquet',
    tagline: '4 Regulation USAPA Cushioned Tournament Courts with Night Floodlighting',
    description: 'Dedicated tournament pickleball arena engineered with USAPA-certified cushioned multi-layer acrylic surfaces, championship nets, LED glare-free lighting, and pro-grade equipment.',
    features: [
      '4 tournament-grade dedicated pickleball courts with cushioned acrylic',
      'Heavy-duty regulation permanent posts and anti-sag tournament nets',
      'Shadowless LED illumination (750 Lux) designed for rapid reflex rallies',
      'Weekly social mixers, rating shootouts, and coaching clinics',
      'Pro shop stocked with Selkirk & Paddletek demo paddles and balls'
    ],
    specs: {
      surface: 'USAPA Cushioned Multi-Layer Acrylic Surface',
      lighting: '750 Lux Indirect Glare-Free LED Floodlights',
      capacity: '350 Covered Spectators',
      courtsOrUnits: '4 Dedicated Championship Courts',
      standards: 'USA Pickleball (USAPA) & IFP Accredited'
    },
    schedule: '06:00 AM – 11:00 AM & 04:00 PM – 10:30 PM',
    coaches: ['Rakesh Sharma (PPR Certified Pickleball Professional)', 'Meera Parekh (National Tournament Finalist)'],
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0A192F'
  },
  {
    id: 'gym',
    name: 'GYM',
    category: 'Fitness',
    tagline: '14,000 Sq Ft Elite Strength, Conditioning & Olympic Weightlifting Arena',
    description: 'Premier athletic strength and conditioning facility equipped with Eleiko Olympic lifting platforms, Keiser pneumatic velocity machines, cardio mezzanine, and licensed sports scientists.',
    features: [
      '12 Eleiko IWF weightlifting platforms with certified competition bumpers',
      'Keiser pneumatic resistance equipment for velocity-based athletic training',
      'Indoor sprint turf track with laser timing gates and weighted sleds',
      'Woodway curved treadmills, Concept2 rowers, SkiErgs and assault bikes',
      'InBody 770 clinical body composition scanner and movement screening'
    ],
    specs: {
      surface: 'Regupol 12mm High-Density Shock Absorption Rubber',
      lighting: 'Full-Spectrum Circadian Athletic Lighting',
      capacity: '150 Athletes Simultaneously',
      courtsOrUnits: 'Olympic Strength Zone, Cardio Deck, Agility Turf Runway',
      standards: 'NSCA & Olympic High-Performance Benchmarks'
    },
    schedule: '05:30 AM – 10:30 PM (Continuous)',
    coaches: ['Dr. Samarjit Deshmukh (CSCS, Head of Performance)', 'Kavita Joshi (Olympic Weightlifting Specialist)'],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0A192F'
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Vadodara Open Tennis Masters 2026',
    category: 'Championship',
    date: 'April 24 – 28, 2026',
    time: 'Matches begin 07:00 AM & 05:00 PM',
    venue: 'Tiara Center Court & Hard Court Complex',
    registrationDeadline: 'April 15, 2026',
    entryFee: '₹1,500 (Singles) / ₹2,200 (Doubles)',
    status: 'Open',
    description: 'AITA ranking tournament featuring Men’s, Women’s, and Junior U-16 categories across Western India. Night finals under floodlights.',
    prizePool: '₹3,50,000 + Silver Trophies',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-2',
    title: 'Gujarat State Pickleball Open Shootout',
    category: 'Tournament',
    date: 'May 08 – 10, 2026',
    time: '06:00 PM – 10:30 PM Daily',
    venue: 'Pickleball Courts',
    registrationDeadline: 'April 28, 2026',
    entryFee: '₹1,200 per Doubles Team',
    status: 'Filling Fast',
    description: 'Sanctioned tournament featuring Men’s, Women’s, and Mixed doubles across 3.5, 4.0, and Open skill ratings.',
    prizePool: '₹2,00,000 + Championship Medals',
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-3',
    title: 'High-Performance Power & Conditioning Combine',
    category: 'Masterclass',
    date: 'May 22 – 24, 2026',
    time: '06:30 AM – 11:00 AM',
    venue: 'GYM',
    registrationDeadline: 'May 15, 2026',
    entryFee: '₹800 per Athlete',
    status: 'Open',
    description: 'Biometric combine assessing sprint velocity, vertical jump power, InBody composition, and Olympic lifting fundamentals.',
    prizePool: 'Performance Certificates & Elite Squad Selection',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-4',
    title: 'Youth Badminton Talent Identification Camp',
    category: 'Academy Trial',
    date: 'June 05 – 07, 2026',
    time: '08:00 AM – 12:30 PM',
    venue: 'Badminton Courts',
    registrationDeadline: 'May 30, 2026',
    entryFee: 'Complimentary (By Registration)',
    status: 'Open',
    description: 'Annual scholarship trials for junior players aged 8 to 15. Selected talents receive 100% sponsored year-round coaching and gear.',
    prizePool: 'Full Athletic Scholarships',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'science-of-rotational-power-tennis-badminton-racquets',
    title: 'Kinetic Chain: Engineering Rotational Power for Racquet Sports & Gym Performance',
    category: 'Athletic Science',
    author: {
      name: 'Dr. Samarjit Deshmukh',
      role: 'Head of Athletic Performance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    date: 'March 28, 2026',
    readTime: '4 min read',
    excerpt: 'How biometric movement sensors at Tiara reveal the difference between arm-driven swings and true ground-force rotational velocity in tennis, badminton, and pickleball.',
    content: [
      'In Grand Slam tennis, high-speed badminton rallies, and fast pickleball exchanges, power originates from ground-force transfer—the sequencing of kinetic energy from feet through hip rotation into the racket or paddle.',
      'At Tiara’s High-Performance Gym in Vadodara, dual-plane motion capture cameras and force plates diagnose energy leaks to build effortless swing speed while protecting joints and rotator cuffs.'
    ],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Ground-reaction forces drive over 52% of total swing acceleration.',
      'Core rotational power developed in the gym directly improves court velocity.',
      'Velocity-based strength training preserves explosive tendon health.'
    ]
  },
  {
    slug: 'vadodara-sporting-heritage-to-modern-excellence',
    title: 'From Maharaja Pratapsingh to Championship Courts: Vadodara’s Athletic Legacy',
    category: 'Academy News',
    author: {
      name: 'Aditi Varma',
      role: 'Club Historian',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    date: 'March 14, 2026',
    readTime: '5 min read',
    excerpt: 'An exploration of how Baroda fostered legendary champions and racquet masters—and how Tiara carries that legacy forward.',
    content: [
      'The soil of Baroda has always bred athletic resilience and sporting aristocracy. Tiara Sports Club on Sama-Savli Road honors that heritage through world-class tennis, badminton, pickleball, and sports science facilities.',
      'With certified coaches and international court surfaces, our academy has produced over 18 state medalists across tennis and badminton this season alone.'
    ],
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Vadodara has been a premier athletic breeding ground for over a century.',
      'Player mentoring combines technical rigor with mental stamina.',
      'World-class infrastructure in Gujarat nurtures national podium champions.'
    ]
  },
  {
    slug: 'cold-water-immersion-and-recovery-in-hot-climates',
    title: 'Cold Water Immersion & Heat Acclimatization in Gujarat Summers',
    category: 'Nutrition & Wellness',
    author: {
      name: 'Dr. Apeksha Trivedi',
      role: 'Chief Sports Physiotherapist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    date: 'February 26, 2026',
    readTime: '4 min read',
    excerpt: 'Managing core body temperature, electrolyte replenishment, and cold plunge timing for athletes training in 40°C+ ambient temperatures.',
    content: [
      'Training during high-heat months in western India requires precise contrast therapy protocols.',
      'Post-training 10-minute sessions in Tiara’s 8°C chilled hydrotherapy plunges arrest inflammation and support rapid autonomic recovery.'
    ],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Ice bath immersion immediately resets core temperature and reduces cardiac load.',
      'Electrolyte intake must reflect individual sweat-rate diagnostics.',
      'Pre-cooling protocols enhance tactical decision speed.'
    ]
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Tennis',
    category: 'Tennis',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Decoturf 9-layer cushioned tournament courts during the Vadodara Open Masters.'
  },
  {
    id: 'gal-2',
    title: 'Badminton',
    category: 'Badminton',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    caption: 'BWF-standard Canadian maple sprung wooden courts with Yonex competition mats in Vadodara.'
  },
  {
    id: 'gal-3',
    title: 'Pickleball',
    category: 'Pickleball',
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=1200&q=80',
    caption: 'USAPA regulation cushioned acrylic pickleball tournament courts under 750 Lux floodlighting.'
  },
  {
    id: 'gal-4',
    title: 'GYM',
    category: 'GYM',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    caption: 'Olympic weightlifting platforms, sprint turf track and velocity-based athletic training floor.'
  }
];
