import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { trackEvent, submitRSVP, getUserRSVPStatus } from '../utils/tracker';
import {
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Heart,
  Navigation,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  UserCheck,
  Send,
  Mail,
  User,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface EventDetailsSectionProps {
  onAddCalendar: () => void;
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ onAddCalendar }) => {
  const [hasRsvpd, setHasRsvpd] = useState<boolean>(() => getUserRSVPStatus());
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick 1-tap RSVP
  const handleQuickRSVP = async () => {
    if (hasRsvpd) return;
    setIsSubmitting(true);
    await submitRSVP();
    setHasRsvpd(true);
    setIsSubmitting(false);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#F43F5E', '#6366F1', '#10B981', '#F59E0B'],
    });
  };

  // Detailed RSVP with Name / Email
  const handleDetailedRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !name) {
      handleQuickRSVP();
      return;
    }
    setIsSubmitting(true);
    await submitRSVP(name, email);
    setHasRsvpd(true);
    setIsSubmitting(false);

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#F43F5E', '#6366F1', '#10B981', '#F59E0B'],
    });
  };

  // Track & Open NMDP Official Registry
  const handleOpenRegistry = () => {
    trackEvent('register_link_click');
    trackEvent('registry_click');
    window.open('https://my.nmdp.org', '_blank', 'noopener,noreferrer');
  };

  const openDirections = (service: 'google' | 'apple') => {
    const address = encodeURIComponent('2495 Bancroft Way, Berkeley, CA 94720');
    if (service === 'apple') {
      window.open(`https://maps.apple.com/?q=${address}`, '_blank');
    } else {
      window.open(`https://maps.google.com/?q=${address}`, '_blank');
    }
  };

  const faqs = [
    {
      q: 'What happens at the Bancroft tabling pop-up?',
      a: 'It takes under 3 minutes! You will meet Berkeley MDes volunteers, get a sterile cotton swab to gently rub the inside of your cheek for 30 seconds, and enter your basic contact info on your phone.',
    },
    {
      q: 'Does joining the registry hurt?',
      a: 'Not at all. Joining is just a quick cheek swab. If you match a patient in the future, 85% of donations are non-surgical blood draws (PBSC) where stem cells are filtered out similar to giving platelets.',
    },
    {
      q: 'Why are college students needed so urgently?',
      a: 'Doctors prefer donors between ages 18 and 35 because research shows younger donors provide higher survival rates for blood cancer patients. You stay on the registry until age 44 unless you ask to be removed.',
    },
    {
      q: 'How do blood stem cells save a life?',
      a: 'Blood stem cells live in bone marrow and blood. When donated to patients with leukemia, lymphoma, or sickle cell disease, these healthy cells start producing new cells to replace damaged ones and help restore their entire blood and immune system.',
    },
  ];

  return (
    <section id="event-more-info" className="w-full mt-10 pt-8 border-t border-white/10 flex flex-col items-center">
      
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3 h-3" />
          MORE INFO &bull; EVENT &amp; REGISTRATION
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How to Join &amp; What to Expect
        </h3>
        <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-md mx-auto">
          Everything you need to know about the Berkeley pop-up and the life-saving registry.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 1: EVENT RSVP & ONLINE REGISTRATION                       */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-[#161622] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base sm:text-lg font-bold text-white">
              Event Registration &bull; Tabling RSVP
            </h4>
          </div>
          <span className="text-[10px] sm:text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            Free &bull; Drop-in Anytime
          </span>
        </div>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-5">
          Planning to swing by outside Amazon Hub Locker on <strong>Monday, Sept 21 (10 AM &ndash; 12 PM)</strong>? Let us know so the Berkeley MDes team can prepare enough swab kits &amp; treats!
        </p>

        {/* RSVP Status / Interactive Actions */}
        {!hasRsvpd ? (
          <div className="space-y-3">
            {/* Quick 1-Tap RSVP Button */}
            <button
              onClick={handleQuickRSVP}
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-98 transition font-black text-sm text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : '🙋 Count Me In! (1-Tap RSVP)'}</span>
            </button>

            {/* Optional detailed form toggle */}
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full text-center text-xs text-white/50 hover:text-white/80 transition underline pt-1"
              >
                Want an email reminder on Sept 21 morning? Click here
              </button>
            ) : (
              <form onSubmit={handleDetailedRSVP} className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <span className="text-xs font-bold text-white/80 block">Get a morning reminder:</span>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    placeholder="Berkeley email or personal email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save My RSVP Reminder</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  You&apos;re on the RSVP list!
                </span>
                <span className="text-[11px] text-white/60">
                  See you outside Amazon Hub Locker on Mon, Sept 21.
                </span>
              </div>
            </div>
            <button
              onClick={onAddCalendar}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-[11px] font-bold text-white flex items-center gap-1 shrink-0"
            >
              <Calendar className="w-3 h-3 text-rose-400" />
              <span>Calendar</span>
            </button>
          </div>
        )}

        {/* Alternative: Can't make it in person? Join Online */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              Can&apos;t make it on Sept 21?
            </span>
            <p className="text-[11px] text-white/50 mt-0.5">
              NMDP will mail a free cheek swab kit directly to your dorm or home.
            </p>
          </div>

          <button
            onClick={handleOpenRegistry}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 active:scale-95 transition text-xs font-bold text-rose-300 hover:text-white flex items-center justify-center gap-1.5 shrink-0 group cursor-pointer"
          >
            <span>Register Online at my.nmdp.org</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 2: 3-MINUTE TABLING WALKTHROUGH                           */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-[#14141d] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl mb-6 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h4 className="text-base sm:text-lg font-bold text-white">
            What Happens in 3 Minutes at the Table?
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-black text-xs flex items-center justify-center mb-2">
              1
            </span>
            <h5 className="text-xs font-bold text-white mb-1">Meet Berkeley Volunteers</h5>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Say hello to MDes students outside Amazon Hub Locker and grab a swab packet.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center mb-2">
              2
            </span>
            <h5 className="text-xs font-bold text-white mb-1">30-Second Cheek Swab</h5>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Gently swirl the sterile cotton swab inside both cheeks. Painless and quick.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center mb-2">
              3
            </span>
            <h5 className="text-xs font-bold text-white mb-1">Digital Registration</h5>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Scan a QR code on your phone to link your kit to your contact info. You&apos;re done!
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 3: LOCATION & HOW TO FIND US                             */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-[#14141d] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl mb-6 text-left">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-300" />
            <h4 className="text-base sm:text-lg font-bold text-white">
              Location &amp; Directions
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-white/50">Near Sproul Plaza</span>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
          We will be set up directly <strong>outside the Amazon Hub Locker</strong> at <strong>2495 Bancroft Way, Berkeley, CA 94720</strong> (between Telegraph Ave and Dana St, right across the street from the south edge of campus). Look for the NMDP and Berkeley MDes table!
        </p>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openDirections('google')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-rose-400" />
            <span>Open in Google Maps</span>
          </button>

          <button
            onClick={() => openDirections('apple')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open in Apple Maps</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 4: FAQS ACCORDION                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-[#14141d] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl text-left">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-rose-400" />
          <h4 className="text-base sm:text-lg font-bold text-white">
            Frequently Asked Questions
          </h4>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-rose-200 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180 text-rose-400' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-4 sm:px-4 text-xs text-white/70 leading-relaxed border-t border-white/5 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
