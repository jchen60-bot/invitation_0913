import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "events.json");
const RSVPS_FILE = path.join(DATA_DIR, "rsvps.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface EventCounts {
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

const initialCounts: EventCounts = {
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

function readCounts(): EventCounts {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return { ...initialCounts, ...JSON.parse(content) };
    }
  } catch (err) {
    console.error("Error reading events file:", err);
  }
  return { ...initialCounts };
}

function writeCounts(counts: EventCounts) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(counts, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing events file:", err);
  }
}

interface RSVPRecord {
  id: string;
  name?: string;
  email?: string;
  timestamp: string;
}

function readRSVPs(): RSVPRecord[] {
  try {
    if (fs.existsSync(RSVPS_FILE)) {
      const content = fs.readFileSync(RSVPS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading RSVPs file:", err);
  }
  return [];
}

function writeRSVPs(rsvps: RSVPRecord[]) {
  try {
    fs.writeFileSync(RSVPS_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing RSVPs file:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Track interaction event across devices
  app.post("/api/track", (req, res) => {
    const { event } = req.body;
    if (!event || typeof event !== "string") {
      return res.status(400).json({ error: "Missing event name" });
    }

    const counts = readCounts();
    if (typeof counts[event] === "number") {
      counts[event] += 1;
    } else {
      counts[event] = 1;
    }
    writeCounts(counts);

    res.json({ success: true, event, counts });
  });

  // Submit RSVP / Event Registration
  app.post("/api/rsvp", (req, res) => {
    const { name, email } = req.body;
    const rsvps = readRSVPs();

    const record: RSVPRecord = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: typeof name === "string" ? name.trim() : undefined,
      email: typeof email === "string" ? email.trim() : undefined,
      timestamp: new Date().toISOString(),
    };

    rsvps.push(record);
    writeRSVPs(rsvps);

    // Also increment tabling_rsvp_count in counts
    const counts = readCounts();
    counts.tabling_rsvp_count = (counts.tabling_rsvp_count || 0) + 1;
    writeCounts(counts);

    res.json({ success: true, record, totalRSVPs: rsvps.length, counts });
  });

  // Get interaction counts & RSVP totals
  app.get("/api/analytics", (req, res) => {
    const counts = readCounts();
    const rsvps = readRSVPs();
    res.json({ counts, totalRSVPs: rsvps.length });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
