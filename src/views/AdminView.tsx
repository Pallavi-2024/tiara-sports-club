import React, { useState, useEffect } from 'react';
import {
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
  testSmtpRelay,
  getSmtpConfig
} from '../lib/api.ts';
import {
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  Sliders,
  Award,
  ArrowLeft,
  EyeOff
} from 'lucide-react';
import { SPORTS_DATA } from '../data/clubData.ts';

interface AdminViewProps {
  navigate?: (route: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ navigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  // Zoho SMTP relay test state
  const [testEmail, setTestEmail] = useState<string>('pallavi@uniqtechsolutions.com');
  const [testingSmtp, setTestingSmtp] = useState<boolean>(false);
  const [smtpResult, setSmtpResult] = useState<any | null>(null);
  const [smtpConfig, setSmtpConfig] = useState<any | null>(null);

  // Facility operational status overrides
  const [facilityStatuses, setFacilityStatuses] = useState<{ [key: string]: 'Active' | 'Maintenance' | 'Tournament Reserved' }>({
    tennis: 'Active',
    badminton: 'Active',
    pickleball: 'Active',
    gym: 'Active'
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchInquiries();
    setInquiries(data);
    const cfg = await getSmtpConfig();
    setSmtpConfig(cfg);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026' || pinInput.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid executive PIN. (Default demonstration PIN is 2026)');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateInquiryStatus(id, newStatus);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const handleNoteSave = async (id: string, notes: string) => {
    await updateInquiryStatus(id, selectedInquiry?.status || 'In Review', notes);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, adminNotes: notes } : inq))
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev: any) => ({ ...prev, adminNotes: notes }));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry record?')) {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleRunSmtpTest = async () => {
    setTestingSmtp(true);
    setSmtpResult(null);
    const res = await testSmtpRelay(testEmail);
    setSmtpResult(res);
    setTestingSmtp(false);
  };

  const handleExportCSV = () => {
    const headers = ['Reference', 'Date', 'Name', 'Email', 'Phone', 'Type', 'Sport', 'Time', 'Status', 'Message'];
    const rows = inquiries.map((i) => [
      i.referenceId,
      new Date(i.createdAt).toLocaleString(),
      `"${i.name}"`,
      i.email,
      i.phone,
      `"${i.inquiryType}"`,
      `"${i.sport}"`,
      `"${i.preferredTime}"`,
      i.status,
      `"${(i.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tiara_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered inquiries
  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.sport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metric counts
  const countTotal = inquiries.length;
  const countNew = inquiries.filter((i) => i.status === 'New').length;
  const countReview = inquiries.filter((i) => i.status === 'In Review').length;
  const countContacted = inquiries.filter((i) => i.status === 'Contacted').length;
  const countEnrolled = inquiries.filter((i) => i.status === 'Enrolled').length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 bg-[#F8FAFC]">
        <div className="sports-module-card rounded-sm p-8 space-y-5 text-center bg-white">
          <div className="w-12 h-12 bg-slate-100 text-[#0A192F] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 text-[#C5A059]" />
          </div>

          <div>
            <h2 className="font-royal text-2xl font-bold text-[#0F172A]">
              Tiara Executive Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized access for club management, administration, and head coaches.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm">
                {pinError}
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-left">
                Executive Access PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Demo: 2026)"
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F] text-center tracking-widest text-lg font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0A192F] hover:bg-[#162B4D] text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-colors"
            >
              Unlock Executive Portal
            </button>

            <button
              type="button"
              onClick={() => {
                setPinInput('2026');
                setIsAuthenticated(true);
              }}
              className="text-[11px] text-[#0A192F] hover:underline font-medium block mx-auto"
            >
              Quick Demonstration Unlock (PIN 2026)
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 py-1.5 px-2 rounded-sm">
                <EyeOff className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Hidden from public · Toggle with Ctrl + Shift + B</span>
              </div>
              {navigate && (
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-xs text-slate-600 hover:text-black font-semibold flex items-center justify-center gap-1.5 py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Website</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-[#F8FAFC]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#0A192F] font-semibold flex-wrap">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Executive Administration & Grounds Portal · Vadodara</span>
            <span className="text-slate-400">|</span>
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-sm text-[10px]">
              <EyeOff className="w-3 h-3 text-[#C5A059]" />
              <span>Hidden Mode: Ctrl + Shift + B</span>
            </span>
          </div>
          <h1 className="font-royal text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
            Club Inquiries & Facility Operations Desk
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {navigate && (
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 bg-[#0A192F] hover:bg-[#162B4D] text-white text-xs font-semibold rounded-sm flex items-center gap-1.5 shadow-sm"
              title="Return to Public Website (or press Ctrl+Shift+B)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Exit Admin</span>
            </button>
          )}
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-xs text-slate-700 rounded-sm flex items-center gap-1.5"
            title="Refresh inquiry records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-xs text-slate-700 rounded-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#0A192F]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-xs text-slate-600 rounded-sm hover:bg-slate-200"
          >
            Lock
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="sports-module-card p-4 rounded-sm bg-white">
          <div className="text-[11px] uppercase font-mono text-slate-500">Total Inquiries</div>
          <div className="font-royal text-2xl font-bold text-[#0F172A] mt-1">{countTotal}</div>
        </div>

        <div className="sports-module-card p-4 rounded-sm bg-white border-l-4 border-l-[#0A192F]">
          <div className="text-[11px] uppercase font-mono text-[#0A192F] font-semibold">New Submissions</div>
          <div className="font-royal text-2xl font-bold text-[#0A192F] mt-1">{countNew}</div>
        </div>

        <div className="sports-module-card p-4 rounded-sm bg-white border-l-4 border-l-[#C5A059]">
          <div className="text-[11px] uppercase font-mono text-[#A37F38] font-semibold">In Review</div>
          <div className="font-royal text-2xl font-bold text-[#A37F38] mt-1">{countReview}</div>
        </div>

        <div className="sports-module-card p-4 rounded-sm bg-white border-l-4 border-l-slate-400">
          <div className="text-[11px] uppercase font-mono text-slate-600">Contacted</div>
          <div className="font-royal text-2xl font-bold text-slate-700 mt-1">{countContacted}</div>
        </div>

        <div className="sports-module-card p-4 rounded-sm bg-white border-l-4 border-l-emerald-600 col-span-2 sm:col-span-1">
          <div className="text-[11px] uppercase font-mono text-emerald-700 font-semibold">Enrolled Members</div>
          <div className="font-royal text-2xl font-bold text-emerald-800 mt-1">{countEnrolled}</div>
        </div>
      </div>

      {/* Inquiries Section */}
      <div className="space-y-4">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, sport, or reference code..."
              className="w-full bg-white border border-slate-300 rounded-sm pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'New', 'In Review', 'Contacted', 'Enrolled', 'Archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-[#0A192F] text-white font-bold shadow-sm'
                    : 'bg-white text-slate-600 hover:text-black border border-slate-200'
                }`}
              >
                {status === 'all' ? 'All Status' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="sports-module-card rounded-sm overflow-x-auto bg-white">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] uppercase font-mono text-slate-500">
              <tr>
                <th className="p-3.5">Reference ID</th>
                <th className="p-3.5">Applicant Details</th>
                <th className="p-3.5">Category & Sport</th>
                <th className="p-3.5">Preferred Slot</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No matching inquiry records found.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono text-[#0A192F] font-semibold whitespace-nowrap">
                      {inq.referenceId}
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{inq.name}</div>
                      <div className="text-[11px] text-slate-500">{inq.email}</div>
                      <div className="text-[11px] text-slate-500">{inq.phone}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-900 font-medium">{inq.inquiryType}</div>
                      <div className="text-[11px] text-[#0A192F]">{inq.sport}</div>
                    </td>

                    <td className="p-3.5 text-slate-600 whitespace-nowrap">
                      {inq.preferredTime}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-[11px] font-semibold rounded-sm px-2 py-1 text-slate-800 focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm"
                          title="View Full Inquiry Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0A192F]" />
                        </button>
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-sm"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Inquiry Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-sm shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono text-[#0A192F] font-bold">
                  {selectedInquiry.referenceId}
                </span>
                <h3 className="text-slate-900 text-xl font-bold font-royal mt-0.5">
                  Inquiry: {selectedInquiry.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Received on {new Date(selectedInquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Email:</span>
                <a href={`mailto:${selectedInquiry.email}`} className="text-[#0A192F] font-medium">
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <a href={`tel:${selectedInquiry.phone}`} className="text-slate-900 font-medium">
                  {selectedInquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block">Inquiry Type:</span>
                <span className="text-slate-900 font-medium">{selectedInquiry.inquiryType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Sport / Facility:</span>
                <span className="text-[#0A192F] font-medium">{selectedInquiry.sport}</span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-sm border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold block mb-1">Applicant Message:</span>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message || 'No additional message provided.'}
              </p>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-700 font-semibold block">
                Internal Administrative Notes:
              </label>
              <textarea
                rows={3}
                defaultValue={selectedInquiry.adminNotes || ''}
                onBlur={(e) => handleNoteSave(selectedInquiry.id, e.target.value)}
                placeholder="Add notes: e.g. 'Contacted applicant, scheduled tour on Friday...'"
                className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F]"
              />
              <span className="text-[10px] text-slate-500">
                Notes auto-save when clicking outside.
              </span>
            </div>

            {selectedInquiry.smtpDetails && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-sm text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] uppercase tracking-wide font-mono text-emerald-900">Zoho SMTP Relay Status:</strong>
                  <span className="text-emerald-700">{selectedInquiry.smtpDetails}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Current Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="bg-white border border-slate-300 text-xs text-slate-900 rounded-sm px-2 py-1"
                >
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-[#0A192F] hover:bg-[#162B4D] text-xs text-white rounded-sm font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facilities Live Status Override Panel */}
      <div className="sports-module-card rounded-sm p-6 space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-royal text-lg font-bold text-[#0F172A]">
              Campus Playing Surfaces & Arena Status
            </h3>
            <p className="text-xs text-slate-500">
              Real-time court availability status displayed to members and visiting players.
            </p>
          </div>
          <span className="text-xs text-[#0A192F] font-mono font-bold">Vadodara Campus</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'tennis', name: 'Tennis' },
            { id: 'badminton', name: 'Badminton' },
            { id: 'pickleball', name: 'Pickleball' },
            { id: 'gym', name: 'GYM' }
          ].map((item) => (
            <div key={item.id} className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900">{item.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Current: {facilityStatuses[item.id]}
                </div>
              </div>

              <select
                value={facilityStatuses[item.id]}
                onChange={(e: any) =>
                  setFacilityStatuses((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
                className="bg-white border border-slate-300 text-[11px] text-[#0A192F] font-medium rounded-sm px-2 py-1 focus:outline-none"
              >
                <option value="Active">Active (Open)</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Tournament Reserved">Reserved</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Zoho Mail SMTP Relay & Workflow Engine */}
      <div className="sports-module-card rounded-sm p-6 space-y-5 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#0A192F] flex items-center justify-center text-[#C5A059]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-royal text-lg font-bold text-[#0F172A]">
                  Zoho SMTP Relay & Transmission Workflow
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated multi-port relay (Port 465 SSL primary with Port 587 TLS failover) for club inquiries.
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-500">
            Zoho Mail Host: <strong className="text-slate-800">smtp.zoho.com</strong>
          </div>
        </div>

        {/* Configuration Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-sm">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Sender (Zoho Auth)</div>
            <div className="font-semibold text-[#0A192F] mt-1 break-all">
              web@uniqtechsolutions.com
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">Authenticated Account</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-sm">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Admin Recipient</div>
            <div className="font-semibold text-slate-900 mt-1 break-all">
              pallavi@uniqtechsolutions.com
            </div>
            <div className="text-[10px] text-[#C5A059] mt-0.5 font-medium">All Inquiries Routed Here</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-sm">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Primary Port (SSL)</div>
            <div className="font-semibold text-slate-900 mt-1">
              Port 465 · SSL
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Direct Secure Socket</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-sm">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Failover Port (TLS)</div>
            <div className="font-semibold text-slate-900 mt-1">
              Port 587 · STARTTLS
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Automatic Fallback</div>
          </div>
        </div>

        {/* Workflow Summary */}
        <div className="bg-[#0A192F]/5 border border-[#0A192F]/10 rounded-sm p-3.5 text-xs text-slate-700 space-y-1">
          <div className="font-bold text-[#0A192F] text-[11px] uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            Configured Workflow Pipeline:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11.5px] leading-relaxed">
            <li>User fills inquiry form on website (or contact page).</li>
            <li>Inquiry is archived safely with unique Reference ID in club database.</li>
            <li>Server connects to <strong>smtp.zoho.com:465 (SSL)</strong> using credentials (<span className="font-mono text-slate-800">web@uniqtechsolutions.com</span>). If network restricts 465, system auto-retries via <strong>Port 587 (TLS)</strong>.</li>
            <li>Formatted inquiry notification with applicant contact & requirements is delivered directly to <strong>pallavi@uniqtechsolutions.com</strong>.</li>
          </ol>
        </div>

        {/* Test Trigger Section */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-800 mb-2">
            Send Live Diagnostic Test Email:
          </div>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl text-xs">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Admin recipient email (default: pallavi@uniqtechsolutions.com)"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-sm px-3.5 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A192F]"
            />
            <button
              onClick={handleRunSmtpTest}
              disabled={testingSmtp}
              className="px-5 py-2 bg-[#0A192F] hover:bg-[#162B4D] disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs rounded-sm whitespace-nowrap transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {testingSmtp ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                  Testing Zoho Relay...
                </>
              ) : (
                'Send Test to pallavi@uniqtechsolutions.com'
              )}
            </button>
          </div>
        </div>

        {smtpResult && (
          <div className={`p-4 rounded-sm space-y-2 text-xs border ${
            smtpResult.success
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2 font-mono">
              <span className={`w-2.5 h-2.5 rounded-full ${smtpResult.success ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
              <strong className="text-sm">
                {smtpResult.success ? 'Zoho SMTP Dispatch Successful' : 'Zoho SMTP Relay Response'}
              </strong>
            </div>
            <p className="leading-relaxed">
              {smtpResult.message || smtpResult.details || smtpResult.error}
            </p>
            {smtpResult.portUsed && (
              <div className="text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-200/60 flex flex-wrap gap-4">
                <span>Port Used: <strong>{smtpResult.portUsed} ({smtpResult.protocol})</strong></span>
                {smtpResult.messageId && <span>Message ID: <strong>{smtpResult.messageId}</strong></span>}
                <span>Sender: <strong>{smtpResult.sender || 'web@uniqtechsolutions.com'}</strong></span>
                <span>Recipient: <strong>{smtpResult.recipient || testEmail}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
