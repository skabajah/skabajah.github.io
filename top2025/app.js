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

// Create or get background elements for the cinematic effect
let bgBackdrop = document.getElementById("bgBackdrop");
if (!bgBackdrop) {
  bgBackdrop = document.createElement("div");
  bgBackdrop.id = "bgBackdrop";
  bgBackdrop.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:-2; background-size:cover; background-position:center; filter: blur(60px) brightness(0.4); transition: background-image 0.8s ease-in-out; transform: scale(1.1);";
  document.body.prepend(bgBackdrop);
}

let rows = [];
let regions = [];
let activeRegion = null;
let activeVideoId = null;
let currentIndex = 0;
let currentList = [];

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
  if (val.includes("v=")) return val.split("v=")[1].split("&")[0];
  if (val.includes("youtu.be/")) return val.split("youtu.be/")[1].split("?")[0];
  return val;
}

function buildRegionTabs() {
  els.regions.innerHTML = regions
    .map(r => `<button class="${r === activeRegion ? "active" : ""}" onclick="loadRegion('${r}')">${r}</button>`)
    .join("");
}

function play(videoId, title, views, rank, thumb, publishDate) {
  const id = extractVideoId(videoId);
  if (!id || id === "undefined") return;
  activeVideoId = id;
  currentIndex = currentList.findIndex(item => extractVideoId(item.VideoID) === id);

  const origin = window.location.origin;
  els.playerFrame.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&playsinline=1&enablejsapi=1&origin=${origin}`;

  // Cinematic Background
  bgBackdrop.style.backgroundImage = `url(${thumb})`;

  // Update Metadata with large Rank
  els.npTitle.innerHTML = `<span style="font-size: 5rem; font-weight: 900; opacity: 0.5; margin-right: 20px; line-height: 1;">${rank}</span> ${escapeHtml(title)}`;
  
  const viewCount = views ? `${Number(views.toString().replace(/,/g, '')).toLocaleString()} views` : "";
  const date = publishDate ? ` • ${publishDate}` : "";
  els.npMeta.textContent = `${viewCount}${date}`;
  
  // Highlight card in list
  document.querySelectorAll('.card').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-id') === id);
  });
}

function handleThumbError(img, videoId) {
  const id = extractVideoId(videoId);
  if (!img.dataset.triedFallback && id) {
    img.dataset.triedFallback = "true";
    img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
}

function loadRegion(region) {
  activeRegion = region;
  buildRegionTabs();

  currentList = rows
    .filter(r => r.Region === region)
    .sort((a, b) => Number(a.Rank?.toString().replace(/,/g, '') || 0) - Number(b.Rank?.toString().replace(/,/g, '') || 0))
    .slice(0, TOP_N);

  els.listTitle.textContent = `${region} — Top ${currentList.length}`;

  els.grid.innerHTML = currentList
    .map(r => {
      const id = extractVideoId(r.VideoID);
      return `
      <div class="card ${id === activeVideoId ? "active" : ""}" 
           data-id="${id}"
           onclick="play('${id}','${escapeHtml(r.Title)}','${r.Views}', '${r.Rank}', '${r.Thumbnail}', '${r.PublishDate}')">
        <img src="${r.Thumbnail}" alt="" onerror="handleThumbError(this, '${id}')">
        <div class="cardBody">
          <div class="cardRank">#${r.Rank}</div>
          <div class="cardTitle">${escapeHtml(r.Title)}</div>
        </div>
      </div>`;
    })
    .join("");

  if (currentList[0]) {
    const r = currentList[0];
    play(r.VideoID, r.Title, r.Views, r.Rank, r.Thumbnail, r.PublishDate);
  }
}

// Keyboard Navigation
window.addEventListener("keydown", (e) => {
  if (currentList.length === 0) return;
  
  if (e.key === "ArrowRight") {
    const next = (currentIndex + 1) % currentList.length;
    const item = currentList[next];
    play(item.VideoID, item.Title, item.Views, item.Rank, item.Thumbnail, item.PublishDate);
  } else if (e.key === "ArrowLeft") {
    const prev = (currentIndex - 1 + currentList.length) % currentList.length;
    const item = currentList[prev];
    play(item.VideoID, item.Title, item.Views, item.Rank, item.Thumbnail, item.PublishDate);
  }
});

fetch(CSV_FILE)
  .then(r => {
    if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
    return r.text();
  })
  .then(t => {
    const allRows = parseCSV(t);
    rows = allRows.filter(r => {
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
      setStatus("No rows matched filters");
    }
  })
  .catch(e => {
    console.error(e);
    setStatus("Error: " + e.message);
  });