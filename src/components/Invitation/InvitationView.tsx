import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  CheckCircle, 
  Share2, 
  Printer, 
  Sparkles, 
  ChevronRight, 
  UserCheck, 
  Compass, 
  Award,
  ExternalLink,
  Smartphone,
  Eye
} from 'lucide-react';
import { EVENT_DETAILS } from '../../data/clusterMapData';
import { CampaignStats } from '../../types';
import { recordInteraction, downloadIcsFile } from '../../utils/analyticsStore';

interface InvitationViewProps {
  stats: CampaignStats;
  onNavigateToAnalytics: () => void;
}

export const InvitationView: React.FC<InvitationViewProps> = ({ stats, onNavigateToAnalytics }) => {
  const [activeFormat, setActiveFormat] = useState<'digital' | 'poster' | 'social'>('digital');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [eligibilityStep, setEligibilityStep] = useState<number>(0);
  const [eligibilityResult, setEligibilityResult] = useState<boolean | null>(null);

  // Generate QR Code that points to current window location with UTM parameter
  useEffect(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://berkeley-mdes-nmdp.edu';
    // Clean url of any existing query and append tracking
    const baseUrl = currentUrl.split('?')[0];
    const trackableUrl = `${baseUrl}?src=qr_bancroft_locker&utm_campaign=nmdp_tabling`;

    QRCode.toDataURL(trackableUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then(url => {
      setQrCodeDataUrl(url);
    }).catch(err => {
      console.error('Error generating QR code', err);
    });
  }, []);

  // Handle RSVP
  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    recordInteraction('rsvp', `RSVP confirmed: ${rsvpName.trim()}`, 'Digital Invitation Form');
    setRsvpSubmitted(true);

    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#0284c7', '#059669', '#f59e0b'],
    });
  };

  // Handle Calendar Download
  const handleCalendarAdd = () => {
    recordInteraction('calendar_add', 'Added Sept 21 Tabling to Calendar (.ics file)', 'Digital Invitation');
    downloadIcsFile();
  };

  // Handle Share Link
  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
    recordInteraction('link_share', 'Copied Invitation tracking link to clipboard', 'Share Button');
  };

  // Handle Direction click
  const handleDirections = () => {
    recordInteraction('directions_click', 'Clicked Google Maps walking directions to 2495 Bancroft Way', 'Location Card');
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=2495+Bancroft+Way+Berkeley+CA+94720`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle Simulated QR Scan for demo testing
  const handleSimulateQrScan = () => {
    recordInteraction('qr_scan', 'Physical Poster QR Code scanned by visitor', 'Flyer: 2495 Bancroft Locker');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  // Handle Eligibility Quiz
  const handleEligibilityAnswer = (answer: boolean) => {
    if (!answer) {
      setEligibilityResult(false);
    } else if (eligibilityStep < 2) {
      setEligibilityStep(s => s + 1);
    } else {
      setEligibilityResult(true);
      recordInteraction('swab_check', 'User completed 3-question eligibility check (Eligible)', 'Eligibility Widget');
    }
  };

  const handlePrintPoster = () => {
    recordInteraction('link_share', 'Triggered print flyer/poster format', 'Print Dialog');
    window.print();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Format Toggle Bar & Real-time tracker pill */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
              Assignment Task 3 &bull; Invitation Design
            </span>
            <span className="text-xs text-slate-500 font-medium hidden md:inline">
              Mandatory Metric: Real-Time Interaction Tracking
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            NMDP Tabling Session Invitation Suite
          </h2>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            id="btn-format-digital"
            onClick={() => setActiveFormat('digital')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeFormat === 'digital'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital Interactive Hub
          </button>
          <button
            id="btn-format-poster"
            onClick={() => setActiveFormat('poster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeFormat === 'poster'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Printable Campus Flyer</span>
          </button>
          <button
            id="btn-format-social"
            onClick={() => setActiveFormat('social')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeFormat === 'social'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Story Card (9:16)</span>
          </button>
        </div>
      </div>

      {/* Live Interaction Alert Pill */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="text-emerald-900 font-medium">
            <strong>Active Interaction Tracking Active:</strong> Any clicks on RSVP, Calendar Sync, Swab Check, or QR Scan instantly log toward your assignment writeup.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-300">
            {stats.rsvps} RSVPs &bull; {stats.qrScans} QR Scans &bull; {stats.calendarAdds} Calendar Syncs
          </span>
          <button
            onClick={onNavigateToAnalytics}
            className="text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-1"
          >
            View Dashboard
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORMAT 1: DIGITAL INTERACTIVE INVITATION                                   */}
      {/* ========================================================================= */}
      {activeFormat === 'digital' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Invitation Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Awareness Month Ribbon */}
            <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-white" />
                September Blood Cancer &amp; Pediatric Cancer Awareness Month
              </span>
              <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                Be The Match &bull; NMDP
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Event Title & Berkeley Subtitle */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                    UC Berkeley Campus Pop-Up
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Organized by Berkeley MDes Volunteers
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  Join the NMDP Registry &amp; Save a Life: 5-Minute Cheek Swab
                </h1>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Join UC Berkeley Master of Design students outside the Amazon Hub Locker for an empowering pop-up swab drive. Discover how simple it is to become a stem cell match for patients fighting acute blood cancers and disorders.
                </p>
              </div>

              {/* Crucial Diagnostic Fact Highlight (From Prompt) */}
              <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  3-4m
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-950">
                    Approximately every 3–4 minutes, someone in the U.S. is diagnosed with a blood cancer or disorder.
                  </h4>
                  <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                    Blood stem cells live in bone marrow and blood. When donated to patients with blood cancers or disorders, these healthy cells start producing new cells to replace damaged ones and help restore their blood and immune systems.
                  </p>
                </div>
              </div>

              {/* Event Time & Location Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Date &amp; Time
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Monday, September 21st
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      10:00 AM – 12:00 PM PT
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Location
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Outside Amazon Hub Locker
                    </p>
                    <p className="text-xs text-slate-600 truncate mt-0.5" title="2495 Bancroft Way, Berkeley, CA 94720">
                      2495 Bancroft Way, Berkeley, CA
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Medical Demystification */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  What to Expect at the Tabling:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-emerald-700 font-bold block mb-1">1. 5-Min Cheek Swab</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Painless cotton swab inside your mouth to record your HLA genetic markers.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-sky-700 font-bold block mb-1">2. 85% is Non-Surgical</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Most donations are simple blood filtration (PBSC apheresis), not surgery!
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-purple-700 font-bold block mb-1">3. Diverse Matches Needed</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Minority patients face a 29% match rate. Your ethnic heritage could be the only cure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaction Call-To-Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="btn-add-to-calendar"
                  onClick={handleCalendarAdd}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
                >
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>Add to Apple / Google Calendar</span>
                </button>

                <button
                  id="btn-get-directions"
                  onClick={handleDirections}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-slate-300"
                >
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>View Walking Map (Bancroft Way)</span>
                </button>

                <button
                  id="btn-share-invite-link"
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-slate-300"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share Invitation'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Engagement & Tracking Sidebar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Interactive RSVP Form (Tracked Data Point) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Interaction Tracker Data Point
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Pledge to Stop by &amp; Swab
              </h3>
              <p className="text-xs text-slate-600 mt-1 mb-4">
                Let Berkeley MDes volunteers know you&apos;re swinging by outside Amazon Hub Locker between 10am–12pm.
              </p>

              {rsvpSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Thank You, {rsvpName}!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your pledge has been logged! See you Monday, Sept 21 outside Amazon Locker (2495 Bancroft Way).
                  </p>
                  <button
                    onClick={() => { setRsvpSubmitted(false); setRsvpName(''); }}
                    className="mt-3 text-xs font-semibold text-emerald-800 underline"
                  >
                    Submit another pledge
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvp} className="space-y-3">
                  <div>
                    <label htmlFor="rsvp-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name or Student Handle
                    </label>
                    <input
                      id="rsvp-name-input"
                      type="text"
                      required
                      value={rsvpName}
                      onChange={e => setRsvpName(e.target.value)}
                      placeholder="e.g. Maya Chen, MDes '27"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <button
                    id="btn-submit-rsvp"
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Confirm My Tabling Visit</span>
                  </button>
                </form>
              )}
            </div>

            {/* Quick 30-Second Swab Eligibility Check (Tracked Data Point) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-sky-600 mb-1">
                <UserCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Interactive Check
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Are You Eligible to Swab?
              </h3>
              <p className="text-xs text-slate-600 mt-1 mb-3">
                Check whether you meet NMDP guidelines before heading over:
              </p>

              {eligibilityResult === null ? (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  {eligibilityStep === 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-800 mb-2">
                        1. Are you between the ages of 18 and 40?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEligibilityAnswer(true)}
                          className="flex-1 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-300 hover:border-emerald-500 rounded-lg text-xs font-semibold"
                        >
                          Yes (18–40)
                        </button>
                        <button
                          onClick={() => handleEligibilityAnswer(false)}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-medium"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {eligibilityStep === 1 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-800 mb-2">
                        2. Are you in generally good overall health (no active cancer or severe heart condition)?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEligibilityAnswer(true)}
                          className="flex-1 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-300 hover:border-emerald-500 rounded-lg text-xs font-semibold"
                        >
                          Yes, in good health
                        </button>
                        <button
                          onClick={() => handleEligibilityAnswer(false)}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-medium"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {eligibilityStep === 2 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-800 mb-2">
                        3. Are you willing to donate to ANY patient in need if you are matched?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEligibilityAnswer(true)}
                          className="flex-1 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-300 hover:border-emerald-500 rounded-lg text-xs font-semibold"
                        >
                          Yes, ready to save a life
                        </button>
                        <button
                          onClick={() => handleEligibilityAnswer(false)}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-medium"
                        >
                          Not sure
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : eligibilityResult ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    You are an ideal candidate to register!
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Young adult donors provide the highest survival odds for blood cancer patients. Stop by the table on Monday, Sept 21 outside Amazon Locker!
                  </p>
                  <button
                    onClick={() => { setEligibilityResult(null); setEligibilityStep(0); }}
                    className="mt-2 text-[10px] text-emerald-700 underline font-semibold"
                  >
                    Check again
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700">
                  <p className="font-semibold mb-1">Thank you for caring!</p>
                  <p className="text-[11px] text-slate-600">
                    Even if you cannot swab, you can still support by spreading the word or volunteering at our table!
                  </p>
                  <button
                    onClick={() => { setEligibilityResult(null); setEligibilityStep(0); }}
                    className="mt-2 text-[10px] text-slate-700 underline font-semibold"
                  >
                    Retake check
                  </button>
                </div>
              )}
            </div>

            {/* Scannable Physical QR Code Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Tracked QR Code Asset
              </span>
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Scan with Phone Camera
              </h4>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs mb-3">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="NMDP Tabling QR Code"
                    className="w-40 h-40"
                  />
                ) : (
                  <div className="w-40 h-40 bg-slate-100 animate-pulse rounded-lg" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs leading-tight mb-3">
                Scans automatically register on your campaign tracker with timestamp and location tag.
              </p>
              <button
                onClick={handleSimulateQrScan}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Simulate / Log Scan Event</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORMAT 2: PRINTABLE CAMPUS FLYER / POSTER (8.5x11 Ratio)                  */}
      {/* ========================================================================= */}
      {activeFormat === 'poster' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-between w-full max-w-2xl gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                UC Berkeley Campus Flyer (Print Ready)
              </h3>
              <p className="text-xs text-slate-600">
                Optimized for campus bulletin boards along Bancroft Way, MLK Student Union, and Jacobs Hall.
              </p>
            </div>
            <button
              onClick={handlePrintPoster}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Flyer PDF</span>
            </button>
          </div>

          {/* Flyer Sheet Preview */}
          <div
            id="printable-campus-poster"
            className="w-full max-w-2xl bg-white border-2 border-slate-900 rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 text-slate-900 flex flex-col justify-between"
            style={{ minHeight: '840px' }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-xl">
                  NMDP
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-tight uppercase">
                    UC Berkeley Master of Design &times; NMDP
                  </h4>
                  <p className="text-[11px] font-semibold text-rose-600">
                    Blood Cancer &amp; Pediatric Cancer Awareness Campaign
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                  Free Swab Kit
                </span>
              </div>
            </div>

            {/* Hero Section */}
            <div className="my-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-1">
                You Could Be Someone&apos;s Cure
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight uppercase">
                Save a Life in 5 Minutes.
              </h1>
              <div className="mt-4 p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl">
                <p className="text-sm font-bold text-rose-950 leading-snug">
                  Approximately every 3–4 minutes, someone in the U.S. is diagnosed with a blood cancer or disorder.
                </p>
                <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                  Blood stem cells live in bone marrow and blood. When donated to patients with blood cancers or disorders, these healthy cells start producing new cells to replace damaged ones and help restore their blood and immune systems.
                </p>
              </div>
            </div>

            {/* Event Time & Coordinates Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 p-5 bg-slate-100 rounded-xl border border-slate-300">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-0.5">
                  WHEN
                </span>
                <p className="text-base font-extrabold text-slate-900">
                  Monday, Sept 21st
                </p>
                <p className="text-xs font-bold text-rose-600">
                  10:00 AM – 12:00 PM PT
                </p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-0.5">
                  WHERE ON CAMPUS
                </span>
                <p className="text-base font-extrabold text-slate-900">
                  Outside Amazon Hub Locker
                </p>
                <p className="text-xs font-semibold text-slate-600">
                  2495 Bancroft Way, Berkeley, CA
                </p>
              </div>
            </div>

            {/* 3 Quick Facts */}
            <div className="grid grid-cols-3 gap-3 my-4 text-center">
              <div className="p-2 border border-slate-200 rounded-lg">
                <span className="text-base font-black text-slate-900 block">5 Mins</span>
                <span className="text-[10px] text-slate-600 font-medium leading-tight block">Cheek swab only</span>
              </div>
              <div className="p-2 border border-slate-200 rounded-lg">
                <span className="text-base font-black text-slate-900 block">85%</span>
                <span className="text-[10px] text-slate-600 font-medium leading-tight block">Simple blood draw</span>
              </div>
              <div className="p-2 border border-slate-200 rounded-lg">
                <span className="text-base font-black text-rose-600 block">18–40</span>
                <span className="text-[10px] text-slate-600 font-medium leading-tight block">Ideal age range</span>
              </div>
            </div>

            {/* Bottom Scannable QR Callout */}
            <div className="mt-4 pt-4 border-t-2 border-slate-900 flex items-center justify-between gap-6">
              <div className="flex-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 block mb-1">
                  Scan to RSVP &amp; Track Event
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  Point Your Phone Camera Here
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Directly adds the event to your phone calendar and checks your donor eligibility in 30 seconds.
                </p>
                <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tracking Code: #UCB-MDES-SEPT21
                </div>
              </div>

              <div className="shrink-0 p-2 bg-white border-2 border-slate-900 rounded-xl shadow-xs">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Campus Flyer QR Code"
                    className="w-28 h-28"
                  />
                ) : (
                  <div className="w-28 h-28 bg-slate-200 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORMAT 3: INSTAGRAM / SOCIAL STORY CARD (9:16)                           */}
      {/* ========================================================================= */}
      {activeFormat === 'social' && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-bold text-slate-900">
              Social Media Story Card (9:16)
            </h3>
            <p className="text-xs text-slate-600">
              Designed for student Instagram stories, WhatsApp groups, and Berkeley MDes Slack channels.
            </p>
          </div>

          <div
            id="social-story-card"
            className="w-80 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-rose-950 text-white p-6 shadow-2xl border-4 border-slate-800 flex flex-col justify-between relative overflow-hidden"
            style={{ height: '568px' }}
          >
            {/* Top Badge */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full">
                  UC Berkeley Pop-Up
                </span>
                <span className="text-slate-400">
                  Sept 21 &bull; 10am
                </span>
              </div>
              <h2 className="text-2xl font-extrabold leading-tight text-white mt-2">
                Be Someone&apos;s Match.
              </h2>
              <p className="text-xs text-rose-300 font-semibold mt-1">
                NMDP Bone Marrow &amp; Stem Cell Drive
              </p>
            </div>

            {/* Center Stat */}
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 my-3">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-0.5">
                Did You Know?
              </span>
              <p className="text-xs font-semibold leading-relaxed text-slate-100">
                Every 3-4 mins someone in the U.S. is diagnosed with a blood cancer. Donated stem cells restore their blood and immune system.
              </p>
            </div>

            {/* Time & Place */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Monday, Sept 21 &bull; 10am – 12pm</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Outside Amazon Hub Locker (2495 Bancroft)</span>
              </div>
            </div>

            {/* Bottom Scannable QR Code */}
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-rose-400 block">
                  Scan to RSVP
                </span>
                <p className="text-[11px] text-slate-300 font-medium leading-tight">
                  Trackable invite link &bull; 5-min cheek swab
                </p>
              </div>
              <div className="p-1.5 bg-white rounded-xl shrink-0">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Social QR"
                    className="w-16 h-16"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-200" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
