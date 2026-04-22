// ── 1. Initialize map ──────────────────────────────────────────────────
const map = L.map('map').setView([43.8014, -91.2396], 9);

// ── 2. Base tile layer ─────────────────────────────────────────────────
const baseTile = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }
).addTo(map);

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

const trailData = {
  "type": "FeatureCollection",
  "features": [

  ]
};

const trailLayer = L.geoJSON(trailData, {
  pointToLayer: (feature, latlng) =>
    L.circleMarker(latlng, {
      radius: 7,
      fillColor: '#e8b44a',
      color: '#c89020',
      weight: 2,
      fillOpacity: 0.9
    }),
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(`
      <div class="popup-name">${p.name}</div>
      <div class="popup-detail">Difficulty: ${p.difficulty}</div>
    `);
  }
}).addTo(map);

// ── 6. Layer toggle controls ───────────────────────────────────────────
document.getElementById('toggle-parks').addEventListener('change', e => {
  e.target.checked ? map.addLayer(parkLayer) : map.removeLayer(parkLayer);
});

document.getElementById('toggle-trails').addEventListener('change', e => {
  e.target.checked ? map.addLayer(trailLayer) : map.removeLayer(trailLayer);
});

// Choropleth is the park layer styled by score — same layer, separate toggle label
document.getElementById('toggle-choropleth').addEventListener('change', e => {
  if (e.target.checked) {
    parkLayer.setStyle(feature => ({
      fillColor: getAmenityColor(feature.properties.amenity_score),
      fillOpacity: 0.6
    }));
  } else {
    parkLayer.setStyle({ fillColor: '#4a8c3a', fillOpacity: 0.25 });
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