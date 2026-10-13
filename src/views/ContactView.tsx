import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ChevronDown, Compass, ExternalLink } from 'lucide-react';
import { CLUB_INFO, SPORTS_DATA } from '../data/clubData.ts';
import { submitInquiry, InquiryPayload } from '../lib/api.ts';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState<InquiryPayload>({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General Sports Inquiry',
    sport: 'Tennis',
    preferredTime: 'Morning (06:00 AM - 09:00 AM)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    success: boolean;
    referenceId?: string;
    message?: string;
    deliveryDetails?: string;
    error?: string;
  } | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmittedResult(null);

    try {
      const res = await submitInquiry(formData);
      if (res.success) {
        setSubmittedResult({
          success: true,
          referenceId: res.referenceId,
          message: res.message,
          deliveryDetails: res.deliveryDetails
        });
      } else {
        setSubmittedResult({
          success: false,
          error: res.error || 'Failed to submit inquiry'
        });
      }
    } catch (err: any) {
      setSubmittedResult({
        success: false,
        error: err.message || 'Transmission failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'What are the operating hours for courts and the GYM?',
      a: 'The athletic grounds and high-performance GYM open daily at 05:30 AM and close at 10:30 PM. All tennis, badminton, and pickleball courts are floodlit for nighttime play.'
    },
    {
      q: 'How do I visit or inquire about the sports facilities?',
      a: 'Inquiries can be submitted directly through this portal. Our sports management desk will schedule a guided campus walkthrough and court demonstration at your convenience.'
    },
    {
      q: 'Can players of all ages enroll in the Sports Academy?',
      a: 'Yes, our coaching academies across tennis, badminton, pickleball, and athletic gym conditioning welcome athletes of all skill levels, subject to coach assessment and court availability.'
    },
    {
      q: 'Are court reservations or guest passes available?',
      a: 'Yes, sports enthusiasts, tournament competitors, and corporate groups may reserve slots through prior inquiry and administrative arrangement.'
    }
  ];

  return (
    <div className="space-y-12 py-8 bg-[#F8FAFC]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0A192F] font-semibold">
            Guest Relations & Information Desk
          </div>
          <h1 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            CONNECT WITH TIARA SPORT CLUB.
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            Direct your inquiry regarding sports facilities, court access, coaching programs, tournament fixtures, or campus walkthroughs in Vadodara.
          </p>
        </div>
      </section>

      {/* Main Grid: Form & Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 sports-module-card rounded-sm p-6 sm:p-8 space-y-5 bg-white">
            <div>
              <h2 className="font-royal text-2xl font-bold text-[#0F172A]">
                Inquiry
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Transmitted directly via Zoho SMTP to the club administration desk.
              </p>
            </div>

            {submittedResult ? (
              <div
                className={`p-6 rounded-sm border ${
                  submittedResult.success
                    ? 'bg-slate-50 border-slate-300'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {submittedResult.success ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#0A192F] font-bold text-sm">
                      <CheckCircle className="w-5 h-5 text-[#C5A059]" />
                      <span>Inquiry Dispatched Successfully</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Reference Code: <strong className="font-mono text-[#0A192F]">{submittedResult.referenceId}</strong>
                    </p>
                    <p className="text-xs text-slate-600">
                      Our coaching and front desk team will reach out within 24 hours. Your details have been routed directly to club administration (pallavi@uniqtechsolutions.com) via Zoho SMTP.
                    </p>
                    <button
                      onClick={() => setSubmittedResult(null)}
                      className="mt-3 px-4 py-2 bg-[#0A192F] text-white text-xs font-semibold rounded-sm"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span>Submission Notice</span>
                    </div>
                    <p className="text-xs text-red-600">{submittedResult.error}</p>
                    <button
                      onClick={() => setSubmittedResult(null)}
                      className="mt-2 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-sm"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Parthiv Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#0A192F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#0A192F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98250 XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#0A192F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Inquiry Purpose</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#0A192F]"
                    >
                      <option value="General Sports Inquiry">General Sports Inquiry</option>
                      <option value="Sports Coaching Academy">Sports Coaching & Academy</option>
                      <option value="Junior Sports Academy">Junior Athletic Development Academy</option>
                      <option value="Court Reservation">Court / Ground Reservation</option>
                      <option value="Tournament Entry">Tournament / Fixture Entry</option>
                      <option value="Campus Walkthrough">Campus Walkthrough & Tour</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Discipline of Interest</label>
                    <select
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#0A192F]"
                    >
                      {SPORTS_DATA.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Preferred Contact Time</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#0A192F]"
                    >
                      <option value="Morning (06:00 AM - 09:00 AM)">Morning (06:00 AM - 09:00 AM)</option>
                      <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Details / Specific Questions</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your sporting background or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#0A192F]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{loading ? 'Transmitting via Nodemailer...' : 'Transmit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Campus Coordinates & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Campus Info Card */}
            <div className="sports-module-card p-6 rounded-sm space-y-4 bg-white">
              <h3 className="font-royal text-lg font-bold text-[#0F172A]">
                Tiara Sports Club Location
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Address:</strong>
                    <span className="text-slate-800 font-medium">Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Telephones:</strong>
                    <a href="tel:+912652984000" className="text-[#0A192F] font-semibold hover:underline block">
                      +91 265 2984000 (Desk)
                    </a>
                    <a href="tel:+919825014820" className="text-slate-600 hover:underline block">
                      +91 98250 14820 (Direct Help Desk)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Email Inquiries:</strong>
                    <a href="mailto:contact@tiarasportclub.com" className="text-[#0A192F] font-semibold hover:underline block">
                      contact@tiarasportclub.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Club Operating Hours:</strong>
                    <span>05:30 AM – 10:30 PM (Monday – Sunday)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="sports-module-card p-6 rounded-sm space-y-3 bg-white">
              <h3 className="font-royal text-base font-bold text-[#0F172A] mb-2">
                Frequently Asked Inquiries
              </h3>

              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-sm">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-3 flex items-center justify-between text-xs font-semibold text-slate-800"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="sports-module-card p-6 sm:p-8 rounded-sm bg-white border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#0A192F] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Google Map & Navigation</span>
              </div>
              <h3 className="font-royal text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
                Tiara Sports Club on Google Maps
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, Sama-Savli Road, Vadodara
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Tiara+Sports+Club+Besides+Red+Coral+greens+opposite+Nayara+petrol+pump+sama-savli+road+Vadodara"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
            </a>
          </div>

          <div className="relative w-full h-80 sm:h-[420px] rounded-sm overflow-hidden border border-slate-300 bg-slate-100 shadow-inner">
            <iframe
              title="Tiara Sports Club Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent('Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">📍 Road:</span>
              <span>Sama-Savli Road, Vadodara</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">⛽ Landmark 1:</span>
              <span>Opposite Nayara Petrol Pump</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">🌿 Landmark 2:</span>
              <span>Besides Red Coral Greens</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
