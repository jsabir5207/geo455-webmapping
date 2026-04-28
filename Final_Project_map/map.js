// ── 1. Initialize map ──────────────────────────────────────────────────
const map = L.map('map').setView([43.8014, -91.2396], 10);

// ── 2. Base tile layer ─────────────────────────────────────────────────
const cartoDB = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
  maxZoom: 19
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© <a href="https://www.esri.com/">Esri</a>',
  maxZoom: 19
});

// Add CartoDB as the default
cartoDB.addTo(map);

// ── Basemap switcher ───────────────────────────────────────────────────
const baseMaps = {
  "Street": cartoDB,
  "Satellite": satellite
};

L.control.layers(baseMaps, null, { position: 'topleft' }).addTo(map);

// ── 3. Amenity score legend ───────────────────────────────────────
function getAmenityColor(score) {
  const colors = {
    5: '#1a4a1a',
    4: '#2d6b2d',
    3: '#4a8c3a',
    2: '#7ab05a',
    1: '#b8d48a'
  };
  return colors[score] || '#b8d48a';
}

// ── 4. State park polygon layer ────────────────────────────────────────

let parkLayer = L.geoJSON(null, {
  style: feature => ({
    fillColor: getAmenityColor(feature.properties.AMENITY),
    fillOpacity: 0.6,
    color: '#c8d4a0',
    weight: 1.5
  }),
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(`
      <div class="popup-name">${p.NAME}</div>
      <div class="popup-detail">Amenity score: ${p.AMENITY} / 5</div>
    `);
  }
}).addTo(map);

fetch('parks.geojson')
  .then(response => response.json())
  .then(data => parkLayer .addData(data));

// ── 5. Trailhead point layer ───────────────────────────────────────────
// TODO: Replace trailData with GeoJSON from ArcGIS.

// ── Trail difficulty color function ───────────────────────────────────
function getDifficultyColor(difficulty) {
  const colors = {
    'easy': '#1ed0e2',
    'intermediate': '#e5f648',
    'hard': '#d01c8b'
  };
  return colors[difficulty.toLowerCase()] || '#d01c8b';
}

// ── Trail line layer ──────────────────────────────────────────────────
let trailLayer = L.geoJSON(null, {
  style: feature => ({
    color: getDifficultyColor(feature.properties.Difficulty),
    weight: 3,
    opacity: 0.8
  }),
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(`
      <div class="popup-name">${p.NAME}</div>
      <div class="popup-detail">Difficulty: ${p.Difficulty}</div>
      <div class="popup-detail">Length: ${parseFloat(p.Length).toFixed(1)} miles</div>
      <div class="popup-detail">Hiking: ${p.HIKING}</div>
      <div class="popup-detail">Biking: ${p.Biking}</div>
    `);
  }
}).addTo(map);

fetch('trails.geojson')
  .then(response => response.json())
  .then(data => {
    trailLayer.addData(data);
    trailLayer.bringToFront();
  });
  


// ── 6. Layer toggle controls ───────────────────────────────────────────
document.getElementById('toggle-parks').addEventListener('change', e => {
  e.target.checked ? map.addLayer(parkLayer) : map.removeLayer(parkLayer);
});

document.getElementById('toggle-trails').addEventListener('change', e => {
  e.target.checked ? map.addLayer(trailLayer) : map.removeLayer(trailLayer);
});

// separate toggle label for choropleth
document.getElementById('toggle-choropleth').addEventListener('change', e => {
  if (e.target.checked) {
    parkLayer.setStyle(feature => ({
      fillColor: getAmenityColor(feature.properties.AMENITY),
      fillOpacity: 0.6,
      color: '#c8d4a0',
      weight: 1.5
    }));
  } else {
    parkLayer.setStyle({
      fillColor: '#4a8c3a',
      fillOpacity: 0.25,
      color: '#c8d4a0',
      weight: 1.5
    });
  }
});

// ── 7. Home button ─────────────────────────────────────────────────────
const homeCoords = [43.8014, -91.2396];
const homeZoom = 9;

const homeBtn = L.control({ position: 'topleft' });

homeBtn.onAdd = function () {
  const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
  btn.innerHTML = '⌂';
  btn.title = 'Return to initial extent';
  btn.style.cssText = 'font-size:18px; width:34px; height:34px; cursor:pointer; background:white; border:none;';
  L.DomEvent.on(btn, 'click', function () {
    map.setView(homeCoords, homeZoom);
  });
  return btn;
};

homeBtn.addTo(map);

// ── Legend collapse ────────────────────────────────────────────────────
function toggleLegend(bodyId) {
  const body = document.getElementById(bodyId);
  const btn = body.previousElementSibling.querySelector('.legend-toggle');
  if (body.style.display === 'none') {
    body.style.display = 'block';
    btn.textContent = '−';
  } else {
    body.style.display = 'none';
    btn.textContent = '+';
  }
}