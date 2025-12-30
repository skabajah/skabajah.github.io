const CSV_FILE = "Master_Arabic_Top_2025.csv";
const TOP_N = 20;

const REGION_LABELS = {
  "g_egypt_sudan": "Egypt & Sudan",
  "g_gulf": "Gulf",
  "g_levant": "Levant",
  "g_north_africa": "North Africa"
};

const els = {
  regions: document.getElementById("regions"),
  grid: document.getElementById("grid"),
  npTitle: document.getElementById("npTitle"),
  npMeta: document.getElementById("npMeta"),
  status: document.getElementById("status"),
};

let bgBackdrop = document.getElementById("bgBackdrop");
let rows = [];
let activeRegion = null;
let activeVideoId = null;
let currentIndex = 0;
let currentList = [];
let ytPlayer = null;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: '',
    playerVars: {
      'autoplay': 1,
      'playsinline': 1,
      'modestbranding': 1,
      'rel': 0
    },
    events: {
      'onStateChange': onPlayerStateChange,
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
  const item = currentList[next];
  play(item.VideoID, item.Title, item.Views, item.Rank, item.Thumbnail, item.PublishDate);
}

function playPrev() {
  if (currentList.length === 0) return;
  const prev = (currentIndex - 1 + currentList.length) % currentList.length;
  const item = currentList[prev];
  play(item.VideoID, item.Title, item.Views, item.Rank, item.Thumbnail, item.PublishDate);
}

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
  const regionOrder = ["g_egypt_sudan", "g_gulf", "g_levant", "g_north_africa"];
  els.regions.innerHTML = regionOrder
    .map(r => {
      const label = REGION_LABELS[r] || r;
      return `<button class="${r === activeRegion ? "active" : ""}" onclick="loadRegion('${r}')">${label}</button>`;
    })
    .join("");
}

function play(videoId, title, views, rank, thumb, publishDate) {
  const id = extractVideoId(videoId);
  if (!id) return;
  activeVideoId = id;
  
  currentIndex = currentList.findIndex(item => extractVideoId(item.VideoID) === id);

  if (ytPlayer && ytPlayer.loadVideoById) {
    ytPlayer.loadVideoById(id);
  }

  if (bgBackdrop) bgBackdrop.style.backgroundImage = `url(${thumb})`;

  els.npTitle.innerHTML = `<span>${rank}</span> ${escapeHtml(title)}`;
  
  const viewCount = views ? `${Number(views.toString().replace(/,/g, '')).toLocaleString()} views` : "";
  const date = publishDate ? ` • ${publishDate}` : "";
  els.npMeta.textContent = `${viewCount}${date}`;
  
  document.querySelectorAll('.card').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-id') === id);
    if (c.getAttribute('data-id') === id) {
      c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
}

function loadRegion(region) {
  activeRegion = region;
  buildRegionTabs();

  // Strict region filtering and ranking sort
  currentList = rows
    .filter(r => r.Region === region)
    .sort((a, b) => {
      const rA = parseInt(a.Rank) || 999;
      const rB = parseInt(b.Rank) || 999;
      return rA - rB;
    })
    .slice(0, TOP_N);

  els.grid.innerHTML = currentList
    .map(r => {
      const id = extractVideoId(r.VideoID);
      return `
      <div class="card ${id === activeVideoId ? "active" : ""}" 
           data-id="${id}"
           onclick="play('${id}','${escapeHtml(r.Title)}','${r.Views}', '${r.Rank}', '${r.Thumbnail}', '${r.PublishDate}')">
        <img src="${r.Thumbnail}" alt="">
        <div class="cardBody">
          <div class="cardRank">#${r.Rank}</div>
          <div class="cardTitle">${escapeHtml(r.Title)}</div>
        </div>
      </div>`;
    })
    .join("");

  if (currentList.length > 0) {
    const r = currentList[0];
    play(r.VideoID, r.Title, r.Views, r.Rank, r.Thumbnail, r.PublishDate);
  }
}

window.addEventListener("keydown", (e) => {
  if (currentList.length === 0) return;
  if (e.key === "ArrowRight") playNext();
  if (e.key === "ArrowLeft") playPrev();
});

fetch(CSV_FILE)
  .then(r => r.text())
  .then(t => {
    const allRows = parseCSV(t);
    rows = allRows.filter(r => r.VideoID && r.Region);
    activeRegion = "g_egypt_sudan";
    buildRegionTabs();
    loadRegion(activeRegion);
    setStatus("Ready");
  });