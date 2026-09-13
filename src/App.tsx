import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MatchingAnimation } from './components/MatchingAnimation';
import { CalendarBottomSheet } from './components/CalendarBottomSheet';
import { StatsModal } from './components/StatsModal';
import { EventDetailsSection } from './components/EventDetailsSection';
import { trackEvent } from './utils/tracker';
import { playMatchChime } from './utils/sound';
import {
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  CheckCircle2,
  BarChart2,
  Ribbon,
  Navigation,
  ExternalLink,
  Share2,
  Check,
  HeartHandshake,
  ChevronDown,
} from 'lucide-react';

export default function App() {
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [showInvitation, setShowInvitation] = useState<boolean>(false);
  const [calendarSheetOpen, setCalendarSheetOpen] = useState<boolean>(false);
  const [statsModalOpen, setStatsModalOpen] = useState<boolean>(false);
  const [hasAddedCalendar, setHasAddedCalendar] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const invitationRef = useRef<HTMLDivElement>(null);

  // Track initial invitation view on mount
  useEffect(() => {
    trackEvent('invitation_view');
  }, []);

  // Check URL query parameters (?stats=true or ?open=true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('stats') === 'true') {
        setStatsModalOpen(true);
      }
      if (params.get('open') === 'true') {
        setIsMatched(true);
        setShowInvitation(true);
      }
    }
  }, []);

  // Copy invitation link to clipboard
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Open official NMDP site
  const handleOpenNmdpSite = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    trackEvent('register_link_click');
    trackEvent('registry_click');
    window.open('https://my.nmdp.org', '_blank', 'noopener,noreferrer');
  };

  // Trigger playful matching animation
  const handleMatch = () => {
    if (isMatched) return;

    trackEvent('find_out_click');
    setIsMatched(true);

    // Subtle celebration chime
    playMatchChime();

    // Subtle celebratory confetti burst
    setTimeout(() => {
      confetti({
        particleCount: 42,
        spread: 65,
        origin: { y: 0.44 },
        colors: ['#F43F5E', '#6366F1', '#F59E0B', '#10B981', '#EC4899'],
        ticks: 200,
        gravity: 1.1,
        scalar: 0.95,
        disableForReducedMotion: true,
      });
    }, 380);

    // Smoothly unveil the invitation
    setTimeout(() => {
      setShowInvitation(true);
      setTimeout(() => {
        invitationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 950);
  };

  const handleOpenCalendar = () => {
    trackEvent('add_to_calendar_click');
    setCalendarSheetOpen(true);
  };

  const handleRegistryClick = () => {
    trackEvent('register_link_click');
    trackEvent('registry_click');
    window.open('https://my.nmdp.org', '_blank', 'noopener,noreferrer');
  };

  const openMapDirections = () => {
    const address = encodeURIComponent('2495 Bancroft Way, Berkeley, CA 94720');
    window.open(`https://maps.google.com/?q=${address}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 antialiased selection:bg-rose-500 selection:text-white">
      {/* Dynamic Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] sm:w-[700px] h-[400px] bg-gradient-to-b from-rose-500/15 via-indigo-600/10 to-transparent blur-3xl opacity-80" />
      </div>

      {/* Main Centered Stage: Fits iPhone, iPad, and Mac naturally */}
      <main className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto flex flex-col items-center py-4 sm:py-8">
        
        {/* Dynamic Interactive Top Bar */}
        <header className="flex items-center justify-between w-full px-1 sm:px-2 mb-5 sm:mb-6">
          {/* Left: Interactive NMDP Official Link Pill */}
          <button
            onClick={handleOpenNmdpSite}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500/15 to-indigo-500/10 hover:from-rose-500/25 hover:to-indigo-500/20 border border-rose-500/25 hover:border-rose-400/40 text-left transition-all active:scale-95 shadow-sm"
            title="Visit official NMDP & Be The Match registry (my.nmdp.org)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 group-hover:text-white transition-colors">
              NMDP &bull; my.nmdp.org
            </span>
            <ExternalLink className="w-3 h-3 text-rose-400/70 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Right Action Icons: Share Link & Assignment Stats */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Share Invitation Link Button */}
            <button
              onClick={handleShare}
              className="text-[11px] text-white/60 hover:text-white active:scale-95 transition flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
              title="Copy event link to share"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-white/70" />
                  <span className="hidden sm:inline">share</span>
                </>
              )}
            </button>

            {/* Real-time Project Stats */}
            <button
              onClick={() => setStatsModalOpen(true)}
              className="text-[11px] text-white/60 hover:text-white active:scale-95 transition flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
              title="Class Assignment Real-time Stats"
            >
              <BarChart2 className="w-3 h-3 text-indigo-400" />
              <span>stats</span>
            </button>
          </div>
        </header>

        {/* September Awareness Tag with clickable link */}
        <button
          onClick={handleOpenNmdpSite}
          className="group w-full flex items-center justify-between gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-white/5 hover:border-amber-400/30 text-left transition-all active:scale-98"
          title="Learn more about Blood Cancer Awareness Month at NMDP"
        >
          <div className="flex items-center gap-2">
            <Ribbon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-[11px] sm:text-xs text-rose-100/90 font-medium">
              September: Blood Cancer &amp; Pediatric Cancer Awareness
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-300/80 group-hover:text-amber-200 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
            Learn ↗
          </span>
        </button>

        {/* ---------------------------------------------------- */}
        {/* STAGE 1: OPENING HERO & MATCH INTERACTION            */}
        {/* ---------------------------------------------------- */}
        <section className="w-full flex flex-col items-center text-center">
          {/* Main Question / Title */}
          <div className="min-h-[96px] sm:min-h-[110px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {!isMatched ? (
                <motion.h1
                  key="question"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-white"
                >
                  COULD YOU
                  <br />
                  <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                    BE A MATCH?
                  </span>
                </motion.h1>
              ) : (
                <motion.div
                  key="matched-badge"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-rose-500 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-rose-500/30">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    IT&apos;S A MATCH!
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 font-medium">
                    You could save someone&apos;s life.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Abstract Playful Matching Shapes (Supports Drag & Tap) */}
          <MatchingAnimation 
            isMatched={isMatched} 
            onMatch={handleMatch} 
          />

          {/* "FIND OUT" Action Button */}
          {!showInvitation && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 w-full flex justify-center px-4"
            >
              <button
                id="find-out-button"
                onClick={handleMatch}
                className="w-full max-w-xs sm:max-w-sm py-4 px-8 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 active:scale-95 transition-all duration-150 font-black text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-white/10 group cursor-pointer"
              >
                <span>FIND OUT</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </motion.div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* STAGE 2: INVITATION DETAILS                          */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {showInvitation && (
            <motion.section
              ref={invitationRef}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mt-8 flex flex-col items-center text-center"
            >
              {/* Card Wrapper */}
              <div className="w-full bg-[#15151e] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-9 shadow-2xl relative overflow-hidden">
                {/* Subtle top decorative glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-36 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Subtitle / Header */}
                <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-rose-400 mb-1">
                  YOU&apos;RE INVITED
                </p>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  NMDP
                  <br />
                  <span className="text-white/90">TABLING SESSION</span>
                </h2>

                {/* Big Bold Event Date & Time */}
                <div className="my-6 py-5 px-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-around">
                  {/* Date Block */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-extrabold text-rose-400 tracking-widest uppercase">
                      SEP
                    </span>
                    <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none my-1">
                      21
                    </span>
                    <span className="text-[11px] sm:text-xs text-white/50 font-medium">
                      Monday &bull; 2026
                    </span>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px h-14 bg-white/15" />

                  {/* Time Block */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-extrabold text-indigo-300 tracking-widest uppercase">
                      TIME
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mt-1">
                      10 AM — 12 PM
                    </span>
                    <span className="text-[11px] sm:text-xs text-white/50 font-medium">
                      Pacific Time (PT)
                    </span>
                  </div>
                </div>

                {/* Location Details with Quick Map Link */}
                <div className="flex flex-col items-center mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-4 h-4" />
                    UC BERKELEY
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white">
                    Outside Amazon Hub Locker
                  </p>
                  <button
                    onClick={openMapDirections}
                    className="text-xs sm:text-sm text-white/60 hover:text-white mt-0.5 inline-flex items-center gap-1 hover:underline transition"
                    title="Open in Google Maps"
                  >
                    <span>2495 Bancroft Way, Berkeley, CA 94720</span>
                    <Navigation className="w-3 h-3 text-rose-400" />
                  </button>
                </div>

                {/* Supporting Copy */}
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm sm:max-w-md mx-auto mb-7">
                  Stop by, meet NMDP + Berkeley MDes students, and learn how you could become someone&apos;s match. Blood stem cells restore blood and immune systems for patients with blood cancers or disorders.
                </p>

                {/* ---------------------------------------------------- */}
                {/* MAIN CTA: + ADD TO CALENDAR                          */}
                {/* ---------------------------------------------------- */}
                <motion.button
                  id="add-to-calendar-btn"
                  onClick={handleOpenCalendar}
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-600 text-white font-black text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 hover:brightness-105 active:scale-98 transition-all duration-200 cursor-pointer"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>+ ADD TO CALENDAR</span>
                </motion.button>

                {/* Attendance feedback pill if already tapped */}
                {hasAddedCalendar && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved to calendar! See you on Sept 21.</span>
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SECONDARY CTA                                        */}
                {/* ---------------------------------------------------- */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center">
                  <span className="text-xs text-white/40 mb-1 font-medium">Curious?</span>
                  <button
                    id="secondary-registry-btn"
                    onClick={handleRegistryClick}
                    className="text-xs sm:text-sm font-semibold text-rose-300 hover:text-rose-200 active:scale-95 transition flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Learn about joining the NMDP Registry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SCROLL DOWN TO MORE INFO & REGISTRATION              */}
              {/* ---------------------------------------------------- */}
              <motion.button
                onClick={() => {
                  trackEvent('more_info_click');
                  document.getElementById('event-more-info')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/80 hover:text-white transition group shadow-lg"
              >
                <span>More Details &amp; How to Register</span>
                <ChevronDown className="w-4 h-4 text-rose-400 group-hover:translate-y-1 transition-transform animate-bounce" />
              </motion.button>

              {/* ---------------------------------------------------- */}
              {/* ONE SMALL FACT (Simple, clean, punchy)               */}
              {/* ---------------------------------------------------- */}
              <div className="w-full max-w-sm sm:max-w-md mt-6 px-4 py-4 rounded-2xl bg-white/[0.04] border border-white/5 text-center">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300/90 block mb-1">
                  EVERY 3–4 MINUTES
                </span>
                <p className="text-xs sm:text-sm text-white/70 leading-normal">
                  someone in the U.S. is diagnosed with a blood cancer or disorder.
                </p>
              </div>

              {/* ---------------------------------------------------- */}
              {/* MORE INFO & TABLING REGISTRATION ACCORDION / GUIDE    */}
              {/* ---------------------------------------------------- */}
              <EventDetailsSection
                onAddCalendar={() => setCalendarSheetOpen(true)}
              />

              {/* Replay matching animation link */}
              <button
                onClick={() => {
                  setIsMatched(false);
                  setShowInvitation(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-8 text-xs text-white/30 hover:text-white/70 transition"
              >
                &larr; replay matching animation
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Interactive Bottom Bar & NMDP Portal Dock */}
        <footer className="w-full mt-12 pt-6 border-t border-white/10 flex flex-col items-center text-center gap-4">
          
          {/* Interactive Official NMDP Card Dock */}
          <div 
            onClick={handleOpenNmdpSite}
            className="w-full p-4 rounded-2xl bg-[#14141c] hover:bg-[#181824] border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer group shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
            title="Go to official NMDP registry website (my.nmdp.org)"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-wide">
                    NMDP &bull; Be The Match&reg;
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded">
                    Official Portal
                  </span>
                </div>
                <p className="text-[11px] text-white/50 mt-0.5">
                  National marrow registry connecting blood cancer patients to life-saving donors.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 group-hover:text-rose-300 shrink-0 bg-white/5 group-hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 group-hover:border-rose-500/20 transition-all">
              <span>my.nmdp.org</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Cal MDes × NMDP Collaboration Pill & Quick Share */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1 text-white/60">
              🐻 UC Berkeley MDes
            </span>
            <span>&times;</span>
            <span className="flex items-center gap-1 text-white/60">
              🩸 NMDP Registry
            </span>
            <span>&bull;</span>
            <button
              onClick={handleShare}
              className="text-white/40 hover:text-white/90 underline decoration-dotted transition text-xs"
            >
              {copiedLink ? '✓ Link Copied!' : 'Share invite with classmates'}
            </button>
          </div>

          <p className="text-[10px] text-white/30 max-w-xs sm:max-w-sm">
            Pop-up tabling outside Amazon Hub Locker (2495 Bancroft Way) &bull; Mon, Sept 21, 10 AM–12 PM PT
          </p>
        </footer>
      </main>

      {/* Calendar Bottom Sheet */}
      <CalendarBottomSheet
        isOpen={calendarSheetOpen}
        onClose={() => setCalendarSheetOpen(false)}
        onCalendarSelected={() => setHasAddedCalendar(true)}
      />

      {/* Real-time Tracking & Class Reflection Modal */}
      <StatsModal
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
      />
    </div>
  );
}
