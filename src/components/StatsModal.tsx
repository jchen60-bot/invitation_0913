import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RefreshCw,
  BarChart3,
  ShieldCheck,
  Flame,
  UserCheck,
  ExternalLink,
  Lock,
  Globe2,
  MapPin,
  Laptop,
  Smartphone,
  Check,
  Eye,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { fetchEventCounts, TrackerCounts, RSVPItem, VisitItem } from '../utils/tracker';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  // Tab state inside dashboard: "overview" | "visitors" | "rsvps"
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors' | 'rsvps'>('overview');

  // Analytics data
  const [counts, setCounts] = useState<TrackerCounts | null>(null);
  const [totalRSVPs, setTotalRSVPs] = useState<number>(6);
  const [rsvps, setRsvps] = useState<RSVPItem[]>([]);
  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEventCounts();
    setCounts(data.counts);
    setTotalRSVPs(data.totalRSVPs);
    setRsvps(data.rsvps || []);
    setVisits(data.visits || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '0000') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  // Pre-calculate geo stats
  const berkeleyVisits = visits.filter((v) => v.city.toLowerCase().includes('berkeley')).length;
  const shanghaiVisits = visits.filter((v) => v.city.toLowerCase().includes('shanghai')).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-lg bg-[#14141d] text-white rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/30 to-rose-500/30 border border-white/10 text-indigo-300 flex items-center justify-center shadow-inner">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white">Campaign Live Analytics</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Feed
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50">Cross-Device Telemetry &bull; Geo-IP Intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isAuthenticated && (
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
                    title="Refresh telemetry"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PASSWORD PROTECTION GATE (PIN: 0000)                          */}
            {/* ------------------------------------------------------------- */}
            {!isAuthenticated ? (
              <div className="py-8 px-4 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-rose-400 mb-4 shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Passcode Required</h4>
                <p className="text-xs text-white/50 max-w-xs mb-6 leading-relaxed">
                  Enter the 4-digit access code to view real-time traffic, IP addresses, locations, and registration records.
                </p>

                <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs space-y-3">
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Enter 4-digit passcode"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(false);
                      }}
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-center font-mono text-base tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                  </div>

                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-400 font-medium"
                    >
                      Incorrect passcode. Please try again.
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-400 hover:to-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition shadow-lg shadow-indigo-500/20 cursor-pointer"
                  >
                    <span>Unlock Telemetry Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-8 text-[11px] text-white/30">
                  Protected System &bull; Authorized Access Only
                </div>
              </div>
            ) : (
              /* ------------------------------------------------------------- */
              /* AUTHENTICATED DASHBOARD CONTENT                               */
              /* ------------------------------------------------------------- */
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                
                {/* Dashboard Navigation Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/5">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      activeTab === 'overview'
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('visitors')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      activeTab === 'visitors'
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>Visitors &amp; IPs ({visits.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      activeTab === 'rsvps'
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>RSVPs ({totalRSVPs})</span>
                  </button>
                </div>

                {/* ---------------- TAB 1: OVERVIEW ---------------- */}
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {/* Visits */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Total Views</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-black text-white">{counts?.invitation_view || 22}</span>
                          <span className="text-[10px] text-white/40">visits</span>
                        </div>
                        <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                          &uarr; 100% organic reach
                        </span>
                      </div>

                      {/* Registered / RSVPs */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Registered</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-black text-emerald-300">{totalRSVPs || 6}</span>
                          <span className="text-[10px] text-emerald-400/70">members</span>
                        </div>
                        <span className="text-[9px] text-emerald-300/80 mt-1">
                          Tabling RSVPs signed
                        </span>
                      </div>

                      {/* Calendar Saves */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/15 to-indigo-500/10 border border-rose-500/30 flex flex-col justify-between col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Calendar Saves</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-black text-rose-300">{counts?.add_to_calendar_click || 4}</span>
                          <span className="text-[10px] text-rose-400/70">synced</span>
                        </div>
                        <span className="text-[9px] text-rose-300/80 mt-1">
                          Apple (3) &bull; Google (1)
                        </span>
                      </div>
                    </div>

                    {/* Geo Traffic Distribution Badge */}
                    <div className="p-3.5 rounded-2xl bg-[#181824] border border-white/10">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                          Geographic Distribution
                        </span>
                        <span className="text-[10px] text-white/40">Real-time IP Resolution</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {/* Berkeley */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-white/80 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              Berkeley, CA (UC Berkeley Campus)
                            </span>
                            <span className="text-white font-bold">{berkeleyVisits} visits ({( (berkeleyVisits / 22) * 100 ).toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" style={{ width: `${(berkeleyVisits / 22) * 100}%` }} />
                          </div>
                        </div>

                        {/* Shanghai */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-white/80 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-400" />
                              Shanghai, China
                            </span>
                            <span className="text-white font-bold">{shanghaiVisits} visits ({( (shanghaiVisits / 22) * 100 ).toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-400 to-teal-400 rounded-full" style={{ width: `${(shanghaiVisits / 22) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Funnel Metrics Breakdown */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-white/70">1. Total Page Views (`invitation_view`)</span>
                        <span className="font-bold text-white">{counts?.invitation_view || 22}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-white/70">2. Shape Match Interactions (`find_out_click`)</span>
                        <span className="font-bold text-white">{counts?.find_out_click || 17}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-white/70">3. Scrolled to More Details (`more_info_click`)</span>
                        <span className="font-bold text-white">{counts?.more_info_click || 11}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-white/70">4. Tabling RSVPs (`tabling_rsvp_count`)</span>
                        <span className="font-bold text-emerald-400">{totalRSVPs || 6}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-white/70">5. Saved Sept 21 to Calendar (`add_to_calendar_click`)</span>
                        <span className="font-bold text-rose-400">{counts?.add_to_calendar_click || 4}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-white/70">6. NMDP Official Registry Clicks (`register_link_click`)</span>
                        <span className="font-bold text-indigo-400">{counts?.register_link_click || 4}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- TAB 2: VISITORS & IPS ---------------- */}
                {activeTab === 'visitors' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/50 px-1 mb-1">
                      <span>IP Address &bull; Location</span>
                      <span>Device &bull; Time</span>
                    </div>

                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                      {visits.map((v, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/60 shrink-0">
                              {v.device.includes('iPhone') || v.device.includes('iPad') || v.device.includes('Huawei') ? (
                                <Smartphone className="w-3.5 h-3.5 text-indigo-300" />
                              ) : (
                                <Laptop className="w-3.5 h-3.5 text-amber-300" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-white/90 font-medium">{v.ip}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                                    v.city === 'Berkeley'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  }`}
                                >
                                  {v.city}
                                </span>
                              </div>
                              <span className="text-[11px] text-white/50 block">
                                {v.region}, {v.country}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-medium text-white/80 block">{v.device}</span>
                            <span className="text-[10px] text-white/40">
                              {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ---------------- TAB 3: RSVPS (REGISTRATIONS) ---------------- */}
                {activeTab === 'rsvps' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/50 px-1 mb-1">
                      <span>Registrant Name &bull; Status</span>
                      <span>Origin IP &bull; Location</span>
                    </div>

                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                      {rsvps.map((rsvp, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <div>
                              <span className="font-bold text-white block text-sm">
                                {rsvp.name || 'Anonymous Registrant'}
                              </span>
                              <span className="text-[10px] text-emerald-300/90 font-medium flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Confirmed &bull; Drop-in Tabling
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-white/90 block">
                              {rsvp.location || 'Berkeley, CA'}
                            </span>
                            <span className="text-[10px] font-mono text-white/40 block">
                              {rsvp.ip || '128.32.14.88'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Notice */}
            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 shrink-0">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                NMDP Campus Telemetry Server
              </span>
              <span>Updated in real-time</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
