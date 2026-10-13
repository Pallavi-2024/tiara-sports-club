import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Send, Mail } from 'lucide-react';
import { submitInquiry, InquiryPayload } from '../lib/api.ts';
import { SPORTS_DATA } from '../data/clubData.ts';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSport?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, initialSport }) => {
  const [formData, setFormData] = useState<InquiryPayload>({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General Sports Inquiry',
    sport: initialSport || 'Tennis',
    preferredTime: 'Morning (06:00 AM - 09:00 AM)',
    message: '',
  });

  useEffect(() => {
    if (initialSport) {
      setFormData(prev => ({ ...prev, sport: initialSport }));
    }
  }, [initialSport]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; referenceId?: string; message?: string; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await submitInquiry(formData);
      if (res.success) {
        setResult({
          success: true,
          referenceId: res.referenceId,
          message: res.message || 'Inquiry successfully registered.'
        });
      } else {
        setResult({
          success: false,
          error: res.error || 'Failed to submit inquiry. Please check your connection.'
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'General Sports Inquiry',
      sport: 'Tennis',
      preferredTime: 'Morning (06:00 AM - 09:00 AM)',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0A192F]" />
            <h3 className="text-[#0F172A] font-bold text-base tracking-wide font-royal">
              TIARA SPORT CLUB INQUIRY DESK
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-sm transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {result?.success ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-[#0A192F] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h4 className="text-xl font-bold text-[#0F172A] font-royal">
                Inquiry Dispatched Successfully
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-slate-900 font-semibold">{formData.name}</span>. Your inquiry reference number is:
              </p>
              <div className="inline-block px-4 py-2 bg-slate-100 border border-slate-300 rounded-sm font-mono text-[#0A192F] font-bold text-base">
                {result.referenceId}
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                An electronic notification has been transmitted via Nodemailer to the club desk in Sama-Savli Road, Vadodara. Our team will contact you shortly.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#0A192F] hover:bg-[#162B4D] text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-sm flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-[#0A192F] shrink-0" />
                <span>
                  Official inquiry will be processed via Nodemailer to the Vadodara administrative desk.
                </span>
              </div>

              {result?.error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{result.error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Gaekwad"
                    className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98250 XXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0A192F]"
                  >
                    <option value="General Sports Inquiry">General Sports Inquiry</option>
                    <option value="Sports Coaching Academy">Sports Coaching & Training</option>
                    <option value="Junior Development Academy">Junior Development Academy</option>
                    <option value="Court / Pitch Reservation">Court / Pitch Reservation</option>
                    <option value="Corporate / League Tie-up">Corporate / League Tie-up</option>
                    <option value="General Campus Visit">General Campus Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sport / Discipline</label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0A192F]"
                  >
                    {SPORTS_DATA.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="All 4 Core Disciplines">All 4 Core Disciplines (Tennis, Badminton, Pickleball, GYM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Preferred Time of Day</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0A192F]"
                >
                  <option value="Morning (06:00 AM - 09:00 AM)">Morning (06:00 AM - 09:00 AM)</option>
                  <option value="Mid-day (11:00 AM - 03:00 PM)">Mid-day (11:00 AM - 03:00 PM)</option>
                  <option value="Evening (05:00 PM - 09:30 PM)">Evening (05:00 PM - 09:30 PM)</option>
                  <option value="Weekends Only">Weekends Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Message / Specific Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your sporting background, age of participant, or preferred date for a facility walkthrough..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-sm text-slate-600 hover:text-black hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#0A192F] hover:bg-[#162B4D] disabled:opacity-50 text-white font-bold tracking-wider uppercase text-xs rounded-sm transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
