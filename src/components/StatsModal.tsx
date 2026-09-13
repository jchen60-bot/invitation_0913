import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, BarChart3, Copy, Check, ShieldCheck, Flame, UserCheck, ExternalLink } from 'lucide-react';
import { fetchEventCounts, TrackerCounts } from '../utils/tracker';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [counts, setCounts] = useState<TrackerCounts | null>(null);
  const [totalRSVPs, setTotalRSVPs] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEventCounts();
    setCounts(data.counts);
    setTotalRSVPs(data.totalRSVPs);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const copyReflection = () => {
    if (!counts) return;
    const text = `NMDP UC Berkeley Tabling Campaign Telemetry & Registration Metrics:
• Total Invitation Impressions: ${counts.invitation_view}
• "Find Out" Match Animations Triggered: ${counts.find_out_click}
• Primary Interest Metric (+ Add to Calendar Clicks): ${counts.add_to_calendar_click}
  - Apple Calendar Downloads: ${counts.apple_calendar_click}
  - Google Calendar Syncs: ${counts.google_calendar_click}
• Tabling Event RSVPs / Registrations: ${totalRSVPs || counts.tabling_rsvp_count || 0}
• Online NMDP Registry Portal Link Clicks (my.nmdp.org): ${counts.register_link_click || counts.registry_click}
• "More Info & Details" Explored: ${counts.more_info_click || 0}

Conversion Rate (Intent Actions / Total Views): ${
      counts.invitation_view > 0
        ? Math.round(
            (((counts.add_to_calendar_click || 0) + (totalRSVPs || counts.tabling_rsvp_count || 0) + (counts.register_link_click || 0)) /
              counts.invitation_view) *
              100
          )
        : 0
    }%.
All telemetry is recorded anonymously across devices without collecting PII.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm bg-[#16161c] text-white rounded-3xl border border-white/10 p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 sticky top-0 bg-[#16161c] z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Assignment Tracking Metrics</h3>
                  <p className="text-[10px] text-white/50">Cross-Device &bull; Real Database Telemetry</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-2 text-xs mb-4">
              {/* Event Registrations / RSVPs */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white text-xs flex items-center gap-1">
                      tabling_rsvp_count
                      <span className="text-[9px] bg-emerald-500/40 text-emerald-200 px-1 rounded uppercase font-semibold">
                        Registered
                      </span>
                    </span>
                    <span className="text-[10px] text-white/60 block">Event RSVPs / Intent to Table</span>
                  </div>
                </div>
                <span className="text-xl font-black text-emerald-300">
                  {totalRSVPs || counts?.tabling_rsvp_count || 0}
                </span>
              </div>

              {/* Add to Calendar - Primary Key */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-500/20 to-indigo-500/20 border border-rose-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white text-xs flex items-center gap-1">
                      add_to_calendar_click
                      <span className="text-[9px] bg-rose-500/40 text-rose-200 px-1 rounded uppercase font-semibold">
                        Primary Key
                      </span>
                    </span>
                    <span className="text-[10px] text-white/60 block">Saved Sept 21 to calendar</span>
                  </div>
                </div>
                <span className="text-xl font-black text-rose-300">
                  {counts?.add_to_calendar_click ?? 0}
                </span>
              </div>

              {/* Online Registry Clicks */}
              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  <div>
                    <span className="font-medium text-white/90">register_link_click</span>
                    <span className="text-[10px] text-white/40 block">Clicked my.nmdp.org registry</span>
                  </div>
                </div>
                <span className="text-base font-bold text-white/80">
                  {(counts?.register_link_click || 0) + (counts?.registry_click || 0)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white/90">invitation_view</span>
                  <span className="text-[10px] text-white/40 block">Total visitor impressions</span>
                </div>
                <span className="text-base font-bold text-white/80">
                  {counts?.invitation_view ?? 0}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white/90">find_out_click</span>
                  <span className="text-[10px] text-white/40 block">Matching shapes animation</span>
                </div>
                <span className="text-base font-bold text-white/80">
                  {counts?.find_out_click ?? 0}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white/90">more_info_click</span>
                  <span className="text-[10px] text-white/40 block">Scrolled to event details &amp; FAQs</span>
                </div>
                <span className="text-base font-bold text-white/80">
                  {counts?.more_info_click ?? 0}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white/90">calendar_breakdown</span>
                  <span className="text-[10px] text-white/40 block">Apple: {counts?.apple_calendar_click ?? 0} &bull; Google: {counts?.google_calendar_click ?? 0}</span>
                </div>
                <span className="text-xs font-semibold text-white/60">
                  {(counts?.apple_calendar_click ?? 0) + (counts?.google_calendar_click ?? 0)}
                </span>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Verified real counts saved to project server.</span>
            </div>

            {/* Actions */}
            <button
              onClick={copyReflection}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied for Assignment Reflection!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white/70" />
                  <span>Copy Summary for Class Reflection</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
