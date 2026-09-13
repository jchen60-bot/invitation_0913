// Calendar event generation for Apple Calendar (.ics), Google Calendar, and Outlook

export const EVENT_DETAILS = {
  title: "NMDP Tabling Session at UC Berkeley",
  description: "Stop by, meet NMDP + Berkeley MDes students, and learn how you could become someone's match.",
  location: "Outside Amazon Hub Locker, 2495 Bancroft Way, Berkeley, CA 94720",
  startUtc: "20260921T170000Z", // 10:00 AM PT = 17:00 UTC
  endUtc: "20260921T190000Z",   // 12:00 PM PT = 19:00 UTC
  startLocal: "2026-09-21T10:00:00",
  endLocal: "2026-09-21T12:00:00",
};

export function downloadAppleIcsFile(): void {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NMDP x UC Berkeley//Digital Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:America/Los_Angeles",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0800",
    "TZOFFSETTO:-0700",
    "TZNAME:PDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0700",
    "TZOFFSETTO:-0800",
    "TZNAME:PST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:nmdp-ucb-${Date.now()}@nmdp-berkeley.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;TZID=America/Los_Angeles:20260921T100000`,
    `DTEND;TZID=America/Los_Angeles:20260921T120000`,
    `SUMMARY:${EVENT_DETAILS.title}`,
    `DESCRIPTION:${EVENT_DETAILS.description}`,
    `LOCATION:${EVENT_DETAILS.location}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: NMDP Tabling Session starts in 30 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "NMDP-Tabling-Session-UC-Berkeley.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_DETAILS.title,
    dates: `${EVENT_DETAILS.startUtc}/${EVENT_DETAILS.endUtc}`,
    details: EVENT_DETAILS.description,
    location: EVENT_DETAILS.location,
    ctz: "America/Los_Angeles",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(): string {
  const params = new URLSearchParams({
    rru: "addevent",
    subject: EVENT_DETAILS.title,
    startdt: EVENT_DETAILS.startLocal,
    enddt: EVENT_DETAILS.endLocal,
    body: EVENT_DETAILS.description,
    location: EVENT_DETAILS.location,
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
