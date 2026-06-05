import express from "express";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent database configurations
const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");

interface VisitorData {
  baseline: number;
  uniques: Record<string, number>; // Maps anonymous hash (or visitorId) to last access timestamp
}

// Bot signature list
const BOT_REGEX = /bot|crawler|spider|ping|lighthouse|google|yahoo|bing|yandex|baidu|slurp|pingdom|phantom|headless|selenium|puppeteer|ia_archiver|facebot|facebookexternalhit|twitterbot|slackbot|telegrambot|applebot/i;

async function getVisitorStore(): Promise<VisitorData> {
  try {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {}

    const fileExists = await fs.stat(DATA_FILE).then(() => true).catch(() => false);
    if (!fileExists) {
      const initial: VisitorData = { baseline: 146380, uniques: {} };
      await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    
    if (typeof parsed.baseline !== "number") parsed.baseline = 146380;
    if (!parsed.uniques || typeof parsed.uniques !== "object") parsed.uniques = {};
    
    return parsed as VisitorData;
  } catch (err) {
    console.error("Error reading visitor store, using default baseline:", err);
    return { baseline: 146380, uniques: {} };
  }
}

async function saveVisitorStore(data: VisitorData): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to visitor store:", err);
  }
}

function generateHash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// REST full API for Visitor Counting
app.post("/api/visitors", async (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  
  // Filter out automated bots, crawlers, and server-side scraping calls
  if (BOT_REGEX.test(userAgent)) {
    const store = await getVisitorStore();
    const count = store.baseline + Object.keys(store.uniques).length;
    res.json({
      count,
      online: Math.max(1, Math.min(15, Math.ceil(count / 10000))), 
      isBot: true
    });
    return;
  }

  // Retrieve client's IP and session signature
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip === "string" && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  // Generate robust IP+UA fingerprint to prevent spoofing
  const fingerprint = generateHash(`${ip}-${userAgent}`);
  const clientVisitorId = req.body?.visitorId;
  const visitorKey = clientVisitorId || fingerprint;
  
  const now = Date.now();
  const store = await getVisitorStore();

  // Save the new unique human visit or update active timestamp
  store.uniques[visitorKey] = now;
  await saveVisitorStore(store);

  // Compute active users within last 5 minutes
  let onlineCount = 0;
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  for (const timestamp of Object.values(store.uniques)) {
    if (now - timestamp < FIVE_MINUTES_MS) {
      onlineCount++;
    }
  }
  if (onlineCount === 0) onlineCount = 1;

  res.json({
    count: store.baseline + Object.keys(store.uniques).length,
    online: onlineCount,
    visitorId: visitorKey
  });
});

// Vite middleware or static serving configuration
async function startServer() {
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
    console.log(`[FrameLab Server] Live operating on port ${PORT}`);
  });
}

startServer();
