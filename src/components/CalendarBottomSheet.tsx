import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Check, ExternalLink, Download } from 'lucide-react';
import { downloadAppleIcsFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from '../utils/calendar';
import { trackEvent } from '../utils/tracker';

interface CalendarBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCalendarSelected?: () => void;
}

export const CalendarBottomSheet: React.FC<CalendarBottomSheetProps> = ({
  isOpen,
  onClose,
  onCalendarSelected,
}) => {
  const [downloadedIcs, setDownloadedIcs] = React.useState(false);

  const handleAppleClick = () => {
    trackEvent('apple_calendar_click');
    downloadAppleIcsFile();
    setDownloadedIcs(true);
    setTimeout(() => {
      onCalendarSelected?.();
      onClose();
      setDownloadedIcs(false);
    }, 1200);
  };

  const handleGoogleClick = () => {
    trackEvent('google_calendar_click');
    const url = getGoogleCalendarUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    onCalendarSelected?.();
    onClose();
  };

  const handleOutlookClick = () => {
    const url = getOutlookCalendarUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    onCalendarSelected?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#16161c] text-white rounded-t-3xl sm:rounded-3xl border border-white/10 p-6 pb-9 shadow-2xl z-10 overflow-hidden"
          >
            {/* Grab Handle for mobile */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Add to Calendar</h3>
                  <p className="text-xs text-white/50">Sep 21, 2026 &bull; 10 AM – 12 PM PT</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition flex items-center justify-center text-white/70"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Event Summary Preview Pill */}
            <div className="bg-white/5 rounded-2xl p-3.5 mb-5 border border-white/5">
              <p className="text-xs font-semibold text-white/90">NMDP Tabling Session at UC Berkeley</p>
              <p className="text-[11px] text-white/50 mt-0.5">Outside Amazon Hub Locker (2495 Bancroft Way)</p>
            </div>

            {/* Calendar Provider Options */}
            <div className="flex flex-col gap-2.5">
              {/* Apple Calendar */}
              <button
                onClick={handleAppleClick}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] transition font-medium text-sm text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🍏</span>
                  <div>
                    <span className="font-semibold text-white">Apple Calendar</span>
                    <p className="text-[11px] text-white/50">Downloads direct .ics calendar file</p>
                  </div>
                </div>
                {downloadedIcs ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Download className="w-4 h-4 text-white/40 group-hover:text-white transition" />
                )}
              </button>

              {/* Google Calendar */}
              <button
                onClick={handleGoogleClick}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] transition font-medium text-sm text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🗓️</span>
                  <div>
                    <span className="font-semibold text-white">Google Calendar</span>
                    <p className="text-[11px] text-white/50">Opens pre-filled web event</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition" />
              </button>

              {/* Outlook */}
              <button
                onClick={handleOutlookClick}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] transition font-medium text-sm text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📬</span>
                  <div>
                    <span className="font-semibold text-white">Outlook Calendar</span>
                    <p className="text-[11px] text-white/50">Opens Outlook web calendar</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition" />
              </button>
            </div>

            {/* Cancel */}
            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 text-xs text-white/40 hover:text-white/70 transition font-medium"
            >
              Nevermind
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
