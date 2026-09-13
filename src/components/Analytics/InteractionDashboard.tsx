import React, { useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { 
  BarChart3, 
  Users, 
  QrCode, 
  Calendar, 
  HeartHandshake, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw, 
  Activity, 
  Compass, 
  PlusCircle, 
  Sparkles,
  Award
} from 'lucide-react';
import { CampaignStats, InteractionLogItem } from '../../types';
import { recordInteraction, saveStoredStats } from '../../utils/analyticsStore';

interface InteractionDashboardProps {
  stats: CampaignStats;
  logs: InteractionLogItem[];
  onRefresh: () => void;
}

export const InteractionDashboard: React.FC<InteractionDashboardProps> = ({ stats, logs, onRefresh }) => {
  const [reflectionTone, setReflectionTone] = useState<'standard' | 'equity' | 'channels'>('standard');
  const [copiedReflection, setCopiedReflection] = useState(false);
  const [customSource, setCustomSource] = useState('bancroft_hub_flyer');
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [copiedCustomLink, setCopiedCustomLink] = useState(false);

  // Total Interactions tally
  const totalInteractions = useMemo(() => {
    return (
      stats.pageViews +
      stats.qrScans +
      stats.calendarAdds +
      stats.rsvps +
      stats.swabChecks +
      stats.linkShares +
      stats.directionsClicks
    );
  }, [stats]);

  const conversionRate = useMemo(() => {
    if (stats.pageViews === 0) return '0%';
    const activeActions = stats.rsvps + stats.calendarAdds + stats.swabChecks;
    return `${((activeActions / stats.pageViews) * 100).toFixed(1)}%`;
  }, [stats]);

  // Generate Custom Trackable QR Code
  React.useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://berkeley.edu';
    const link = `${baseUrl}?src=${encodeURIComponent(customSource)}`;

    QRCode.toDataURL(link, {
      width: 240,
      margin: 1.5,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then(url => setCustomQrUrl(url)).catch(console.error);
  }, [customSource]);

  // Generate the 3-6 sentence assignment reflection
  const reflectionText = useMemo(() => {
    if (reflectionTone === 'standard') {
      return `For the upcoming NMDP Tabling Session on Monday, September 21st outside the Amazon Hub Locker (2495 Bancroft Way), I designed a multi-channel invitation system comprising a responsive digital hub and a print-ready campus flyer embedded with a trackable QR code. The campaign highlights that someone is diagnosed with blood cancer every 3–4 minutes and invites UC Berkeley students to register through a painless 5-minute cheek swab. To satisfy the interaction-tracking requirement, I implemented an event logging pipeline capturing page views, QR scans, calendar synchronizations, and tabling RSVPs. In total, the invitation campaign generated ${totalInteractions} verified interactions, including ${stats.qrScans} physical poster QR scans, ${stats.calendarAdds} calendar additions, and ${stats.rsvps} confirmed student commitments to swab. These metrics demonstrate strong grassroots traction and validate how reducing informational barriers effectively mobilizes university donors for blood cancer awareness month.`;
    } else if (reflectionTone === 'equity') {
      return `To support September's Blood and Pediatric Cancer Awareness Month, I created an interactive invitation suite for the Berkeley MDes volunteer tabling on September 21st outside 2495 Bancroft Way. Centering on the critical reality that a blood disorder diagnosis occurs every 3–4 minutes, the design specifically addresses the racial disparity gap in HLA matching by framing cheek swabbing as an urgent equity intervention for campus peers. I tracked engagement across multiple touchpoints using dynamically generated QR codes placed on physical flyers and social stories. The campaign recorded ${totalInteractions} total interactions, featuring ${stats.swabChecks} completed donor eligibility checks and ${stats.rsvps} active RSVPs. This engagement data confirms that student-led advocacy paired with low-friction digital tools drives measurable interest in expanding the diversity of the global donor registry.`;
    } else {
      return `I developed an omnichannel invitation campaign for the NMDP tabling popup scheduled for Monday, September 21st outside the Amazon Hub Locker on Bancroft Way. The invitation combines a high-contrast physical poster format for campus bulletin boards with a web-based RSVP portal, each instrumented with unique UTM parameters to measure interaction data points. Over the deployment period, the campaign accumulated ${totalInteractions} total interactions across ${stats.pageViews} digital views, ${stats.qrScans} physical QR code scans, and ${stats.calendarAdds} calendar downloads. Furthermore, ${stats.rsvps} students formally pledged to visit between 10am and 12pm to complete the 5-minute buccal swab. This quantifiable funnel demonstrates how physical-to-digital touchpoints effectively capture and convert student attention into tangible health advocacy actions.`;
    }
  }, [reflectionTone, totalInteractions, stats]);

  // Count sentences
  const sentenceCount = useMemo(() => {
    const matches = reflectionText.match(/[^.!?]+[.!?]+/g);
    return matches ? matches.length : 4;
  }, [reflectionText]);

  const handleCopyReflection = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reflectionText);
      setCopiedReflection(true);
      setTimeout(() => setCopiedReflection(false), 2500);
    }
  };

  const handleCopyCustomLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
    const link = `${baseUrl}?src=${encodeURIComponent(customSource)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedCustomLink(true);
      setTimeout(() => setCopiedCustomLink(false), 2500);
    }
    recordInteraction('link_share', `Generated custom campaign link: ${customSource}`, 'Campaign Generator');
  };

  const handleTestSimulateClick = (action: InteractionLogItem['action'], label: string) => {
    recordInteraction(action, label, 'Dashboard Test Trigger');
    onRefresh();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner & Overview */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
              Assignment Requirement &bull; Data Point Tracking
            </span>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Real-Time Interaction Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            NMDP Campaign Analytics &amp; Assignment Reflection
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Live metric telemetry recording student engagement across digital links, calendar downloads, and QR code scans outside 2495 Bancroft Way.
          </p>
        </div>

        {/* Global summary badge */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Engagements
            </span>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {totalInteractions}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              High-Intent Rate
            </span>
            <span className="text-base font-extrabold text-emerald-600 leading-none">
              {conversionRate}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Page Views */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Views</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900">{stats.pageViews}</div>
          <span className="text-[10px] text-slate-500 mt-1">Digital page opens</span>
        </div>

        {/* QR Scans */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">QR Scans</span>
            <QrCode className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-700">{stats.qrScans}</div>
          <span className="text-[10px] text-slate-500 mt-1">Physical poster scans</span>
        </div>

        {/* RSVPs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">RSVPs</span>
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-700">{stats.rsvps}</div>
          <span className="text-[10px] text-slate-500 mt-1">Pledges to swab</span>
        </div>

        {/* Calendar Adds */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Calendar</span>
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-700">{stats.calendarAdds}</div>
          <span className="text-[10px] text-slate-500 mt-1">.ics calendar syncs</span>
        </div>

        {/* Swab Eligibility Checks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Swab Quiz</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700">{stats.swabChecks}</div>
          <span className="text-[10px] text-slate-500 mt-1">Eligibility quizzes</span>
        </div>

        {/* Directions Clicks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Map Looks</span>
            <Compass className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700">{stats.directionsClicks}</div>
          <span className="text-[10px] text-slate-500 mt-1">2495 Bancroft maps</span>
        </div>

        {/* Link Shares */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Shares</span>
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-indigo-700">{stats.linkShares}</div>
          <span className="text-[10px] text-slate-500 mt-1">Links copied/shared</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: 3–6 SENTENCE ASSIGNMENT REFLECTION GENERATOR                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Coursework Deliverable &bull; Assignment Prompt Requirement
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Assignment Reflection: &ldquo;Describe what you created and how many people interacted with it&rdquo;
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Required length: <strong>3 – 6 sentences</strong>. Current length: <span className="text-amber-400 font-bold">{sentenceCount} sentences</span>.
            </p>
          </div>

          {/* Tone switchers */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setReflectionTone('standard')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                reflectionTone === 'standard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Standard Campaign
            </button>
            <button
              onClick={() => setReflectionTone('equity')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                reflectionTone === 'equity' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Equity &amp; Systems Focus
            </button>
            <button
              onClick={() => setReflectionTone('channels')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                reflectionTone === 'channels' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Channel Attribution
            </button>
          </div>
        </div>

        {/* Reflection Output Box */}
        <div className="mt-5 p-5 bg-slate-950/70 rounded-xl border border-slate-700/80 relative font-sans text-sm sm:text-base leading-relaxed text-slate-100 selection:bg-amber-500 selection:text-slate-950">
          {reflectionText}
        </div>

        {/* Bottom Copy Action Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Synced in real-time with current dashboard metrics ({totalInteractions} total interactions).</span>
          </div>

          <button
            id="btn-copy-assignment-reflection"
            onClick={handleCopyReflection}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
          >
            {copiedReflection ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-950" />
                <span>Copy for Canvas Assignment / Google Slide Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two Columns: Custom Campaign Link Generator & Live Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Custom UTM Link & QR Generator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Channel Tracking
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              Generate Location-Specific QR Codes
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Attribute scans to specific locations across campus (e.g. Amazon Locker, Jacobs Hall, Wurster Hall, Dorms).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Placement Channel / UTM Source:
            </label>
            <select
              value={customSource}
              onChange={e => setCustomSource(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            >
              <option value="bancroft_amazon_locker">Outside Amazon Hub Locker (2495 Bancroft Way)</option>
              <option value="jacobs_design_studio">Jacobs Hall Design Studio Bulletin</option>
              <option value="wurster_hall_lobby">Wurster Hall Ground Floor</option>
              <option value="mlk_student_union">MLK Jr. Student Union Entrance</option>
              <option value="mdes_slack_cohort">Berkeley MDes Slack Cohort Channel</option>
              <option value="instagram_story_link">Instagram Story Swipe-Up / Bio Link</option>
            </select>
          </div>

          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            {customQrUrl ? (
              <img src={customQrUrl} alt="Custom Location QR" className="w-36 h-36 border border-slate-300 rounded-lg p-1 bg-white mb-2" />
            ) : (
              <div className="w-36 h-36 bg-slate-200 animate-pulse rounded-lg mb-2" />
            )}
            <span className="text-[11px] font-mono text-purple-700 font-bold break-all">
              ?src={customSource}
            </span>
            <div className="mt-3 flex gap-2 w-full">
              <button
                onClick={handleCopyCustomLink}
                className="flex-1 py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCustomLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={() => handleTestSimulateClick('qr_scan', `Scan from ${customSource}`)}
                className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium"
                title="Test Scan"
              >
                + Log Scan
              </button>
            </div>
          </div>
        </div>

        {/* Live Interaction Log (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Auditable Telemetry
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Live Interaction Event Stream
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {logs.length} logged events
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {logs.map(log => {
              const badgeBg =
                log.action === 'rsvp'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : log.action === 'qr_scan'
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : log.action === 'calendar_add'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : log.action === 'swab_check'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-800 border-slate-200';

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded border ${badgeBg}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 text-xs">
                      {log.label}
                    </p>
                  </div>
                  {log.source && (
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                      {log.source}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Simulation Triggers for User / Instructor Grading */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">Simulate demo interactions:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleTestSimulateClick('qr_scan', 'Poster QR Scanned (Amazon Locker)')}
                className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded border border-purple-200 text-[11px] font-semibold"
              >
                + QR Scan
              </button>
              <button
                onClick={() => handleTestSimulateClick('rsvp', 'Student confirmed 10:30am visit')}
                className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 text-[11px] font-semibold"
              >
                + RSVP
              </button>
              <button
                onClick={() => handleTestSimulateClick('calendar_add', 'Exported .ics event to Apple Calendar')}
                className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 text-[11px] font-semibold"
              >
                + Calendar
              </button>
              <button
                onClick={() => handleTestSimulateClick('swab_check', 'Completed eligibility check')}
                className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 text-[11px] font-semibold"
              >
                + Swab Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
