// app.js

const CSV_FILE = "Master_Arabic_Top_2025.csv";
const TOP_N = 20;

const els = {
  regions: document.getElementById("regions"),
  grid: document.getElementById("grid"),
  playerFrame: document.getElementById("playerFrame"),
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

function parseCSVLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = parseCSVLine(lines[0]);
  const out = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const o = {};
    header.forEach((h, idx) => (o[h] = vals[idx]));
    out.push(o);
  }
  return out;
}

function buildRegionTabs() {
  els.regions.innerHTML = regions
    .map(
      r =>
        `<button class="${r === activeRegion ? "active" : ""}"
          onclick="loadRegion('${r}')">${r}</button>`
    )
    .join("");
}

function play(videoId, title, views) {
  if (!videoId) return;
  activeVideoId = videoId;

  els.playerFrame.src =
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`;

  els.npTitle.textContent = title;
  els.npMeta.textContent = views ? `${Number(views).toLocaleString()} views` : "";
}

function loadRegion(region) {
  activeRegion = region;
  buildRegionTabs();

  const list = rows
    .filter(r => r.Region === region)
    .sort((a, b) => Number(a.Rank) - Number(b.Rank))
    .slice(0, TOP_N);

  els.listTitle.textContent = `${region} — Top ${list.length}`;

  els.grid.innerHTML = list
    .map(
      r => `
      <div class="card ${r.VideoID === activeVideoId ? "active" : ""}"
           onclick="play('${r.VideoID}','${escapeHtml(r.Title)}','${r.Views}')">
        <img src="${r.Thumbnail}" alt="">
        <div class="cardBody">
          <div class="cardRank">#${r.Rank}</div>
          <div class="cardTitle">${escapeHtml(r.Title)}</div>
        </div>
      </div>
    `
    )
    .join("");

  if (list[0]) {
    play(list[0].VideoID, list[0].Title, list[0].Views);
  }
}

fetch(CSV_FILE)
  .then(r => r.text())
  .then(t => {
    rows = parseCSV(t);
    regions = [...new Set(rows.map(r => r.Region))];
    activeRegion = regions[0];
    buildRegionTabs();
    loadRegion(activeRegion);
    setStatus("Loaded");
  })
  .catch(e => setStatus("Failed to load CSV"));
