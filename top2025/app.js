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
  if (lines.length === 0) return [];
  
  const header = parseCSVLine(lines[0]).map(h => h.trim());
  const out = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const o = {};
    header.forEach((h, idx) => {
      o[h] = vals[idx] ? vals[idx].trim() : "";
    });
    out.push(o);
  }
  return out;
}

function extractVideoId(val) {
  if (!val) return null;
  // If it's a full URL, extract the ID
  if (val.includes("v=")) return val.split("v=")[1].split("&")[0];
  if (val.includes("youtu.be/")) return val.split("youtu.be/")[1].split("?")[0];
  return val; // Assume it's already an ID
}

function buildRegionTabs() {
  els.regions.innerHTML = regions
    .map(r => `<button class="${r === activeRegion ? "active" : ""}" onclick="loadRegion('${r}')">${r}</button>`)
    .join("");
}

function play(videoId, title, views) {
  const id = extractVideoId(videoId);
  if (!id || id === "undefined") return;
  activeVideoId = id;

  const origin = window.location.origin;
  // enablejsapi=1 and origin are often required for programmatic autoplay
  els.playerFrame.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&origin=${origin}`;

  els.npTitle.textContent = title;
  els.npMeta.textContent = views ? `${Number(views.toString().replace(/,/g, '')).toLocaleString()} views` : "";
  
  document.querySelectorAll('.card').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-id') === id);
  });
}

function handleThumbError(img, videoId) {
  const id = extractVideoId(videoId);
  if (!img.dataset.triedFallback && id) {
    img.dataset.triedFallback = "true";
    img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  } else {
    img.src = 'https://via.placeholder.com/120x90?text=No+Thumb';
  }
}

function loadRegion(region) {
  activeRegion = region;
  buildRegionTabs();

  const list = rows
    .filter(r => r.Region === region)
    .sort((a, b) => Number(a.Rank?.toString().replace(/,/g, '') || 0) - Number(b.Rank?.toString().replace(/,/g, '') || 0))
    .slice(0, TOP_N);

  els.listTitle.textContent = `${region} — Top ${list.length}`;

  els.grid.innerHTML = list
    .map(r => {
      const id = extractVideoId(r.VideoID);
      return `
      <div class="card ${id === activeVideoId ? "active" : ""}" 
           data-id="${id}"
           onclick="play('${id}','${escapeHtml(r.Title)}','${r.Views}')">
        <img src="${r.Thumbnail}" alt="" onerror="handleThumbError(this, '${id}')">
        <div class="cardBody">
          <div class="cardRank">#${r.Rank}</div>
          <div class="cardTitle">${escapeHtml(r.Title)}</div>
        </div>
      </div>`;
    })
    .join("");

  // Start the first video
  if (list[0]) {
    play(list[0].VideoID, list[0].Title, list[0].Views);
  }
}

fetch(CSV_FILE)
  .then(r => {
    if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
    return r.text();
  })
  .then(t => {
    const allRows = parseCSV(t);
    
    rows = allRows.filter(r => {
      // Clean numeric strings in case they contain commas or spaces
      const comms = parseInt(r.Comments?.toString().replace(/,/g, '')) || 0;
      const likes = parseInt(r.Likes?.toString().replace(/,/g, '')) || 0;
      return comms > 0 && likes > 0 && r.VideoID && r.Region;
    });

    regions = [...new Set(rows.map(r => r.Region))].filter(Boolean);
    
    if (regions.length > 0) {
      activeRegion = regions[0];
      buildRegionTabs();
      loadRegion(activeRegion);
      setStatus("Loaded");
    } else {
      setStatus("No rows matched filters (Comments > 0 and Likes > 0)");
    }
  })
  .catch(e => {
    console.error(e);
    setStatus("Error: " + e.message);
  });