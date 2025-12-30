// app.js
// Expects: Master_Arabic_Top_2025.csv in same folder
// Columns: Rank,Views,Likes,Comments,Title,VideoID,PublishDate,Link,Region,Source_File,Thumbnail

const CSV_FILE = "Master_Arabic_Top_2025.csv";
const TOP_N = 20;

const els = {
  regions: document.getElementById("regions"),
  grid: document.getElementById("grid"),
  playerFrame: document.getElementById("playerFrame"),
  nowPlaying: document.getElementById("nowPlaying"),
  npTitle: document.getElementById("npTitle"),
  npMeta: document.getElementById("npMeta"),
  listTitle: document.getElementById("listTitle"),
  status: document.getElementById("status"),
};

let rows = [];
let regions = [];
let activeRegion = null;
let activeVideoId = null;

function setStatus(msg) {
  els.status.textContent = msg;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fmtNum(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return String(n ?? "");
  return x.toLocaleString("en-US");
}

function parseCSVLine(line) {
  // Minimal CSV parser for quoted commas
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]).map((h) => h.trim());
  const out = [];

  for (let i = 1; i < lines
