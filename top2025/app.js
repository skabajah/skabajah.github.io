const REGION_CONFIG = {
  "All Regions": "Top_Arabic_2025_All_Regions.csv",
  "egypt_sudan": "Top_Arabic_2025_Egypt_Sudan.csv",
  "gulf": "Top_Arabic_2025_Gulf.csv",
  "levant": "Top_Arabic_2025_Levant.csv",
  "north_africa": "Top_Arabic_2025_North_Africa.csv"
};

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
let activeRegion = "All Regions";
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
      'onStateChange': (e) => { if (e.data === YT.PlayerState.ENDED) playNext(); },
      'onReady': () => setStatus("Ready")
    }
  });
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
  return String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  
  const parseLine = (line) => {
    const out = []; let cur = ""; let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; } 
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) { out.push(cur); cur = ""; } 
      else cur += ch;
    }
    out.push(cur); return out;
  };

  const header = parseLine(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = parseLine(line);
    const o = {};
    header.forEach((h, idx) => { o[h] = vals[idx] ? vals[idx].trim() : ""; });
    return o;
  });
}

function extractVideoId(val) {
  if (!val) return null;
  if (val.includes("v=")) return val.split("v=")[1].split("&")[0];
  if (val.includes("youtu.be/")) return val.split("youtu.be/")[1].split("?")[0];
  return val;
}

function buildRegionTabs() {
  els.regions.innerHTML = REGIONS
    .map(r => `<button class="${r.id === activeRegion ? "active" : ""}" onclick="switchRegion('${r.id}')">${r.label}</button>`)
    .join("");
}

function playItem(item) {
  if (!item) return;
  const id = extractVideoId(item.VideoID);
  if (!id) return;
  
  activeVideoId = id;
  currentIndex = currentList.findIndex(r => extractVideoId(r.VideoID) === id);

  if (ytPlayer?.loadVideoById) ytPlayer.loadVideoById(id);
  if (bgBackdrop && item.Thumbnail) bgBackdrop.style.backgroundImage = `url(${item.Thumbnail})`;

  els.npTitle.innerHTML = `<span>${item.Rank}</span> ${escapeHtml(item.Title)}`;
  const views = item.Views ? `${Number(item.Views.replace(/,/g, '')).toLocaleString()} views` : "";
  els.npMeta.textContent = `${views} • ${item.PublishDate || ""}`;
  
  document.querySelectorAll('.card').forEach(c => c.classList.toggle('active', c.getAttribute('data-id') === id));
}

async function switchRegion(regionId) {
  activeRegion = regionId;
  buildRegionTabs();
  setStatus("Updating...");

  const fileName = REGION_CONFIG[regionId];
  try {
    const res = await fetch(fileName);
    if (!res.ok) throw new Error("File not found");
    const text = await res.text();
    
    currentList = parseCSV(text)
      .filter(r => r.VideoID)
      .sort((a, b) => (parseInt(a.Rank) || 999) - (parseInt(b.Rank) || 999));

    els.grid.innerHTML = "";
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
        </div>`;
      els.grid.appendChild(card);
    });

    if (currentList.length > 0) playItem(currentList[0]);
    els.grid.scrollTo({ left: 0, behavior: 'smooth' });
    setStatus("Ready");
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${fileName} missing`);
    els.grid.innerHTML = `<div style="padding:20px; color:red;">Could not load ${fileName}</div>`;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") playNext();
  if (e.key === "ArrowLeft") playPrev();
});

switchRegion(activeRegion);