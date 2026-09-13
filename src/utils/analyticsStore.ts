import { CampaignStats, InteractionLogItem } from '../types';

const STATS_STORAGE_KEY = 'nmdp_tabling_campaign_stats_v1';
const LOG_STORAGE_KEY = 'nmdp_tabling_campaign_logs_v1';

const DEFAULT_STATS: CampaignStats = {
  pageViews: 142,
  qrScans: 68,
  calendarAdds: 31,
  rsvps: 47,
  swabChecks: 54,
  linkShares: 26,
  directionsClicks: 39,
};

const DEFAULT_LOGS: InteractionLogItem[] = [
  { id: 'log-1', timestamp: '2026-09-13 09:12', action: 'qr_scan', label: 'Bancroft Amazon Locker physical flyer scanned', source: 'QR: 2495 Bancroft Locker' },
  { id: 'log-2', timestamp: '2026-09-13 09:14', action: 'swab_check', label: 'Completed 5-min eligibility questionnaire (Eligible)', source: 'Web Invitation' },
  { id: 'log-3', timestamp: '2026-09-13 09:15', action: 'rsvp', label: 'Student confirmed RSVP: "Will stop by between 10-11am"', source: 'Web Invitation' },
  { id: 'log-4', timestamp: '2026-09-13 10:22', action: 'calendar_add', label: 'Added event to Apple/Google Calendar (.ics)', source: 'Web Invitation' },
  { id: 'log-5', timestamp: '2026-09-13 11:05', action: 'qr_scan', label: 'Jacobs Hall design studio poster scanned', source: 'QR: Jacobs Hall' },
  { id: 'log-6', timestamp: '2026-09-13 11:30', action: 'link_share', label: 'Copied tracking link to Berkeley MDes WhatsApp/Slack', source: 'Share Modal' },
  { id: 'log-7', timestamp: '2026-09-13 12:45', action: 'directions_click', label: 'Looked up walking directions to 2495 Bancroft Way', source: 'Campus Map Widget' },
];

export function getStoredStats(): CampaignStats {
  try {
    const data = localStorage.getItem(STATS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return DEFAULT_STATS;
}

export function saveStoredStats(stats: CampaignStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function getStoredLogs(): InteractionLogItem[] {
  try {
    const data = localStorage.getItem(LOG_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return DEFAULT_LOGS;
}

export function recordInteraction(
  action: InteractionLogItem['action'],
  label: string,
  source = 'Web Invitation'
): { updatedStats: CampaignStats; newLog: InteractionLogItem } {
  const currentStats = getStoredStats();
  const currentLogs = getStoredLogs();

  const updatedStats = { ...currentStats };
  if (action === 'page_view') updatedStats.pageViews += 1;
  else if (action === 'qr_scan') updatedStats.qrScans += 1;
  else if (action === 'calendar_add') updatedStats.calendarAdds += 1;
  else if (action === 'rsvp') updatedStats.rsvps += 1;
  else if (action === 'swab_check') updatedStats.swabChecks += 1;
  else if (action === 'link_share') updatedStats.linkShares += 1;
  else if (action === 'directions_click') updatedStats.directionsClicks += 1;

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newLog: InteractionLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: dateStr,
    action,
    label,
    source,
  };

  const updatedLogs = [newLog, ...currentLogs.slice(0, 49)];

  saveStoredStats(updatedStats);
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch {
    // ignore
  }

  // Dispatch custom event so all active views update in real-time
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nmdp-analytics-updated', { detail: { stats: updatedStats, log: newLog } }));
  }

  return { updatedStats, newLog };
}

export function generateCalendarIcs(): string {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UC Berkeley MDes//NMDP Tabling Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'SUMMARY:NMDP Stem Cell & Bone Marrow Tabling Pop-up (Berkeley MDes)',
    'DESCRIPTION:Join Berkeley MDes students outside Amazon Hub Locker (2495 Bancroft Way) to register as a life-saving blood stem cell & marrow donor. Takes only 5 minutes! Someone is diagnosed with blood cancer every 3-4 minutes.',
    'LOCATION:Outside Amazon Hub Locker\\, 2495 Bancroft Way\\, Berkeley\\, CA 94720',
    'DTSTART:20260921T170000Z', // 10:00 AM PT is 17:00 UTC
    'DTEND:20260921T190000Z',   // 12:00 PM PT is 19:00 UTC
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return icsLines.join('\r\n');
}

export function downloadIcsFile() {
  const icsData = generateCalendarIcs();
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nmdp-berkeley-tabling-sept21.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
