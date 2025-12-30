const CSV_FILE = "Master_Arabic_Top_2025.csv";

// MAPPING: These 'id' values now match the strings in your CSV 'Region' column exactly
const REGIONS = [
  { id: "All Regions", label: "Global Top 20" },
  { id: "egypt_sudan", label: "Egypt & Sudan" },
  { id: "gulf", label: "Gulf" },
  { id: "levant", label: "Levant" },
  { id: "north_africa", label: "North Africa" }
];

const els = {
  regions: document.getElementById("regions"),
  grid: document.getElementById("grid"),
  npTitle: document.getElementById("npTitle"),
  npMeta: document.getElementById("npMeta"),
  status: document.getElementById("status"),
};

let bgBackdrop = document.getElementById("bgBackdrop");
let rows = [];
let activeRegion = "All Regions";
let activeVideoId = null;
let currentIndex = 0;
let currentList = [];
let ytPlayer = null;

// YouTube API Initialization
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: '',
    playerVars: {
      'autoplay': 1,
      'playsinline': 1,
      'modestbranding': 1,
      'rel': 0,
      'origin': window.location.origin
    },
    events: {
      'onStateChange': onPlayerStateChange,
      'onReady': () => setStatus("Player Ready")
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    playNext();
  }
}

function playNext() {
  if (currentList.length === 0) return;
  const next = (currentIndex + 1) % currentList.length;
  playItem(currentList[next]);
}

function playPrev() {
  if (currentList.length === 0) return;
  const prev = (currentIndex - 1 + currentList.length) % currentList.length;
  playItem(currentList[prev]);
}

function setStatus(msg) {
  if (els.status) els.status.textContent = msg;
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
        cur += '"'; i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur); cur = "";
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
  if (val.includes("v=")) return val.split("v=")[1].split("&")[0];
  if (val.includes("youtu.be/")) return val.split("youtu.be/")[1].split("?")[0];
  return val;
}

function buildRegionTabs() {
  els.regions.innerHTML = REGIONS
    .map(r => `
      <button class="${r.id === activeRegion ? "active" : ""}" 
              onclick="loadRegion('${r.id}')">
        ${r.label}
      </button>`)
    .join("");
}

function playItem(item) {
  if (!item) return;
  const id = extractVideoId(item.VideoID);
  if (!id) return;
  
  activeVideoId = id;
  currentIndex = currentList.findIndex(r => extractVideoId(r.VideoID) === id);

  if (ytPlayer && ytPlayer.loadVideoById) {
    ytPlayer.loadVideoById(id);
  }

  if (bgBackdrop && item.Thumbnail) {
    bgBackdrop.style.backgroundImage = `url(${item.Thumbnail})`;
  }

  els.npTitle.innerHTML = `<span>${item.Rank}</span> ${escapeHtml(item.Title)}`;
  
  const views = item.Views ? `${Number(item.Views.replace(/,/g, '')).toLocaleString()} views` : "";
  const date = item.PublishDate ? ` • ${item.PublishDate}` : "";
  els.npMeta.textContent = `${views}${date}`;
  
  // Highlight active card in grid
  document.querySelectorAll('.card').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-id') === id);
  });
}

function loadRegion(regionId) {
  activeRegion = regionId;
  buildRegionTabs();

  // Filter based on the 'Region' column in CSV
  currentList = rows
    .filter(r => r.Region === regionId)
    .sort((a, b) => (parseInt(a.Rank) || 999) - (parseInt(b.Rank) || 999));

  els.grid.innerHTML = "";
  
  if (currentList.length === 0) {
    els.grid.innerHTML = `<div style="padding:20px;opacity:0.5">No results found for ${regionId}</div>`;
    return;
  }

  currentList.forEach(r => {
    const id = extractVideoId(r.VideoID);
    const card = document.createElement("div");
    card.className = `card ${id === activeVideoId ? "active" : ""}`;
    card.setAttribute("data-id", id);
    card.onclick = () => playItem(r);
    card.innerHTML = `
      <img src="${r.Thumbnail}" onerror="this.src='https://via.placeholder.com/320x180?text=No+Thumb'">
      <div class="cardBody">
        <div class="cardRank">#${r.Rank}</div>
        <div class="cardTitle">${escapeHtml(r.Title)}</div>
      </div>
    `;
    els.grid.appendChild(card);
  });

  // Auto-play the first item of the new region
  playItem(currentList[0]);
  els.grid.scrollTo({ left: 0, behavior: 'smooth' });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") playNext();
  if (e.key === "ArrowLeft") playPrev();
});

// Load CSV Data
fetch(CSV_FILE)
  .then(res => res.text())
  .then(text => {
    rows = parseCSV(text).filter(r => r.VideoID && r.Region);
    loadRegion(activeRegion);
    setStatus("Data Loaded");
  })
  .catch(err => {
    console.error(err);
    setStatus("Error loading CSV");
  });