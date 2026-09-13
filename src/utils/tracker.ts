// Anonymous Cross-Device & Interaction Tracker
// Records interaction metrics and optional event RSVPs

export type TrackedEvent =
  | 'invitation_view'
  | 'find_out_click'
  | 'add_to_calendar_click'
  | 'apple_calendar_click'
  | 'google_calendar_click'
  | 'registry_click'
  | 'more_info_click'
  | 'register_link_click'
  | 'tabling_rsvp_count';

export interface TrackerCounts {
  invitation_view: number;
  find_out_click: number;
  add_to_calendar_click: number;
  apple_calendar_click: number;
  google_calendar_click: number;
  registry_click: number;
  more_info_click: number;
  register_link_click: number;
  tabling_rsvp_count: number;
  [key: string]: number;
}

const LOCAL_STORAGE_KEY = 'nmdp_event_counts_v2';
const LOCAL_RSVP_KEY = 'nmdp_user_rsvp_v1';

const defaultCounts: TrackerCounts = {
  invitation_view: 0,
  find_out_click: 0,
  add_to_calendar_click: 0,
  apple_calendar_click: 0,
  google_calendar_click: 0,
  registry_click: 0,
  more_info_click: 0,
  register_link_click: 0,
  tabling_rsvp_count: 0,
};

function getLocalCounts(): TrackerCounts {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return { ...defaultCounts, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Local storage read error', e);
  }
  return { ...defaultCounts };
}

function saveLocalCounts(counts: TrackerCounts) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(counts));
  } catch (e) {
    console.warn('Local storage write error', e);
  }
}

export function getUserRSVPStatus(): boolean {
  try {
    return localStorage.getItem(LOCAL_RSVP_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setUserRSVPStatus(status: boolean) {
  try {
    localStorage.setItem(LOCAL_RSVP_KEY, status ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
}

// Track an anonymous interaction
export async function trackEvent(event: TrackedEvent): Promise<TrackerCounts> {
  const current = getLocalCounts();
  current[event] = (current[event] || 0) + 1;
  saveLocalCounts(current);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('nmdp-event-tracked', {
        detail: { event, counts: current },
      })
    );
  }

  // Dispatch to Google Analytics 4 if configured
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
    try {
      (window as unknown as { gtag: Function }).gtag('event', event, {
        event_category: 'nmdp_invitation',
        non_interaction: event === 'invitation_view',
      });
    } catch (err) {
      console.warn('GA4 dispatch error', err);
    }
  }

  // Send to backend API
  try {
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.counts) {
        saveLocalCounts(data.counts);
        return data.counts;
      }
    }
  } catch (err) {
    console.warn('API track error (fallback to local):', err);
  }

  return current;
}

// Submit RSVP / Event Registration
export async function submitRSVP(name?: string, email?: string): Promise<{ success: boolean; counts: TrackerCounts; totalRSVPs: number }> {
  setUserRSVPStatus(true);
  try {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.counts) {
        saveLocalCounts(data.counts);
        return { success: true, counts: data.counts, totalRSVPs: data.totalRSVPs || 1 };
      }
    }
  } catch (err) {
    console.warn('RSVP submit error:', err);
  }

  // Local fallback
  const counts = await trackEvent('tabling_rsvp_count');
  return { success: true, counts, totalRSVPs: counts.tabling_rsvp_count || 1 };
}

// Fetch cross-device counts from backend
export async function fetchEventCounts(): Promise<{ counts: TrackerCounts; totalRSVPs: number }> {
  try {
    const res = await fetch('/api/analytics');
    if (res.ok) {
      const data = await res.json();
      if (data.counts) {
        saveLocalCounts(data.counts);
        return { counts: data.counts, totalRSVPs: data.totalRSVPs || 0 };
      }
    }
  } catch (err) {
    console.warn('API analytics fetch error (fallback to local):', err);
  }
  const local = getLocalCounts();
  return { counts: local, totalRSVPs: local.tabling_rsvp_count || 0 };
}
